import type { SafetyOverview } from "../api/safetyOverview.api";

const escapeHtml = (value: string | number) => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]!));

export function printSafetyReport(data: SafetyOverview) {
    const report = window.open("", "_blank", "width=1000,height=800");
    if (!report) throw new Error("יש לאפשר חלון חדש בדפדפן כדי להפיק דוח");
    report.opener = null;
    const max = Math.max(1, ...data.weeks.map(week => week.total));
    report.document.write(`<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>דוח בטיחות ${escapeHtml(data.from)} - ${escapeHtml(data.to)}</title>
        <style>
        @page { size: A4; margin: 16mm; }
        body { font-family: Arial, sans-serif; color: #172b4d; line-height: 1.5; margin: 24px; }
        h1 { border-bottom: 3px solid #1976d2; padding-bottom: 12px; }
        h2 { break-after: avoid; } table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border-bottom: 1px solid #b7c3d0; padding: 8px; text-align: right; vertical-align: top; overflow-wrap: anywhere; }
        thead { display: table-header-group; } tr { break-inside: avoid; }
        .metrics { display: flex; gap: 20px; margin: 24px 0; } .metrics div { flex: 1; border: 1px solid #b7c3d0; padding: 12px; }
        strong { display: block; font-size: 26px; } .bar { height: 12px; background: #1976d2; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        .week { display: grid; grid-template-columns: 110px 1fr 140px; align-items: center; gap: 12px; margin: 10px 0; break-inside: avoid; }
        .actions { margin-bottom: 20px; } button { padding: 10px 20px; cursor: pointer; }
        @media print { .actions { display: none; } body { margin: 0; } }
        </style></head><body>
        <div class="actions"><button id="print">הדפסה / שמירה כ־PDF</button></div>
        <h1>Safety — דוח בטיחות תקופתי</h1>
        <p>תאריך הפקה: ${escapeHtml(new Date().toLocaleString('he-IL'))}<br>תקופה: ${escapeHtml(data.from)} עד ${escapeHtml(data.to)}<br>יחידה: ${escapeHtml(data.unit || 'כל היחידות המורשות')}</p>
        <div class="metrics">${[['אירועים', data.total], ['חמורים', data.severe], ['פתוחים', data.open], ['טופלו', data.treated]].map(([label, value]) => `<div>${escapeHtml(label)}<strong>${escapeHtml(value)}</strong></div>`).join('')}</div>
        <h2>מגמה שבועית</h2>${data.weeks.map(week => `<div class="week"><span>${escapeHtml(week.date)}</span><div class="bar" style="width:${week.total / max * 100}%"></div><span>${week.total} אירועים, ${week.severe} חמורים</span></div>`).join('')}
        <h2>התפלגות לפי סוג אירוע</h2><table><thead><tr><th>סוג</th><th>מספר אירועים</th></tr></thead><tbody>${data.categories.map(item => `<tr><td>${escapeHtml(item.label)}</td><td>${item.value}</td></tr>`).join('') || '<tr><td colspan="2">אין אירועים בתקופה זו</td></tr>'}</tbody></table>
        <h2>אירועים פתוחים או חמורים</h2><table><thead><tr><th>מספר / תאריך</th><th>יחידה וסוג</th><th>תיאור</th><th>חומרה / סטטוס</th></tr></thead><tbody>${data.events.map(event => `<tr><td>${escapeHtml(event.id)}<br>${escapeHtml(event.date)}</td><td>${escapeHtml(event.unit)}<br>${escapeHtml(event.category)}</td><td>${escapeHtml(event.description)}</td><td>${escapeHtml(event.severity)}<br>${escapeHtml(event.status)}</td></tr>`).join('') || '<tr><td colspan="4">אין אירועים להצגה</td></tr>'}</tbody></table>
        </body></html>`);
    report.document.close();
    report.document.getElementById("print")?.addEventListener("click", () => report.print());
    report.focus();
}
