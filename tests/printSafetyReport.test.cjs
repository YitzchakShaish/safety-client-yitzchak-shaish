const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function loadModule() {
    const source = fs.readFileSync('src/utils/printSafetyReport.ts', 'utf8');
    const { outputText } = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
    });
    const context = { exports: {}, console };
    vm.runInNewContext(outputText, context);
    return context.exports;
}

function element(tag) {
    return {
        tagName: tag,
        id: '',
        children: [],
        parent: null,
        textContent: '',
        innerHTML: '',
        dir: '',
        lang: '',
        attributes: {},
        style: {},
        setAttribute(name, value) { this.attributes[name] = value; },
        appendChild(child) {
            child.remove();
            child.parent = this;
            this.children.push(child);
            return child;
        },
        remove() {
            if (!this.parent) return;
            this.parent.children = this.parent.children.filter(child => child !== this);
            this.parent = null;
        },
        get offsetHeight() { return 1; }
    };
}

function findById(node, id) {
    if (node.id === id) return node;
    for (const child of node.children || []) {
        const found = findById(child, id);
        if (found) return found;
    }
    return null;
}

function mountDocument() {
    const head = element('head');
    const body = element('body');
    const root = element('div');
    root.id = 'root';
    root.innerHTML = '<nav>תפריט מערכת</nav><button>הפקת דוח / PDF</button>';
    body.appendChild(root);
    const listeners = [];
    const document = {
        title: 'client',
        head,
        body,
        getElementById: id => findById(head, id) || findById(body, id),
        createElement: element
    };
    const window = {
        printed: 0,
        opened: 0,
        open() { this.opened += 1; },
        print() { this.printed += 1; },
        addEventListener(type, fn) { listeners.push({ type, fn }); },
        removeEventListener() {},
        dispatch(type) { listeners.filter(listener => listener.type === type).forEach(listener => listener.fn()); }
    };
    return { document, window, listeners };
}

const sample = {
    from: '2026-09-20',
    to: '2026-10-19',
    unit: `גדוד א' <ב> "ג"`,
    units: ['גדוד'],
    total: 4,
    severe: 1,
    open: 2,
    treated: 2,
    categories: [{ label: 'נפילה', value: 3 }],
    weeks: [{ date: '2026-10-12', total: 3, severe: 1 }],
    events: [{
        id: 'E-12',
        date: '2026-10-12',
        unit: 'גדוד',
        category: 'נפילה',
        severity: 'חמור',
        status: 'פתוח',
        description: 'תיאור <script>'
    }]
};

test('report markup is a hebrew A4 print document and escapes text', () => {
    const { buildSafetyReportPrint } = loadModule();
    const generatedAt = new Date(2026, 9, 19, 9, 30);
    const report = buildSafetyReportPrint(sample, generatedAt);
    assert.match(report.title, /דוח בטיחות 2026-09-20 - 2026-10-19/);
    assert.match(report.css, /@page[\s\S]*size:\s*A4/);
    assert.match(report.css, /counter\(page\)/);
    assert.match(report.css, /counter\(pages\)/);
    assert.match(report.css, /body > \*:not\(#safety-report-print-root\)\s*\{\s*display:\s*none !important/);
    assert.match(report.css, /#safety-report-print-root\s*\{\s*display:\s*none/);
    assert.match(report.css, /print-color-adjust:\s*exact/);
    assert.match(report.css, /thead\s*\{\s*display:\s*table-header-group/);
    assert.match(report.html, /דוח בטיחות תקופתי/);
    assert.match(report.html, /תאריך הפקה/);
    assert.match(report.html, /יחידה/);
    assert.match(report.html, new RegExp(generatedAt.toLocaleDateString('he-IL').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(report.html, /גדוד א&#39; &lt;ב&gt; &quot;ג&quot;/);
    assert.match(report.html, /class="bar total"/);
    assert.match(report.html, /class="bar severe"/);
    assert.doesNotMatch(report.html, /<script>/);
    assert.match(report.html, /תיאור &lt;script&gt;/);
    assert.match(report.css, /direction:\s*rtl/);
});

test('printSafetyReport does not open a tab and removes the report after printing', () => {
    const source = fs.readFileSync('src/utils/printSafetyReport.ts', 'utf8');
    assert.doesNotMatch(source, /window\.open/);
    const { outputText } = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
    });
    const dom = mountDocument();
    const sandbox = {
        exports: {},
        console,
        document: dom.document,
        window: dom.window
    };
    vm.runInNewContext(outputText, sandbox);
    sandbox.exports.printSafetyReport(sample);
    assert.equal(dom.window.opened, 0);
    assert.equal(dom.window.printed, 1);
    assert.equal(dom.document.title, 'דוח בטיחות 2026-09-20 - 2026-10-19');
    const style = dom.document.getElementById('safety-report-print-style');
    const root = dom.document.getElementById('safety-report-print-root');
    assert.ok(style);
    assert.ok(root);
    assert.equal(root.dir, 'rtl');
    assert.match(root.innerHTML, /דוח בטיחות תקופתי/);
    assert.match(root.innerHTML, /מגמה שבועית/);
    assert.equal(dom.document.body.children.some(child => child.id === 'root'), true);
    dom.window.dispatch('afterprint');
    assert.equal(dom.document.getElementById('safety-report-print-style'), null);
    assert.equal(dom.document.getElementById('safety-report-print-root'), null);
    assert.equal(dom.document.title, 'client');
    assert.equal(dom.document.body.children.some(child => child.id === 'root'), true);
});
