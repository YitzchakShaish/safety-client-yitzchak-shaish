import { createContext, useState, type ReactNode } from "react";
import type { EventReport } from "../types/eventReport";
import { getUser } from "../utils/storage";

export interface EventFormContextType {
  eventData: EventReport;
  setEventData: React.Dispatch<React.SetStateAction<EventReport>>;
}

export const EventFormContext = createContext<EventFormContextType | undefined>(
  undefined
);
export const initialEventData: EventReport = {
  reporterInfo: {
    fullName: getUser().fullName || "",
    phone: "",
    position: "",
    unit: "",
    subUnit: "",
    reportDate: new Date(),
    reportTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  eventInfo: {
    eventDate: new Date().toISOString().split("T")[0],
    eventTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    eventDescription: "",
    unitActivityType: "בחר/י",
    personalActivityType: "בחר/י",
    category: "בחר/י",
    location: "בחר/י",
    eventSeverity: "בחר/י",
    eventResult: "בחר/י",
    weatherCondition: "בחר/י",
  },
  summaryInfo: {
    eventStatus: "לא טופל",
    injuryLevel: "בחר/י",
    injuryDetails: "",
    recommendations: "",
    approval: false,
  },
 
}
export const EventFormProvider = ({ children }: { children: ReactNode }) => {
  const [eventData, setEventData] = useState<EventReport>(initialEventData);
  return (
    <EventFormContext.Provider value={{ eventData, setEventData }}>
      {children}
    </EventFormContext.Provider>
  );
};
