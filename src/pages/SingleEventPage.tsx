import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Box, Button } from "@mui/material";
import type { EventReportWithId } from "../types";
import EventHeader from "../components/singeleEvent/EventHeader";
import ReportSection from "../components/singeleEvent/ReportSection";
import { deleteEventReport, updateEventReport } from "../api/eventReport.api";
import StatusAlert from "../components/common/StatusAlert";


export default function SingleEventPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { event } = location.state as { event: EventReportWithId };
  let userLevel = "high";
  // userLevel = "low"; // for testing
  const [alert, setAlert] = useState<{
    open: boolean;
    status: number;
    message: string[];
  }>({ open: false, status: 0, message: [] });
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
    section: "reporterInfo" | "eventInfo" | "summaryInfo",
    field: string,
    value: any
  ) => {
    setEventData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
    setHasChanges(true)
  };

  async function handleSave() {
    console.log("saved:", eventData);
    const response = await updateEventReport(eventData)
    console.log(response)
    if (response.status=200) {
      setAlert({
        open: true,
        status: response.status,
        message: [response.message]
      });
      setHasChanges(false)
        } else {
            setAlert({
                open: true,
                status: response.status,
                message: response.message || []
            });
        }
  };
  async function handleDelete() {
    const response = await deleteEventReport(eventData.id)
    console.log(response)
      if (response.status=204) {
            setAlert({
                open: true,
                status: response.status,
                message: [response.message]
            });
            navigate("/")
        } else {
            setAlert({
                open: true,
                status: response.status,
                message: response.message || []
            });
        }
  };

  return (
    <Box padding={2}>
      <EventHeader eventId={eventData.id} status={eventData.summaryInfo.eventStatus} />

      <ReportSection
        title="מידע על המדווח"
        data={eventData.reporterInfo}
        section="reportInfo"
        editableFields={editableFields}
        onChange={(field, value) => handleChange("reporterInfo", field, value)}
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
      <Button
        variant="contained"
        size="large"
        color="error"
        sx={{ mt: 3, px: 6, display: "block", mx: "auto", opacity: hasChanges ? 1 : 0.5 }}
        onClick={handleDelete}
        disabled={!hasChanges}
      >
        מחיקת אירוע
      </Button>
      <StatusAlert
        open={alert.open}
        statusCode={alert.status}
        message={alert.message}
        onClose={() => setAlert({ ...alert, open: false })}
        duration={3000}
      />
    </Box>
  );
}