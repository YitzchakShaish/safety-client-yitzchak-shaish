const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function setup(status, nextToken) {
    let token = 'old-token';
    let removedUser = false;
    let events = 0;
    const { outputText } = ts.transpileModule(fs.readFileSync('src/api/authenticatedFetch.ts', 'utf8'), {
        compilerOptions: { module: ts.ModuleKind.CommonJS }
    });
    const context = {
        exports: {}, Headers, Event,
        window: { dispatchEvent: () => { events++; } },
        require: () => ({ getToken: () => token, removeToken: () => { token = null; },
            removeUser: () => { removedUser = true; } }),
        fetch: async (_, options) => {
            assert.equal(options.headers.get('Authorization'), 'Bearer old-token');
            assert.equal(options.credentials, 'include');
            if (nextToken) token = nextToken;
            return { status };
        }
    };
    vm.runInNewContext(outputText, context);
    return { request: context.exports.authenticatedFetch,
        state: () => ({ token, removedUser, events }) };
}

test('401 clears session and notifies the user context', async () => {
    const api = setup(401);
    await api.request('/test');
    assert.deepEqual(api.state(), { token: null, removedUser: true, events: 1 });
});

test('403 and successful responses do not log the user out', async () => {
    for (const status of [200, 403]) {
        const api = setup(status);
        await api.request('/test');
        assert.equal(api.state().events, 0);
        assert.equal(api.state().token, 'old-token');
    }
});

test('an older rejected request does not clear a new session', async () => {
    const api = setup(401, 'new-token');
    await api.request('/test');
    assert.deepEqual(api.state(), { token: 'new-token', removedUser: false, events: 0 });
});
