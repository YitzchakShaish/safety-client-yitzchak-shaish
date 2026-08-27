import type { EventReportWithId } from "./eventReport";

export interface Column {
  id:
    | "eventNumber"
    | "eventStatus"
    | "category"
    | "eventDate"
    | "eventTime"
    | "weatherCondition"
    | "fullName"
    | "unit"
    | "actions";
  label: string;
  minWidth?: number;
}

export const columns: readonly Column[] = [
  { id: "eventNumber", label: "מספר אירוע", minWidth: 100 },
  { id: "eventStatus", label: "סטטוס אירוע", minWidth: 100 },
  { id: "category", label: "קטגוריית אירוע", minWidth: 150 },
  { id: "eventDate", label: "תאריך אירוע", minWidth: 100 },
  { id: "eventTime", label: "שעת אירוע", minWidth: 100 },
  { id: "weatherCondition", label: "מזג אוויר", minWidth: 120 },
  { id: "fullName", label: "מדווח", minWidth: 130 },
  { id: "unit", label: "יחידה", minWidth: 130 },
  { id: "actions", label: "פעולות" },
];

export interface EventRowFields {
  id: number;
  eventNumber: string;
  eventStatus: string;
  category: string;
  eventDate: string;
  eventTime: string;
  weatherCondition: string;
  fullName: string;
  unit: string;
}

export interface EventRow extends EventRowFields {
  fullData: EventReportWithId;
}

export interface EventFilters {
  q: string;          
  dateFrom: string | null; 
  dateTo: string | null;
}