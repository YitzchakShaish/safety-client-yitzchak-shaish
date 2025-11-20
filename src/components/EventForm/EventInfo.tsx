import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio, Box, FormLabel } from "@mui/material";
import { useEventForm } from "../../hooks/useEventForm";
import { optionsMap, fieldLabels } from "../../types";
import MyTextField from "../common/MyTextField";
import { validateTextField } from "../../utils/validate";
import { dateTimeInputDarkModeSx } from "../../styles/darkModeSx.styles";
import { useTheme } from "@mui/material/styles";

const SELECT_FIELDS = [
  "unitActivityType",
  "personalActivityType",
  "category",
  "eventSeverity",
  "eventResult",
  "weatherCondition",
] as const;

export default function EventInfo({ onCompleteChange }: { onCompleteChange: (valid: boolean) => void }) {
  const theme = useTheme();
  const { eventData, setEventData } = useEventForm();

  const handleChange = (field: keyof typeof eventData.eventInfo, value: string) => {
    const updated = {
      ...eventData,
      eventInfo: { ...eventData.eventInfo, [field]: value },
    };
    setEventData(updated);

    const info = updated.eventInfo;
    const isValid =
      info.eventDate !== "" &&
      info.eventTime !== "" &&
      info.eventDescription.trim() !== "" &&
      info.unitActivityType !== "בחר/י" &&
      info.personalActivityType !== "בחר/י" &&
      info.category !== "בחר/י" &&
      info.location !== "בחר/י" &&
      info.eventSeverity !== "בחר/י" &&
      info.eventResult !== "בחר/י" &&
      info.weatherCondition !== "בחר/י";

    onCompleteChange(isValid);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="תאריך אירוע"
          type="date"
          value={eventData.eventInfo.eventDate}
          required
          fullWidth
          inputProps={{ max: new Date().toISOString().split("T")[0] }}

          onChange={(e) => handleChange("eventDate", e.target.value)}
          sx={dateTimeInputDarkModeSx(theme)}
          helperText={
            eventData.eventInfo.eventDate === ""
              ? "שדה זה הוא חובה"
              : eventData.eventInfo.eventDate > new Date().toISOString().split("T")[0]
                ? "תאריך האירוע לא יכול להיות בעתיד"
                : ""
          }
          error={eventData.eventInfo.eventDate > new Date().toISOString().split("T")[0]}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="שעת אירוע"
          value={eventData.eventInfo.eventTime}
          required
          fullWidth
          sx={dateTimeInputDarkModeSx(theme)}
          helperText={
            eventData.eventInfo.eventTime === ""
            ? "שדה זה הוא חובה"
            : ""
          }
          onChange={(e) => handleChange("eventTime", e.target.value)}
          type="time"
        />
      </Grid>

      <Grid size={12}>
        <FormControl fullWidth required>
          <FormLabel sx={{ mb: 1 }}>מיקום האירוע</FormLabel>
          <Box sx={{ border: "1px solid rgba(0,0,0,0.23)", borderRadius: 1, p: 2, "&:hover": { borderColor: "black" } }}>
            <RadioGroup
              row
              value={eventData.eventInfo.location}
              onChange={(e) => handleChange("location", e.target.value)}
              sx={{ justifyContent: "space-between", flexWrap: "wrap" }}
            >
              {optionsMap.location.slice(1).map((loc) => (
                <FormControlLabel key={loc} value={loc} control={<Radio />} label={loc} />
              ))}
            </RadioGroup>
          </Box>
        </FormControl>
      </Grid>
      <Grid size={12}>
        <MyTextField
          label="תיאור האירוע"
          value={eventData.eventInfo.eventDescription}
          required
          validate={(v) => validateTextField(v, "תיאור האירוע", 30)}
          onChange={(val) => handleChange("eventDescription", val)}
          multiline
          rows={4}
        />
      </Grid>
      {SELECT_FIELDS.map((field) => {
        const options = optionsMap[field];
        const value = eventData.eventInfo[field];
        const label = fieldLabels[field];

        return (
          <Grid key={field} size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required>
              <InputLabel>{label}</InputLabel>
              <Select
                value={value}
                label={label}
                onChange={(e) => handleChange(field, e.target.value)}
              >
                {options.map((opt) => (
                  <MenuItem key={opt} value={opt} disabled={opt === "בחר/י"}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        );
      })}
    </Grid>
  );
}