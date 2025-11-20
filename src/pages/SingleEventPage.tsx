import { useState } from "react";
import { useLocation } from "react-router";
import { Box, Button } from "@mui/material";
import type { EventReportWithId } from "../types";
import EventHeader from "../components/singeleEvent/EventHeader";
import ReportSection from "../components/singeleEvent/ReportSection";


export default function SingleEventPage() {
  const location = useLocation();
  const { event } = location.state as { event: EventReportWithId };
  let userLevel = "high";
  // userLevel = "low"; // for testing

  if (!event) return <Box>לא נמצא מידע לאירוע</Box>;

  // Determines which fields the current user can edit based on their permission level
  const editableFields = userLevel === "high"
    ? [...Object.keys(event.eventInfo), ...Object.keys(event.summaryInfo), "eventStatus", "recommendations"]
    : ["eventStatus"];

  const [eventData, setEventData] = useState(event);

  // Tracks if the user has made any changes (true = unsaved changes)
  const [hasChanges, setHasChanges] = useState(false);

  // Updates a specific field in a given section immutably and marks that there are unsaved changes
  const handleChange = (
    section: "reportInfo" | "eventInfo" | "summaryInfo",
    field: string,
    value: any
  ) => {
    setEventData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
    setHasChanges(true)
  };

  const handleSave = () => {
    // TODO: send updated eventData to backend API
    console.log("saved:", eventData);
    setHasChanges(false)
  };

  return (
    <Box padding={2}>
      <EventHeader eventId={eventData.id} status={eventData.reportInfo.eventStatus} />

      <ReportSection
        title="מידע על המדווח"
        data={eventData.reportInfo}
        section="reportInfo"
        editableFields={editableFields}
        onChange={(field, value) => handleChange("reportInfo", field, value)}
      />

      <ReportSection
        title="פרטי האירוע"
        data={eventData.eventInfo}
        section="eventInfo"
        editableFields={editableFields}
        onChange={(field, value) => handleChange("eventInfo", field, value)}
      />

      <ReportSection
        title="סיכום ונפגעים"
        data={eventData.summaryInfo}
        section="summaryInfo"
        editableFields={editableFields}
        onChange={(field, value) => handleChange("summaryInfo", field, value)}
      />

      <Button
        variant="contained"
        size="large"
        color="primary"
        sx={{ mt: 3, px: 6, display: "block", mx: "auto", opacity: hasChanges ? 1 : 0.5 }}
        onClick={handleSave}
        disabled={!hasChanges}
      >
        שמירת שינויים
      </Button>


    </Box>
  );
}