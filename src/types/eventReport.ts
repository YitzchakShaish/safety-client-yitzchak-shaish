export const unitActivityTypeArr = [
  "בחר/י",
  "תע\"מ",
  "אימונים",
  "הכשרה",
  "רגיעה / מנהלה",
  "מלחמה / מבצע צבאי נרחב",
] as const;
export type UnitActivityType = (typeof unitActivityTypeArr)[number];

export const personalActivityTypeArr = [
  "בחר/י",
  "פעילות מבצעית / לחימה",
  "אימון",
  "הכשרה",
  "שגרה",
  "פנאי",
  "חופשה",
] as const;
export type PersonalActivityType = (typeof personalActivityTypeArr)[number];

export const categoryArr = [
  "בחר/י",
  "נשק ומקלעים",
  "דרכים",
  "תחמושת",
  "ירי דו\"צ",
  "מזג אוויר",
  "רק\"מ / צמ\"ה קרביים",
  "שת\"פ אוויר",
  "עבודה",
  "אוויר",
  "בטיחות ימי",
  "ספורט ואקסטרים",
  "נפילות / חבלות",
  "חריגות ירי / תנועה בשטחי אימונים",
  "חומ\"ס",
  "אמל\"ח (לא נשק / מקלעים)",
  "אש",
  "טג\"ח קרבי",
  "שת\"פ ים",
  "ייעודי עורף / חילוץ והצלה",
  "אמצעי רום קרוב לקרקע",
  "כושר גופני / קרבי",
] as const;
export type Category = (typeof categoryArr)[number];

export const locationArr = [
  "בחר/י",
  "בסיס",
  "שטח אזרחי",
  "שטח אש",
  "רציף",
] as const;
export type Location = (typeof locationArr)[number];

export const eventSeverityArr = ["בחר/י", "קל", "בינוני", "חמור"] as const;
export type EventSeverity = (typeof eventSeverityArr)[number];

export const eventResultArr = [
  "בחר/י",
  "א.נ.א.נ (אין נפגעים, אין נזק)",
  "א.נ.י.נ (אין נפגעים, יש נזק)",
  "י.נ.א.נ (יש נפגעים, אין נזק)",
  "י.נ.י.נ (יש נפגעים, יש נזק)",
] as const;
export type EventResult = (typeof eventResultArr)[number];

export const injuryLevelArr = [
  "בחר/י",
  "ללא פגיעה",
  "פגוע קל (ללא אשפוז)",
  "פגוע קל (שאושפז)",
  "פגוע בינוני",
  "פגוע קשה / אנוש",
  "חלל",
] as const;
export type InjuryLevel = (typeof injuryLevelArr)[number];

export const weatherConditionsArr = [
  "בחר/י",
  "שרב / עומס חום",
  "שלג",
  "סופת חול",
  "גשם",
  "ערפל",
  "התקרחות",
  "ברד",
  "מעונן",
  "נאה",
  "רוח",
  "ים סוער",
  "מים שקטים",
] as const;
export type WeatherCondition = (typeof weatherConditionsArr)[number];

export const eventStatusArr = ["לא טופל", "בטיפול", "טופל"] as const;
export type EventStatus = (typeof eventStatusArr)[number];
export interface ReportInfo {
  fullName: string;
  phone: string;
  position: string;
  unit: string;
  subUnit: string;
  reportDate: Date;
  reportTime: string;
  eventStatus: EventStatus;
}

export interface EventInfo {
  eventDate: string;
  eventTime: string;
  eventDescription: string;
  unitActivityType: UnitActivityType;
  personalActivityType: PersonalActivityType;
  category: Category;
  location: Location;
  eventSeverity: EventSeverity;
  eventResult: EventResult;
  weatherCondition: WeatherCondition;
}

export interface SummaryInfo {
  injuryLevel: InjuryLevel;
  injuryDetails: string;
  recommendations: string;
  approval: boolean;
}

export interface EventReport {
  reportInfo: ReportInfo;
  eventInfo: EventInfo;
  summaryInfo: SummaryInfo;
}

export interface EventReportWithId extends EventReport {
  id: number;
}

