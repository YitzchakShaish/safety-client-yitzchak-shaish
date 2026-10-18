import type { EventReport } from "../types";
import type { PermissionLevel } from "./getPermissionLevel";

type SectionKey = keyof EventReport;

export const EDITABLE_FIELDS_BY_PERMISSION: Record<
  PermissionLevel,
  Partial<Record<SectionKey, string[]>>
> = {
  basic: {

  },

  advanced: {
    eventInfo: ["eventDescription", "unitActivityType", "personalActivityType", "category", "location", "eventSeverity", "eventResult", "weatherCondition",],
    summaryInfo: ["eventStatus", "recommendations"],
  },


  admin: {
    reporterInfo: ["phone", "position", "unit", "subUnit"],
    eventInfo: ["eventDescription", "unitActivityType", "personalActivityType", "category", "location", "eventSeverity", "eventResult", "weatherCondition",],
    summaryInfo: ["injuryLevel", "injuryDetails", "recommendations", "approval", "eventStatus"],
  }

};
