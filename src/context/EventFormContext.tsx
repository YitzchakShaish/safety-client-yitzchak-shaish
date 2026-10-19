import { useState, type ReactNode } from "react";
import type { WeatherResult } from "../api/weather.api";
import type { EventReport } from "../types/eventReport";
import { EventFormContext, createInitialEventData } from "./eventFormContextBase";

export const EventFormProvider = ({ children }: { children: ReactNode }) => {
  const [eventData, setEventData] = useState<EventReport>(createInitialEventData);
  const [weatherDetails, setWeatherDetails] = useState<WeatherResult | null>(null);
  return (
    <EventFormContext.Provider value={{ eventData, setEventData, weatherDetails, setWeatherDetails }}>
      {children}
    </EventFormContext.Provider>
  );
};
