import { createContext, useState, type ReactNode } from "react";
import type { EventReport } from "../types/eventReport";
import { getUser } from "../utils/storage";
import type { WeatherResult } from "../api/weather.api";

export interface EventFormContextType {
  eventData: EventReport;
  setEventData: React.Dispatch<React.SetStateAction<EventReport>>;
  weatherDetails: WeatherResult | null;
  setWeatherDetails: React.Dispatch<React.SetStateAction<WeatherResult | null>>;
}

export const EventFormContext = createContext<EventFormContextType | undefined>(
  undefined
);
export const initialEventData: EventReport = {
  reporterInfo: {
    fullName: getUser()?.fullName || "",
    phone: "",
    position: "",
    unit: "",
    subUnit: "",
    reportDate: new Date().toISOString().split("T")[0],
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
  const [weatherDetails, setWeatherDetails] = useState<WeatherResult | null>(null);
  return (
    <EventFormContext.Provider value={{ eventData, setEventData, weatherDetails, setWeatherDetails }}>
      {children}
    </EventFormContext.Provider>
  );
};
