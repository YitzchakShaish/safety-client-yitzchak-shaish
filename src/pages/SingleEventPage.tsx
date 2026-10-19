import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Alert, Box, Button, LinearProgress } from "@mui/material";
import EditSquareIcon from '@mui/icons-material/EditSquare';
import EditOffIcon from '@mui/icons-material/EditOff';
import type { EventInfo, EventReportWithId } from "../types";
import EventHeader from "../components/singeleEvent/EventHeader";
import ReportSection from "../components/singeleEvent/ReportSection";
import { deleteEventReport, getEventReport, updateEventReport } from "../api/eventReport.api";
import StatusAlert from "../components/common/StatusAlert";
import EventImagesView from "../components/singeleEvent/EventImagesView";

import { getPermissionLevel, } from "../permissions/getPermissionLevel";
import { EDITABLE_FIELDS_BY_PERMISSION } from "../permissions/editableFields"
import { useUser } from "../hooks/useUser";
import type { EditableValue } from "../components/singeleEvent/EditableField";

function finiteCoordinate(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

/** Address and coordinates stay hidden until the API actually returns them. */
function visibleEventInfo(eventInfo: EventInfo): Record<string, EditableValue> {
  const visible: Record<string, EditableValue> = {};
  for (const [key, value] of Object.entries(eventInfo) as [string, EditableValue][]) {
    if (key === "address") {
      if (typeof value === "string" && value.trim()) visible.address = value.trim();
      continue;
    }
    if (key === "latitude" || key === "longitude") {
      const coordinate = finiteCoordinate(value);
      if (coordinate != null) visible[key] = coordinate;
      continue;
    }
    visible[key] = value;
  }
  return visible;
}


export default function SingleEventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventReportWithId | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    setEvent(null);
    setError("");
    if (!id) {
      setError("לא נמצא מידע לאירוע");
      return;
    }
    getEventReport(id).then(data => {
      if (!cancelled) setEvent(data);
    }).catch(() => {
      if (!cancelled) setError("לא ניתן לטעון את האירוע. בדוק את החיבור ואת הרשאות הגישה.");
    });
    return () => { cancelled = true; };
  }, [id]);
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!event || event.id !== id) return <LinearProgress />;
  return <EventDetails key={event.id} event={event} />;
}

function EventDetails({ event }: { event: EventReportWithId }) {
  const { user } = useUser();
  const location = useLocation();
  const isEditing = new URLSearchParams(location.search).get("edit") === "true";
  const navigate = useNavigate();
  const permissionLevel = getPermissionLevel(user?.role);
  console.log(permissionLevel)
  const editableFields = EDITABLE_FIELDS_BY_PERMISSION[permissionLevel];
  console.log(editableFields)
  const [alert, setAlert] = useState<{
    open: boolean;
    status: number;
    message: string[];
  }>({ open: false, status: 0, message: [] });
  const [eventData, setEventData] = useState(event);

  // Tracks if the user has made any changes (true = unsaved changes)
  const [hasChanges, setHasChanges] = useState(false);

  // Updates a specific field in a given section immutably and marks that there are unsaved changes
  const handleChange = (
    section: "reporterInfo" | "eventInfo" | "summaryInfo",
    field: string,
    value: EditableValue
  ) => {
    setEventData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value } as (typeof prev)[typeof section]
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
        message: [response.message] as string[]
      });
      setHasChanges(false)
      toggleEditing()
    } else {
      setAlert({
        open: true,
        status: response.status,
        message: (response.message || []) as string[]
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
        message: [response.message] as string[]
      });
      setTimeout(() => {
        navigate("/events");
      }, 3000);

    } else {
      setAlert({
        open: true,
        status: response.status,
        message: (response.message || []) as string[]
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
        {permissionLevel !== "basic" && <Button variant="outlined" onClick={toggleEditing}>
          {isEditing ? "סיום עריכה " : "עריכה "}{" "}
          {isEditing ? <EditOffIcon /> : <EditSquareIcon />}
        </Button>}

      </Box>



      <ReportSection
        title="מידע על המדווח"
        data={eventData.reporterInfo}
        section="reporterInfo"
        editableFields={isEditing ? editableFields.reporterInfo ?? [] : []}
        onChange={(field, value) => handleChange("reporterInfo", field, value)}
      />

      <ReportSection
        title="פרטי האירוע"
        data={visibleEventInfo(eventData.eventInfo)}
        section="eventInfo"
        editableFields={isEditing ? editableFields.eventInfo ?? [] : []}
        onChange={(field, value) => handleChange("eventInfo", field, value)}
      />

      <ReportSection
        title="סיכום ונפגעים"
        data={eventData.summaryInfo}
        section="summaryInfo"
        editableFields={isEditing ? editableFields.summaryInfo ?? [] : []}
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
      {permissionLevel === "admin" && <Button
        variant="contained"
        size="large"
        color="error"
        sx={{ mt: 3, px: 6, display: "block", mx: "auto", opacity: hasChanges ? 1 : 0.5 }}
        onClick={handleDelete}
      >
        מחיקת אירוע
      </Button>}
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
