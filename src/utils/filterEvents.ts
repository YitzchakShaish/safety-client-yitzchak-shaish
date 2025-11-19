import type { EventFilters, EventRow } from "../types/eventsTable";

export function filterEventRows(rows: EventRow[], filters: EventFilters): EventRow[] {
  const q = filters.q.trim().toLowerCase();
  const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
  const dateTo = filters.dateTo ? new Date(filters.dateTo) : null;
console.log("q:", q, "dateFrom:", dateFrom, "dateTo:", dateTo);
  return rows.filter((row) => {
    if (q) {
      const searchable = `${row.eventNumber} ${row.eventStatus} ${row.category} ${row.fullName} ${row.unit} ${row.eventTime}`.toLowerCase();
      console.log("searchable:", searchable);
      if (!searchable.includes(q)) return false;
    }

    if (dateFrom || dateTo) {
      const rowDate = new Date(row.eventDate);

      if (dateFrom && rowDate < dateFrom) return false;

      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        if (rowDate > end) return false;
      }
    }

    return true;
  });
}
