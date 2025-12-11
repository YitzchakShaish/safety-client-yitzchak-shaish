import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Box, Button } from "@mui/material";
import EditSquareIcon from '@mui/icons-material/EditSquare';
import EditOffIcon from '@mui/icons-material/EditOff';
import type { EventReportWithId } from "../types";
import EventHeader from "../components/singeleEvent/EventHeader";
import ReportSection from "../components/singeleEvent/ReportSection";
import { deleteEventReport, updateEventReport } from "../api/eventReport.api";
import StatusAlert from "../components/common/StatusAlert";
import EventImagesView from "../components/singeleEvent/EventImagesView";


export default function SingleEventPage() {

  const location = useLocation();
  const isEditing = new URLSearchParams(location.search).get("edit") === "true";
  const navigate = useNavigate();
  const { event } = location.state as { event: EventReportWithId };
  let userLevel = "high";
  userLevel = "low"; // for testing
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
    if (response.status === 200) {
      setAlert({
        open: true,
        status: response.status,
        message: [response.message]
      });
      setHasChanges(false)
      toggleEditing()
    } else {
      setAlert({
        open: true,
        status: response.status,
        message: response.message || []
      });
    }
  };

  async function handleDelete() {
    const confirmed = window.confirm("אתה בטוח שברצונך למחוק את האירוע הזה?");
    if (!confirmed) return;
    const response = await deleteEventReport(eventData.id)
    console.log(response)
    if (response.status === 200) {
      setAlert({
        open: true,
        status: response.status,
        message: [response.message]
      });
      setTimeout(() => {
        navigate("/events");
      }, 3000);

    } else {
      setAlert({
        open: true,
        status: response.status,
        message: response.message || []
      });
    }
  };

  function toggleEditing() {
    const params = new URLSearchParams(location.search);

    if (isEditing) {
      params.delete("edit");
    } else {
      params.set("edit", "true");
    }

    navigate(`?${params.toString()}`, {
      replace: true,
      state: { event }
    });
  }

  return (
    <Box padding={2}>
      <EventHeader eventId={eventData.id} status={eventData.summaryInfo.eventStatus} />
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="outlined" onClick={toggleEditing}>
          {isEditing ? "סיום עריכה " : "עריכה "}{" "}
          {isEditing ? <EditOffIcon /> : <EditSquareIcon />}
        </Button>

      </Box>



      <ReportSection
        title="מידע על המדווח"
        data={eventData.reporterInfo}
        section="reportInfo"
        editableFields={isEditing ? editableFields : []}
        onChange={(field, value) => handleChange("reporterInfo", field, value)}
      />

      <ReportSection
        title="פרטי האירוע"
        data={eventData.eventInfo}
        section="eventInfo"
        editableFields={isEditing ? editableFields : []}
        onChange={(field, value) => handleChange("eventInfo", field, value)}
      />

      <ReportSection
        title="סיכום ונפגעים"
        data={eventData.summaryInfo}
        section="summaryInfo"
        editableFields={isEditing ? editableFields : []}
        onChange={(field, value) => handleChange("summaryInfo", field, value)}
      />
      {eventData?.images.length > 0 && <EventImagesView images={eventData.images}></EventImagesView>}

      {isEditing && <Button
        variant="contained"
        size="large"
        color="primary"
        sx={{ mt: 3, px: 6, display: "block", mx: "auto", opacity: hasChanges ? 1 : 0.5 }}
        onClick={handleSave}
        disabled={!hasChanges}
      >
        שמירת שינויים
      </Button>}
      <Button
        variant="contained"
        size="large"
        color="error"
        sx={{ mt: 3, px: 6, display: "block", mx: "auto", opacity: hasChanges ? 1 : 0.5 }}
        onClick={handleDelete}
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