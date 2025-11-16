import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Grid } from "@mui/material";
import { useEventForm } from "../../hooks/useEventForm";
import MyTextField from "../common/MyTextField";
import { type SummaryInfo, injuryLevelArr } from "../../types/eventReport";
import { validateTextField } from "../../utils/validate";


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
    <Grid container spacing={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 3 }} sx={{ mt: { xs: 2, sm: 3, md: 3, lg: 5 } }}>

      <Grid size={{ xs: 12 }}>
        <MyTextField
          label="מסקנות האירוע"
          value={eventData.summaryInfo.recommendations}
          required
          validate={(v) => validateTextField(v, "מסקנות האירוע", 20)}
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
            validate={(v) => validateTextField(v, "פרטי פגיעות", 10)}
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
