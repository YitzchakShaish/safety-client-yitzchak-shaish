import type { EventReportWithId } from "../types/eventReport";
import { columns, type Column, type EventFilters, type EventRow } from "../types/eventsTable";

type SearchableColumnId = Exclude<Column["id"], "actions">;

const searchableColumnIds: SearchableColumnId[] = columns
  .map((column) => column.id)
  .filter((id): id is SearchableColumnId => id !== "actions");

/** Text rendered in one events-table cell. Search matches this, not a separate raw value. */
export function displayedEventCell(row: EventRow, columnId: SearchableColumnId): string {
  const value = row[columnId];
  return value == null ? "" : String(value);
}

export function toEventRow(report: EventReportWithId): EventRow {
  return {
    id: report.id as unknown as number,
    eventNumber: `EV-${report.id.toString().toUpperCase().slice(0, 4)}`,
    eventStatus: report.summaryInfo.eventStatus,
    category: report.eventInfo.category,
    eventDate: report.eventInfo.eventDate,
    eventTime: report.eventInfo.eventTime,
    weatherCondition: report.eventInfo.weatherCondition,
    fullName: report.reporterInfo.fullName,
    unit: report.reporterInfo.unit,
    fullData: report,
  };
}

/** Ignore case and any whitespace so "יחידת  אלון" and "  ev-ab12 " still match. */
export function normalizeSearchText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "");
}

function rowSearchText(row: EventRow): string {
  return searchableColumnIds
    .map((columnId) => normalizeSearchText(displayedEventCell(row, columnId)))
    .join("\u0000");
}

/** Calendar day from an event date. Date-only and datetime values share the same day prefix. */
function eventCalendarDay(value: string): string | null {
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(value.trim());
  return match ? match[1] : null;
}

export function filterEventRows(rows: EventRow[], filters: EventFilters): EventRow[] {
  const q = normalizeSearchText(filters.q);
  const dateFrom = filters.dateFrom?.slice(0, 10) || null;
  const dateTo = filters.dateTo?.slice(0, 10) || null;

  return rows.filter((row) => {
    if (q && !rowSearchText(row).includes(q)) return false;

    if (dateFrom || dateTo) {
      // Compare the event date, and keep the whole 'to' day (from = to = today still matches).
      const day = eventCalendarDay(String(row.eventDate ?? ""));
      if (!day) return false;
      if (dateFrom && day < dateFrom) return false;
      if (dateTo && day > dateTo) return false;
    }

    return true;
  });
}
