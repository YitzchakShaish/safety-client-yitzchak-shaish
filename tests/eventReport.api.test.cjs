const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function loadModule(file, requireImpl) {
    const source = fs.readFileSync(file, 'utf8');
    const { outputText } = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS }
    });
    const context = { exports: {}, require: requireImpl, URLSearchParams };
    vm.runInNewContext(outputText, context);
    return context.exports;
}

function loadApi(fetch) {
    const readJson = loadModule('src/api/readJson.ts', () => ({}));
    return loadModule('src/api/eventReport.api.ts', name => {
        if (name.includes('authenticatedFetch')) return { authenticatedFetch: fetch };
        if (name.includes('storage')) return { getToken: () => 'test-token' };
        if (name.includes('readJson')) return readJson;
        return { API_BASE_URL: 'http://test' };
    });
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

test('date filter sends the whole end day and keeps approval boolean', async () => {
    let listUrl = '';
    let saved;
    const api = loadApi(async (url, options) => {
        if (options && options.method === 'PUT') {
            saved = JSON.parse(options.body);
            return { ok: true, status: 200, json: async () => ({ message: 'ok' }) };
        }
        listUrl = url;
        return { ok: true, status: 200, json: async () => ({ data: [], pagination: { total: 0, page: 1 } }) };
    });

    await api.getAllEventReports({ dateFrom: '2024-10-19', dateTo: '2024-10-19' });
    const query = new URL(listUrl).searchParams;
    assert.equal(query.get('dateFrom'), '2024-10-19');
    assert.equal(query.get('dateTo'), '2024-10-19 23:59:59.999');

    await api.updateEventReport({
        id: 'saved-id',
        images: [],
        reporterInfo: {},
        eventInfo: {},
        summaryInfo: { approval: 'false', recommendations: 'x', eventStatus: 'טופל' },
    });
    assert.equal(saved.summaryInfo.approval, false);
});

test('detail loading sends authentication and rejects inaccessible events', async () => {
    const api = loadApi(async (url, options) => {
        assert.equal(url, 'http://test/event-report/saved-id');
        assert.equal(options.headers.Authorization, 'Bearer test-token');
        return { ok: false, json: async () => ({ message: 'not found' }) };
    });
    await assert.rejects(api.getEventReport('saved-id'), /not found/);
});
