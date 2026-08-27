import type { EventRowFields } from "./eventsTable";

export const tableFieldLabels: Record<keyof EventRowFields, string> = {
  id: "ID",
  eventNumber: "מספר אירוע",
  eventStatus: "סטטוס אירוע",
  category: "קטגוריית אירוע",
  eventDate: "תאריך אירוע",
  eventTime: "שעת אירוע",
  weatherCondition: "מזג אוויר",
  fullName: "מדווח",
  unit: "יחידה",
};