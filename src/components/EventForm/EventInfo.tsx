import { FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup } from "@mui/material";
import { useEventForm } from "../../hooks/useEventForm";
import { type Location, locationArr } from "../../types/eventReport";
import MyTextField from "../MyTextField";

export default function EventInfo({ onCompleteChange }: { onCompleteChange: (valid: boolean) => void }) {
  const { eventData, setEventData } = useEventForm();

  const handleChange = (field: keyof typeof eventData.eventInfo, value: string | null) => {
    const updated = {
      ...eventData,
      eventInfo: { ...eventData.eventInfo, [field]: value },
    };
    setEventData(updated);

    const {
      eventDate,
      eventTime,
      eventDescription,
      unitActivityType,
      personalActivityType,
      category,
      location,
      eventSeverity,
      eventResult,
      weatherCondition,
    } = updated.eventInfo;

    const isValid =
      eventDate !== "" &&
      eventTime !== "" &&
      eventDescription.trim() !== "" &&
      unitActivityType !== "בחר/י" &&
      personalActivityType !== "בחר/י" &&
      category !== "בחר/י" &&
      location !== "בחר/י" &&
      eventSeverity !== "בחר/י" &&
      eventResult !== "בחר/י" &&
      weatherCondition !== "בחר/י";
    onCompleteChange(isValid);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 12 }}>
        <MyTextField
          label="תאריך אירוע"
          value={eventData.eventInfo.eventDate}
          required
          validate={(v) =>
            v === ""
              ? "שדה זה הוא חובה"
              : v > new Date().toISOString().split("T")[0]
                ? "תאריך האירוע לא יכול להיות בעתיד"
                : null
          }
          onChange={(val) => handleChange("eventDate", val)} 
          type="date"
        />

      </Grid >
      <Grid size={{ xs: 12, sm: 12 }}>
        <FormControl fullWidth>
          <FormLabel id="location-label" sx={{ mb: 1, alignItems: "center" }}>
            בחר מיקום אירוע
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="location-label"
            name="location"
            value={eventData.eventInfo.location}
            onChange={(e) => handleChange("location", e.target.value as Location)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            {locationArr.slice(1).map((loc) => (
              <FormControlLabel
                key={loc}
                value={loc}
                control={<Radio />}
                label={loc}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Grid>

    </Grid>
  );
}
