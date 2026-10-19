const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

function transpile(path) {
    const source = fs.readFileSync(path, "utf8");
    const { outputText } = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    });
    return outputText;
}

function loadAvatar() {
    const context = { exports: {} };
    vm.runInNewContext(transpile("src/utils/avatar.ts"), context);
    return context.exports;
}

function loadApi(handler) {
    const calls = [];
    let token = "tok";
    let removedUser = false;
    const fetchContext = {
        exports: {},
        Headers,
        Event,
        window: { dispatchEvent() { calls.push({ event: "session-expired" }); } },
        fetch: async (url, options) => {
            calls.push({ url, options });
            return handler(url, options);
        },
        require: () => ({
            getToken: () => token,
            removeToken: () => { token = null; },
            removeUser: () => { removedUser = true; },
        }),
    };
    vm.runInNewContext(transpile("src/api/authenticatedFetch.ts"), fetchContext);

    const apiContext = {
        exports: {},
        FormData,
        File,
        require: (name) => {
            if (name.includes("authenticatedFetch")) return fetchContext.exports;
            if (name.includes("env")) return { API_BASE_URL: "http://test" };
            if (name.includes("avatar")) return loadAvatar();
            throw new Error(`unexpected module ${name}`);
        },
    };
    vm.runInNewContext(transpile("src/api/users.api.ts"), apiContext);
    return { api: apiContext.exports, calls, state: () => ({ token, removedUser }) };
}

const png = () => new File([Uint8Array.from([137, 80, 78, 71])], "me.PNG", { type: "image/png" });

test("upload sends one avatar file through the authenticated helper without a manual content type", async () => {
    const file = png();
    const { api, calls } = loadApi(async () => ({
        ok: true,
        status: 200,
        json: async () => ({
            message: "תמונת הפרופיל עודכנה בהצלחה",
            data: { id: "u1", fullName: "דנה לוי", avatarUrl: "/uploads/avatars/1.png" },
        }),
    }));

    const result = await api.uploadMyAvatar(file);
    assert.equal(result.message, "תמונת הפרופיל עודכנה בהצלחה");
    assert.equal(result.data.avatarUrl, "/uploads/avatars/1.png");
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "http://test/users/me/avatar");
    assert.equal(calls[0].options.method, "POST");
    assert.equal(calls[0].options.credentials, "include");
    assert.equal(calls[0].options.headers.get("Authorization"), "Bearer tok");
    assert.equal(calls[0].options.headers.has("Content-Type"), false);
    const sent = calls[0].options.body.get("avatar");
    assert.equal(sent.name, "me.PNG");
    assert.equal(sent.type, "image/png");
});

test("upload and delete show the Hebrew message returned by the server", async () => {
    const invalid = loadApi(async () => ({
        ok: false,
        status: 400,
        json: async () => ({ message: "הקובץ אינו תמונה תקינה" }),
    }));
    await assert.rejects(() => invalid.api.uploadMyAvatar(png()), { message: "הקובץ אינו תמונה תקינה" });

    const missing = loadApi(async () => ({
        ok: false,
        status: 400,
        json: async () => ({ message: "אין תמונת פרופיל להסרה" }),
    }));
    await assert.rejects(() => missing.api.removeMyAvatar(), { message: "אין תמונת פרופיל להסרה" });
});

test("client-side type and size checks never reach the server", async () => {
    const { api, calls } = loadApi(async () => {
        throw new Error("should not be called");
    });
    await assert.rejects(
        () => api.uploadMyAvatar(new File([Uint8Array.from([1])], "notes.txt", { type: "text/plain" })),
        /ניתן להעלות קובצי תמונה בלבד/,
    );
    await assert.rejects(
        () => api.uploadMyAvatar(new File([new Uint8Array(5 * 1024 * 1024 + 1)], "big.jpg", { type: "image/jpeg" })),
        /5MB/,
    );
    assert.equal(calls.length, 0);
});

test("delete clears avatarUrl through the same authenticated helper", async () => {
    const { api, calls } = loadApi(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ message: "תמונת הפרופיל הוסרה", data: { avatarUrl: null } }),
    }));
    const result = await api.removeMyAvatar();
    assert.equal(result.message, "תמונת הפרופיל הוסרה");
    assert.equal(result.data.avatarUrl, null);
    assert.equal(calls[0].url, "http://test/users/me/avatar");
    assert.equal(calls[0].options.method, "DELETE");
    assert.equal(calls[0].options.headers.get("Authorization"), "Bearer tok");
    assert.equal(calls[0].options.credentials, "include");
});

test("an expired session is cleared when an avatar request is rejected", async () => {
    const { api, calls, state } = loadApi(async () => ({
        ok: false,
        status: 401,
        json: async () => ({ message: "תוקף ההתחברות פג – יש להתחבר מחדש" }),
    }));
    await assert.rejects(() => api.uploadMyAvatar(png()), /תוקף ההתחברות פג/);
    assert.deepEqual(state(), { token: null, removedUser: true });
    assert.equal(calls.some((call) => call.event === "session-expired"), true);
});

test("loading the current user keeps avatarUrl from the response", async () => {
    const { api, calls } = loadApi(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ data: { id: "u1", fullName: "דנה", avatarUrl: "/uploads/avatars/a.webp" } }),
    }));
    const user = await api.getCurrentUser();
    assert.equal(user.avatarUrl, "/uploads/avatars/a.webp");
    assert.equal(calls[0].url, "http://test/users/me");
    assert.equal(calls[0].options.headers.get("Authorization"), "Bearer tok");
});

test("a dropped connection is reported in Hebrew", async () => {
    const { api } = loadApi(async () => {
        throw new Error("offline");
    });
    await assert.rejects(() => api.removeMyAvatar(), { message: "לא ניתן להתחבר לשרת" });
});
