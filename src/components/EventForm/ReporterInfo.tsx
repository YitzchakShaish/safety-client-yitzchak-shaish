import { Grid } from "@mui/material";
import { useEventForm } from "../../hooks/useEventForm";
import MyTextField from "../common/MyTextField";
import { validateFullName, validateTextField } from "../../utils/validate";

export default function ReporterInfo({
  onCompleteChange,
}: {
  onCompleteChange: (valid: boolean) => void;
}) {
  const { eventData, setEventData } = useEventForm();

  const handleChange = (field: keyof typeof eventData.reporterInfo, value: string) => {
    const updated = {
      ...eventData,
      reporterInfo: { ...eventData.reporterInfo, [field]: value },
    };
    setEventData(updated);

    const { fullName, phone, position, unit } = updated.reporterInfo;
    const isValid =
      fullName.trim() !== "" &&
      phone.trim() !== "" &&
      position.trim() !== "" &&
      unit.trim() !== "";
    onCompleteChange(isValid);
  };

  return (
    <Grid container spacing={{ xs: 3, sm: 4, md: 4, lg: 4, xl: 6 }} sx={{ mt: { xs: 2, sm: 3, md: 3, lg: 4, xl: 5 } }}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <MyTextField
          label="שם המדווח"
          value={eventData.reporterInfo.fullName}
          required
          type="text"
          validate={(v) => validateFullName(v)}
          onChange={(val) => handleChange("fullName", val)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <MyTextField
          label="טלפון"
          value={eventData.reporterInfo.phone}
          type="tel"
          required
          validate={(v) => {
            if (typeof v !== "string") return null;
            return v.trim() === "" ? "שדה זה הוא חובה" : !/^\+?\d{7,15}$/.test(v) ? "נא להזין מספר טלפון תקין" : null;
          }}
          onChange={(val) => handleChange("phone", val)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <MyTextField
          label="תפקיד"
          value={eventData.reporterInfo.position}
          onChange={(val) => handleChange("position", val)}
          required
          type="text"
          validate={(v) => validateTextField(v, "תפקיד")}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <MyTextField
          label="יחידה"
          value={eventData.reporterInfo.unit}
          onChange={(val) => handleChange("unit", val)}
          required
          type="text"
          validate={(v) => validateTextField(v, "יחידה")}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <MyTextField
          label="תת-יחידה"
          type="text"
          value={eventData.reporterInfo.subUnit}
          onChange={(val) => handleChange("subUnit", val)}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <MyTextField
          label="תאריך דיווח"
          value={eventData.reporterInfo.reportDate.toLocaleDateString("he-IL")} readOnly color="secondary"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <MyTextField label="שעת דיווח" value={eventData.reporterInfo.reportTime} readOnly color="secondary" />
      </Grid>
    </Grid>
  );
};
