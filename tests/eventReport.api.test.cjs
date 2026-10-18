const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function loadApi(fetch) {
    const source = fs.readFileSync('src/api/eventReport.api.ts', 'utf8');
    const { outputText } = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS }
    });
    const context = {
        exports: {}, fetch, URLSearchParams,
        require: name => name.includes('storage')
            ? { getToken: () => 'test-token' }
            : { API_BASE_URL: 'http://test' }
    };
    vm.runInNewContext(outputText, context);
    return context.exports;
}

const payload = { summaryInfo: {} };

test('validation response preserves server messages and is not a success', async () => {
    const api = loadApi(async () => ({ ok: false, status: 400,
        json: async () => ({ message: ['required field'] }) }));
    const result = await api.createEventReport(payload);
    assert.equal(result.success, false);
    assert.equal(result.status, 400);
    assert.equal(result.message[0], 'required field');
});

test('successful creation returns the saved ID', async () => {
    const api = loadApi(async () => ({ ok: true, status: 201,
        json: async () => ({ data: { id: 'saved-id' } }) }));
    const result = await api.createEventReport(payload);
    assert.equal(result.success, true);
    assert.equal(result.id, 'saved-id');
});

test('malformed success and network failure do not report a saved event', async () => {
    const malformed = loadApi(async () => ({ ok: true, status: 201, json: async () => ({}) }));
    assert.equal((await malformed.createEventReport(payload)).success, false);
    const offline = loadApi(async () => { throw new Error('offline'); });
    assert.equal((await offline.createEventReport(payload)).status, 0);
});

test('detail loading sends authentication and rejects inaccessible events', async () => {
    const api = loadApi(async (url, options) => {
        assert.equal(url, 'http://test/event-report/saved-id');
        assert.equal(options.headers.Authorization, 'Bearer test-token');
        return { ok: false, json: async () => ({ message: 'not found' }) };
    });
    await assert.rejects(api.getEventReport('saved-id'), /not found/);
});
