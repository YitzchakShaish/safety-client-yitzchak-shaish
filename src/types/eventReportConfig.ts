import {
  unitActivityTypeArr,
  personalActivityTypeArr,
  categoryArr,
  locationArr,
  eventSeverityArr,
  eventResultArr,
  injuryLevelArr,
  weatherConditionsArr,
  eventStatusArr,
} from "./eventOptions";

export const optionsMap: Record<string, readonly string[]> = {
  unitActivityType: unitActivityTypeArr,
  personalActivityType: personalActivityTypeArr,
  category: categoryArr,
  location: locationArr,
  eventSeverity: eventSeverityArr,
  eventResult: eventResultArr,
  injuryLevel: injuryLevelArr,
  weatherCondition: weatherConditionsArr,
};
export const optionsStatus: Record<string, readonly string[]> = {
   eventStatus: eventStatusArr,
}

export const fieldLabels: Record<string, string> = {
  fullName: "שם המדווח",
  phone: "טלפון",
  position: "תפקיד",
  unit: "יחידה",
  subUnit: "תת יחידה",
  reportDate: "תאריך דיווח",
  reportTime: "שעת דיווח",
  eventStatus: "סטטוס האירוע",
  eventDate: "תאריך האירוע",
  eventTime: "שעת האירוע",
  eventDescription: "תיאור האירוע",
  unitActivityType: "סוג פעילות יחידה",
  personalActivityType: "סוג פעילות אישית",
  category: "קטגוריה",
  location: "מיקום",
  eventSeverity: "חומרת האירוע",
  eventResult: "תוצאת האירוע",
  weatherCondition: "תנאי מזג אוויר",
  address: "כתובת מדויקת",
  injuryLevel: "רמת פגיעה",
  injuryDetails: "פרטי פגיעה",
  recommendations: "המלצות",
  approval: "אישור",
};
