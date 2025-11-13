import { FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, Box } from "@mui/material";
import { useEventForm } from "../../hooks/useEventForm";
import { categoryArr, eventResultArr, eventSeverityArr, type Location, locationArr, personalActivityTypeArr, unitActivityTypeArr, weatherConditionsArr } from "../../types/eventReport";
import MyTextField from "../MyTextField";
import { validateTextField } from "../../utils/validate";

export default function EventInfo({ onCompleteChange }: { onCompleteChange: (valid: boolean) => void }) {
  const { eventData, setEventData } = useEventForm();
  const eventInfoArr = [unitActivityTypeArr, personalActivityTypeArr, categoryArr, eventSeverityArr, eventResultArr, weatherConditionsArr];

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
      <Grid size={{ xs: 12, sm: 6 }}>
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
      <Grid size={{ xs: 12, sm: 6 }}>
        <MyTextField
          label="שעת אירוע"
          value={eventData.eventInfo.eventTime}
          required
          validate={(v) =>
            v === ""
              ? "שדה זה הוא חובה"
              : null
          }
          onChange={(val) => handleChange("eventTime", val)}
          type="time"
        />

      </Grid >
      <Grid size={{ xs: 12, sm: 12 }}>
        <FormControl fullWidth>
          <FormLabel id="location-label" sx={{ mb: 1 }}>
            בחר מיקום אירוע
          </FormLabel>

          <Box
            sx={{
              border: "1px solid",
              borderColor: "rgba(0, 0, 0, 0.23)",
              borderRadius: 1,
              p: 4,
              "&:hover": {
                borderColor: "black",
              },
            }}
          >
            <RadioGroup
              row
              aria-required="true"
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
          </Box>
        </FormControl>
      </Grid>

      <Grid size={{ xs: 12, sm: 12 }}>
        <MyTextField
          label="תיאור האירוע"
          value={eventData.eventInfo.eventDescription}
          required
          validate={(v) => validateTextField(v, "תיאור האירוע", 30)}
          onChange={(val) => handleChange("eventDescription", val)}
          multiline={true}
          rows={4}
          type="text"
        />
      </Grid>
      {eventInfoArr.map((arr, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth required>
            <InputLabel id={`select-label-${index}`}>
              {arr === categoryArr
                ? "קטגוריית אירוע"
                : arr === unitActivityTypeArr
                  ? "סוג פעילות יחידה"
                  : arr === personalActivityTypeArr
                    ? "סוג פעילות אישית"
                    : arr === eventSeverityArr
                      ? "חומרת האירוע"
                      : arr === eventResultArr
                        ? "תוצאת האירוע"
                        : "תנאי מזג אוויר"}
            </InputLabel>

            <Select
              labelId={`select-label-${index}`}
              id={`select-${index}`}
              value={
                arr === categoryArr
                  ? eventData.eventInfo.category
                  : arr === unitActivityTypeArr
                    ? eventData.eventInfo.unitActivityType
                    : arr === personalActivityTypeArr
                      ? eventData.eventInfo.personalActivityType
                      : arr === eventSeverityArr
                        ? eventData.eventInfo.eventSeverity
                        : arr === eventResultArr
                          ? eventData.eventInfo.eventResult
                          : eventData.eventInfo.weatherCondition
              }
              label={
                arr === categoryArr
                  ? "קטגוריית אירוע"
                  : arr === unitActivityTypeArr
                    ? "סוג פעילות יחידה"
                    : arr === personalActivityTypeArr
                      ? "סוג פעילות אישית"
                      : arr === eventSeverityArr
                        ? "חומרת האירוע"
                        : arr === eventResultArr
                          ? "תוצאת האירוע"
                          : "תנאי מזג אוויר"
              }
              onChange={(val) =>
                handleChange(
                  arr === categoryArr
                    ? "category"
                    : arr === unitActivityTypeArr
                      ? "unitActivityType"
                      : arr === personalActivityTypeArr
                        ? "personalActivityType"
                        : arr === eventSeverityArr
                          ? "eventSeverity"
                          : arr === eventResultArr
                            ? "eventResult"
                            : "weatherCondition",
                  val.target.value as string
                )
              }
            >
              <MenuItem value={arr[0]} disabled>
                {arr[0]}
              </MenuItem>
              {arr.slice(1).map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      ))}
    </Grid>
  );
}
