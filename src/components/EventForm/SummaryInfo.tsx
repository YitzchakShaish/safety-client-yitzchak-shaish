import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Grid } from "@mui/material";
import { useEventForm } from "../../hooks/useEventForm";
import MyTextField from "../MyTextField";
import { type SummaryInfo, injuryLevelArr } from "../../types/eventReport";


export default function SummaryInfoStep({
  onCompleteChange,
}: {
  onCompleteChange: (valid: boolean) => void;
}) {
  const { eventData, setEventData } = useEventForm();

  const handleChange = (
    field: keyof SummaryInfo,
    value: string | boolean
  ) => {
    const updated = {
      ...eventData,
      summaryInfo: { ...eventData.summaryInfo, [field]: value },
    };
    setEventData(updated);
    const isValid =
      updated.summaryInfo.recommendations.trim() !== "" &&
      updated.summaryInfo.approval === true;
    onCompleteChange(isValid);
  };

  const showInjuries = eventData.eventInfo.eventResult === "י.נ.א.נ (יש נפגעים, אין נזק)" || eventData.eventInfo.eventResult === "י.נ.י.נ (יש נפגעים, יש נזק)";

  return (
    <Grid container spacing={2}>

      <Grid size={{ xs: 12 }}>
        <MyTextField
          label="מסקנות האירוע"
          value={eventData.summaryInfo.recommendations}
          required
          validate={(v) => {
            if (typeof v !== "string") return null;
            if (v.trim() === "") return "שדה זה הוא חובה";
            if (v.trim().length < 30) return "מסקנות האירוע חייבות להכיל לפחות 30 תווים";
            if (!/^[\p{L}\s]+$/u.test(v)) return "מסקנות האירוע יכולות להכיל רק אותיות ורווחים";
            return null;
          }}  
          onChange={(val) => handleChange("recommendations", val)}
          multiline
          rows={4}
        />
      </Grid>
      {showInjuries && (
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth>
            <InputLabel id="injury-level-label">רמת הפגיעה</InputLabel>
            <Select
              labelId="injury-level-label"
              id="injury-level-select"
              value={eventData.summaryInfo.injuryLevel}
              label="רמת הפגיעה"
              onChange={(e) => handleChange("injuryLevel", e.target.value)}
            >
              <MenuItem value={injuryLevelArr[0]} disabled>{injuryLevelArr[0]}</MenuItem>
              {injuryLevelArr.slice(1).map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>)
      }
      {showInjuries && (
        <Grid size={{ xs: 12 }}>

          <MyTextField
            label="פרטי פגיעות"
            value={eventData.summaryInfo.injuryDetails}
            required
                   validate={(v) => {
            if (typeof v !== "string") return null;
            if (v.trim() === "") return "שדה זה הוא חובה";
            if (v.trim().length < 15) return "פרטי הפגיעות חייבים להכיל לפחות 15 תווים";
            if (!/^[\p{L}\s]+$/u.test(v)) return "פרטי הפגיעות יכולים להכיל רק אותיות ורווחים";
            return null;
          }} 
            onChange={(val) => handleChange("injuryDetails", val)}
            multiline
            rows={4}
          />
        </Grid>)
      }
      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={eventData.summaryInfo.approval}
              required
              onChange={(e) => handleChange("approval", e.target.checked)}
            />
          }
          label="אני מאשר/ת את כל הנתונים"
        />
      </Grid>
    </Grid>
  );
}
