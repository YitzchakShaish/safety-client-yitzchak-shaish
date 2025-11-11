import { Grid} from "@mui/material";
import { useEventForm } from "../../hooks/useEventForm";
import MyTextField from "../MyTextField";

export default function ReporterInfo({
  onCompleteChange,
}: {
  onCompleteChange: (valid: boolean) => void;
}) {
  const { eventData, setEventData } = useEventForm();

  const handleChange = (field: keyof typeof eventData.reportInfo, value: string) => {
    const updated = {
      ...eventData,
      reportInfo: { ...eventData.reportInfo, [field]: value },
    };
    setEventData(updated);

    const { fullName, phone, position, unit } = updated.reportInfo;
    const isValid =
      fullName.trim() !== "" &&
      phone.trim() !== "" &&
      position.trim() !== "" &&
      unit.trim() !== "";
    onCompleteChange(isValid);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <MyTextField
          label="שם המדווח"
          value={eventData.reportInfo.fullName}
          required
          type="text"
          validate={(v) => {
            if (typeof v !== "string") return null;
            return v.trim() === "" ? "שדה זה הוא חובה" : v.length < 5 ? "שם המדווח חייב להכיל לפחות 5 תווים" : null;
          }}
          onChange={(val) => handleChange("fullName", val)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <MyTextField
          label="טלפון"
          value={eventData.reportInfo.phone}
          type="tel"
          required
          validate={(v) =>{
            if (typeof v !== "string") return null;
            return v.trim() === "" ? "שדה זה הוא חובה" : !/^\+?\d{7,15}$/.test(v) ? "נא להזין מספר טלפון תקין" : null;
          }}
          onChange={(val) => handleChange("phone", val)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <MyTextField
          label="תפקיד"
          value={eventData.reportInfo.position}
          onChange={(val) => handleChange("position", val)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <MyTextField
          label="יחידה"
          value={eventData.reportInfo.unit}
          onChange={(val) => handleChange("unit", val)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <MyTextField
          label="תת-יחידה"
          value={eventData.reportInfo.subUnit}
          onChange={(val) => handleChange("subUnit", val)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <MyTextField label="סטטוס טיפול" value={eventData.reportInfo.eventStatus} readOnly color="error"/>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <MyTextField
          label="תאריך דיווח"
          value={eventData.reportInfo.reportDate.toLocaleDateString("he-IL")}
          readOnly
          color="secondary"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <MyTextField label="שעת דיווח" value={eventData.reportInfo.reportTime} readOnly color="secondary"
        />
      </Grid>
    </Grid>

  );
};
