import assert from "node:assert/strict";
import test from "node:test";
import type { EventReportWithId } from "../src/types/eventReport.ts";
import type { EventRow } from "../src/types/eventsTable.ts";
import { filterEventRows, toEventRow } from "../src/utils/filterEvents.ts";

function report(overrides: {
  id?: string;
  unit?: string;
  fullName?: string;
  category?: string;
  eventStatus?: string;
  eventDate?: string;
  eventTime?: string;
  weatherCondition?: string;
  eventDescription?: string;
  location?: string;
  address?: string;
  eventSeverity?: string;
}): EventReportWithId {
  return {
    id: overrides.id ?? "abcd1234-0000-4000-8000-000000000001",
    images: [],
    reporterInfo: {
      fullName: overrides.fullName ?? "ישראל כהן",
      phone: "0500000000",
      position: "חייל",
      unit: overrides.unit ?? "יחידת אלון",
      subUnit: "פלוגת הדגמה",
      reportDate: "2024-05-01",
      reportTime: "10:00",
    },
    eventInfo: {
      eventDate: overrides.eventDate ?? "2024-05-01",
      eventTime: overrides.eventTime ?? "10:00",
      eventDescription: overrides.eventDescription ?? "מפגע בנתיב הליכה",
      unitActivityType: "אימונים",
      personalActivityType: "שגרה",
      category: (overrides.category ?? "נפילות / חבלות") as EventReportWithId["eventInfo"]["category"],
      location: (overrides.location ?? "בסיס") as EventReportWithId["eventInfo"]["location"],
      eventSeverity: (overrides.eventSeverity ?? "חמור") as EventReportWithId["eventInfo"]["eventSeverity"],
      eventResult: "א.נ.א.נ (אין נפגעים, אין נזק)",
      weatherCondition: (overrides.weatherCondition ?? "גשם") as EventReportWithId["eventInfo"]["weatherCondition"],
      address: overrides.address ?? "רחוב הרצל 1",
    },
    summaryInfo: {
      eventStatus: (overrides.eventStatus ?? "בטיפול") as EventReportWithId["summaryInfo"]["eventStatus"],
      recommendations: "תדריך",
      approval: true,
    },
  };
}

function row(overrides: Partial<EventRow> = {}): EventRow {
  return {
    ...toEventRow(report({})),
    ...overrides,
  };
}

const filters = { q: "", dateFrom: null, dateTo: null };

test("maps the event number and unit shown in the table", () => {
  const mapped = toEventRow(report({ id: "a1b2c3d4-0000-4000-8000-000000000099", unit: "יחידת ברוש" }));
  assert.equal(mapped.eventNumber, "EV-A1B2");
  assert.equal(mapped.unit, "יחידת ברוש");
});

test("matches a unit name and ignores case and whitespace", () => {
  const rows = [
    row({ id: 1 as unknown as number, unit: "יחידת  אלון" }),
    row({ id: 2 as unknown as number, unit: "יחידת ברוש" }),
  ];

  const byUnit = filterEventRows(rows, { ...filters, q: "  יחידת   אלון " });
  assert.deepEqual(byUnit.map((item) => item.unit), ["יחידת  אלון"]);

  const byNumber = filterEventRows(
    [row({ eventNumber: "EV-A1B2" }), row({ eventNumber: "EV-ZZZZ" })],
    { ...filters, q: "ev-a1b2" },
  );
  assert.deepEqual(byNumber.map((item) => item.eventNumber), ["EV-A1B2"]);
});

test("matches every other value rendered in the events table", () => {
  const sample = row({
    eventStatus: "בטיפול",
    category: "דרכים",
    eventDate: "2024-05-01",
    eventTime: "14:30",
    weatherCondition: "גשם",
    fullName: "דוד לוי",
  });
  const other = row({
    eventStatus: "טופל",
    category: "עבודה",
    eventDate: "2023-01-01",
    eventTime: "08:00",
    weatherCondition: "נאה",
    fullName: "משה ישראלי",
    unit: "יחידת ארז",
    eventNumber: "EV-FFFF",
  });

  for (const q of ["בטיפול", "דרכים", "2024-05-01", "14:30", "גשם", "דוד לוי"]) {
    const matches = filterEventRows([sample, other], { ...filters, q });
    assert.equal(matches.length, 1, q);
    assert.equal(matches[0], sample);
  }
});

test("does not match across two different cells", () => {
  const sample = row({ unit: "אלון", eventStatus: "טופל" });
  assert.equal(filterEventRows([sample], { ...filters, q: "ןט" }).length, 0);
});

test("keeps date-range filtering", () => {
  const early = row({ eventDate: "2024-01-01", unit: "יחידת אלון" });
  const late = row({ eventDate: "2024-08-01", unit: "יחידת אלון" });
  const matches = filterEventRows([early, late], {
    q: "אלון",
    dateFrom: "2024-06-01",
    dateTo: "2024-12-31",
  });
  assert.deepEqual(matches, [late]);
});

test("filters on the event date and includes the whole end day", () => {
  const reportedToday = row({ eventDate: "2024-10-19T18:30:00", unit: "יחידת אלון" });
  const happenedEarlier = row({ eventDate: "2024-10-18T23:30:00", unit: "יחידת אלון" });
  const matches = filterEventRows([reportedToday, happenedEarlier], {
    q: "",
    dateFrom: "2024-10-19",
    dateTo: "2024-10-19",
  });
  assert.deepEqual(matches, [reportedToday]);
});
