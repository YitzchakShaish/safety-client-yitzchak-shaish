import type { SafetyOverview } from "../api/safetyOverview.api";

const STYLE_ID = "safety-report-print-style";
const ROOT_ID = "safety-report-print-root";

const escapeHtml = (value: string | number) => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]!));

const cssString = (value: string) => `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, " ")}"`;

const formatDate = (value: string) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
    if (!match) return value;
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("he-IL");
};

const percent = (part: number, max: number) => {
    if (!Number.isFinite(part) || !Number.isFinite(max) || max <= 0) return 0;
    return Math.max(0, Math.min(100, (part / max) * 100));
};

const unitLabel = (unit: string) => unit.trim() || "כל היחידות המורשות";

export function buildSafetyReportPrint(data: SafetyOverview, generatedAt = new Date()) {
    const period = `${formatDate(data.from)} – ${formatDate(data.to)}`;
    const unit = unitLabel(data.unit);
    const generated = generatedAt.toLocaleString("he-IL", { dateStyle: "short", timeStyle: "short" });
    const maxWeek = Math.max(1, ...data.weeks.map(week => week.total));
    const categoryMax = Math.max(data.total, 1);

    const weekRows = data.weeks.map(week => `<div class="week">
        <span>${escapeHtml(formatDate(week.date))}</span>
        <div class="tracks" aria-hidden="true">
            <div class="track"><div class="bar total" style="width:${percent(week.total, maxWeek).toFixed(1)}%"></div></div>
            <div class="track thin"><div class="bar severe" style="width:${percent(week.severe, maxWeek).toFixed(1)}%"></div></div>
        </div>
        <span>${escapeHtml(week.total)} אירועים, ${escapeHtml(week.severe)} חמורים</span>
    </div>`).join("");

    const categoryChart = data.categories.map(item => `<div class="cat">
        <span>${escapeHtml(item.label)}</span>
        <div class="track" aria-hidden="true"><div class="bar total" style="width:${percent(item.value, categoryMax).toFixed(1)}%"></div></div>
        <span>${escapeHtml(item.value)}</span>
    </div>`).join("");

    const categoryRows = data.categories.map(item => `<tr><td>${escapeHtml(item.label)}</td><td>${escapeHtml(item.value)}</td></tr>`).join("")
        || `<tr><td colspan="2">אין אירועים בתקופה זו</td></tr>`;

    const eventRows = data.events.map(event => `<tr>
        <td>${escapeHtml(event.id)}<br>${escapeHtml(formatDate(event.date))}</td>
        <td>${escapeHtml(event.unit)}<br>${escapeHtml(event.category)}</td>
        <td class="description">${escapeHtml(event.description)}</td>
        <td>${escapeHtml(event.severity)}<br>${escapeHtml(event.status)}</td>
    </tr>`).join("") || `<tr><td colspan="4">אין אירועים להצגה</td></tr>`;

    const metrics = [
        ["אירועים שדווחו", data.total],
        ["אירועים חמורים", data.severe],
        ["אירועים פתוחים", data.open],
        ["אירועים שטופלו", data.treated],
    ].map(([label, value]) => `<div class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");

    const css = `
#${ROOT_ID} { display: none; }
@media print {
  @page {
    size: A4;
    margin: 16mm 12mm 16mm;
    @top-right {
      content: "דוח בטיחות תקופתי";
      font-family: Heebo, Arial, sans-serif;
      font-size: 9pt;
      color: #5e6c84;
      direction: rtl;
    }
    @top-left {
      content: ${cssString(`${period} | ${unit}`)};
      font-family: Heebo, Arial, sans-serif;
      font-size: 9pt;
      color: #5e6c84;
      direction: rtl;
    }
    @bottom-center {
      content: "עמוד " counter(page) " מתוך " counter(pages);
      font-family: Heebo, Arial, sans-serif;
      font-size: 9pt;
      color: #5e6c84;
      direction: rtl;
    }
  }
  @page :first {
    margin-top: 12mm;
    @top-right { content: none; }
    @top-left { content: none; }
  }
  html, body {
    background: #fff !important;
    height: auto !important;
  }
  body > *:not(#${ROOT_ID}) { display: none !important; }
  #${ROOT_ID}, #${ROOT_ID} * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  #${ROOT_ID} {
    display: block !important;
    position: static !important;
    width: auto !important;
    height: auto !important;
    overflow: visible !important;
    background: #fff !important;
    color: #172b4d !important;
    font-family: Heebo, Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.45;
    direction: rtl;
  }
  #${ROOT_ID} h1, #${ROOT_ID} h2, #${ROOT_ID} p { margin: 0; }
  #${ROOT_ID} .report-header {
    border-bottom: 3px solid #1976d2;
    padding-bottom: 10px;
    margin-bottom: 12px;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  #${ROOT_ID} .kicker {
    color: #1976d2;
    font-weight: 700;
    font-size: 11pt;
    margin-bottom: 2px;
  }
  #${ROOT_ID} h1 { font-size: 22pt; line-height: 1.2; margin-bottom: 10px; }
  #${ROOT_ID} .meta { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 8px 16px; }
  #${ROOT_ID} .meta div { break-inside: avoid; }
  #${ROOT_ID} .meta dt { color: #5e6c84; font-size: 9pt; font-weight: 500; }
  #${ROOT_ID} .meta dd { margin: 0; font-weight: 700; }
  #${ROOT_ID} .metrics {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin: 0 0 8px;
  }
  #${ROOT_ID} .metric {
    border: 1px solid #c5d4e4;
    border-top: 3px solid #1976d2;
    padding: 8px 10px;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  #${ROOT_ID} .metric span { display: block; color: #5e6c84; font-size: 9pt; }
  #${ROOT_ID} .metric strong { display: block; font-size: 20pt; line-height: 1.15; font-variant-numeric: tabular-nums; }
  #${ROOT_ID} h2 {
    font-size: 13pt;
    color: #0d47a1;
    margin: 16px 0 8px;
    break-after: avoid;
    page-break-after: avoid;
  }
  #${ROOT_ID} .legend { display: flex; gap: 16px; color: #5e6c84; font-size: 9pt; margin-bottom: 6px; }
  #${ROOT_ID} .swatch { display: inline-block; width: 12px; height: 8px; margin-left: 6px; vertical-align: middle; }
  #${ROOT_ID} .swatch.total, #${ROOT_ID} .bar.total { background: #1976d2; }
  #${ROOT_ID} .swatch.severe, #${ROOT_ID} .bar.severe { background: #c62828; }
  #${ROOT_ID} .week, #${ROOT_ID} .cat {
    display: grid;
    grid-template-columns: 88px 1fr auto;
    align-items: center;
    gap: 8px;
    margin: 5px 0;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  #${ROOT_ID} .tracks { display: grid; gap: 3px; }
  #${ROOT_ID} .track { height: 10px; background: #e7eef5; }
  #${ROOT_ID} .track.thin { height: 5px; }
  #${ROOT_ID} .bar { height: 100%; }
  #${ROOT_ID} table { width: 100%; border-collapse: collapse; margin-top: 8px; break-inside: auto; page-break-inside: auto; }
  #${ROOT_ID} thead { display: table-header-group; }
  #${ROOT_ID} tr { break-inside: avoid; page-break-inside: avoid; }
  #${ROOT_ID} th, #${ROOT_ID} td {
    border: 1px solid #c5d4e4;
    padding: 6px 8px;
    text-align: right;
    vertical-align: top;
    overflow-wrap: anywhere;
  }
  #${ROOT_ID} th { background: #e8f1fb; font-weight: 700; }
  #${ROOT_ID} .description { white-space: pre-wrap; }
  #${ROOT_ID} .events th:nth-child(1) { width: 18%; }
  #${ROOT_ID} .events th:nth-child(2) { width: 22%; }
  #${ROOT_ID} .events th:nth-child(3) { width: 40%; }
  #${ROOT_ID} .events th:nth-child(4) { width: 20%; }
}`;

    const html = `<header class="report-header">
        <div class="kicker">Safety</div>
        <h1>דוח בטיחות תקופתי</h1>
        <dl class="meta">
            <div><dt>תקופה</dt><dd>${escapeHtml(period)}</dd></div>
            <div><dt>יחידה</dt><dd>${escapeHtml(unit)}</dd></div>
            <div><dt>תאריך הפקה</dt><dd>${escapeHtml(generated)}</dd></div>
        </dl>
    </header>
    <div class="metrics">${metrics}</div>
    <h2>מגמה שבועית</h2>
    <div class="legend"><span><i class="swatch total"></i>אירועים</span><span><i class="swatch severe"></i>חמורים</span></div>
    ${weekRows || `<p>אין נתונים בתקופה זו</p>`}
    <h2>התפלגות לפי סוג אירוע</h2>
    ${categoryChart}
    <table>
        <thead><tr><th>סוג</th><th>מספר אירועים</th></tr></thead>
        <tbody>${categoryRows}</tbody>
    </table>
    <h2>אירועים פתוחים או חמורים</h2>
    <table class="events">
        <thead><tr><th>מספר / תאריך</th><th>יחידה וסוג</th><th>תיאור</th><th>חומרה / סטטוס</th></tr></thead>
        <tbody>${eventRows}</tbody>
    </table>`;

    return { css, html, title: `דוח בטיחות ${data.from} - ${data.to}` };
}

export function printSafetyReport(data: SafetyOverview) {
    document.getElementById(STYLE_ID)?.remove();
    document.getElementById(ROOT_ID)?.remove();

    const report = buildSafetyReportPrint(data);
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = report.css;
    document.head.appendChild(style);

    const root = document.createElement("div");
    root.id = ROOT_ID;
    root.dir = "rtl";
    root.lang = "he";
    root.setAttribute("aria-hidden", "true");
    root.innerHTML = report.html;
    document.body.appendChild(root);

    const previousTitle = document.title;
    document.title = report.title;
    let removed = false;
    const cleanup = () => {
        if (removed) return;
        removed = true;
        document.title = previousTitle;
        style.remove();
        root.remove();
    };
    window.addEventListener("afterprint", cleanup, { once: true });

    if (typeof window.print !== "function") {
        cleanup();
        throw new Error("הדפדפן לא תומך בהדפסה");
    }
    void root.offsetHeight;
    try {
        window.print();
    } catch (error) {
        cleanup();
        throw error;
    }
}
