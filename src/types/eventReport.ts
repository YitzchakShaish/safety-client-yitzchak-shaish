import type {
  EventStatus,
  UnitActivityType,
  PersonalActivityType,
  Category,
  Location,
  EventSeverity,
  EventResult,
  WeatherCondition,
  InjuryLevel,
} from "./eventOptions";

export interface ReportInfo {
  fullName: string;
  phone: string;
  position: string;
  unit: string;
  subUnit: string;
  reportDate: Date;
  reportTime: string;
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
  injuryLevel?: InjuryLevel;
  injuryDetails?: string;
  recommendations: string;
  approval: boolean;
  eventStatus: EventStatus;
}

export interface EventReport {
  reporterInfo: ReportInfo;
  eventInfo: EventInfo;
  summaryInfo: SummaryInfo;
}

export interface EventReportWithId extends EventReport {
  id: number;
}
