import { useContext } from "react";
import { EventFormContext, type EventFormContextType } from "../context/eventFormContextBase";

export const useEventForm = (): EventFormContextType => {
  const context = useContext(EventFormContext);
  if (!context) {
    throw new Error("useEventForm must be used within EventFormProvider");
  }
  return context;
};
