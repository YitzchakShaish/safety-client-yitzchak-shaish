import { useEffect, useRef, useState } from "react";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio, Box, FormLabel, Autocomplete, CircularProgress, IconButton, Tooltip, FormHelperText } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { useEventForm } from "../../hooks/useEventForm";
import { optionsMap, fieldLabels } from "../../types";
import MyTextField from "../common/MyTextField";
import { validateTextField } from "../../utils/validate";
import { dateTimeInputDarkModeSx } from "../../styles/darkModeSx.styles";
import { useTheme } from "@mui/material/styles";
import { searchAddress, reverseGeocode, type AddressSuggestion } from "../../api/geo.api";
import { getWeather } from "../../api/weather.api";
import WeatherInfoCard from "../common/WeatherInfoCard";

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
  const { eventData, setEventData, weatherDetails, setWeatherDetails } = useEventForm();

  const [addressQuery, setAddressQuery] = useState(eventData.eventInfo.address ?? "");
  const [addressOptions, setAddressOptions] = useState<AddressSuggestion[]>([]);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const weatherDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkValidity = (info: typeof eventData.eventInfo) =>
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

  const handleChange = (field: keyof typeof eventData.eventInfo, value: string) => {
    const updated = {
      ...eventData,
      eventInfo: { ...eventData.eventInfo, [field]: value },
    };
    setEventData(updated);
    onCompleteChange(checkValidity(updated.eventInfo));
  };

  const updateEventInfo = (partial: Partial<typeof eventData.eventInfo>) => {
    setEventData((prev) => {
      const updated = { ...prev, eventInfo: { ...prev.eventInfo, ...partial } };
      onCompleteChange(checkValidity(updated.eventInfo));
      return updated;
    });
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (addressQuery.trim().length < 3) {
      setAddressOptions([]);
      return;
    }

    setLoadingAddress(true);
    debounceRef.current = setTimeout(async () => {
      const results = await searchAddress(addressQuery);
      setAddressOptions(results);
      setLoadingAddress(false);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [addressQuery]);

  // Re-fetch weather automatically whenever the event's date, time or exact address changes.
  useEffect(() => {
    const { eventDate, eventTime, latitude, longitude } = eventData.eventInfo;

    if (latitude == null || longitude == null || !eventDate) {
      setWeatherDetails(null);
      return;
    }

    if (weatherDebounceRef.current) clearTimeout(weatherDebounceRef.current);

    setLoadingWeather(true);
    weatherDebounceRef.current = setTimeout(async () => {
      const weather = await getWeather(latitude, longitude, eventDate, eventTime || "12:00");
      setLoadingWeather(false);
      setWeatherDetails(weather);
      if (weather?.condition) {
        updateEventInfo({ weatherCondition: weather.condition as typeof eventData.eventInfo.weatherCondition });
      }
    }, 500);

    return () => {
      if (weatherDebounceRef.current) clearTimeout(weatherDebounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventData.eventInfo.eventDate, eventData.eventInfo.eventTime, eventData.eventInfo.latitude, eventData.eventInfo.longitude]);

  const applyLocation = (suggestion: AddressSuggestion) => {
    updateEventInfo({
      address: suggestion.displayName,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
    });
  };

  const handleAddressSelect = (suggestion: AddressSuggestion | null) => {
    if (!suggestion) {
      updateEventInfo({ address: undefined, latitude: undefined, longitude: undefined });
      return;
    }
    applyLocation(suggestion);
  };

  const handleUseCurrentLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("הדפדפן שלך לא תומך באיתור מיקום");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const suggestion = await reverseGeocode(latitude, longitude);
        setLoadingLocation(false);

        if (!suggestion) {
          setLocationError("לא ניתן היה לאתר כתובת עבור המיקום הנוכחי");
          return;
        }

        setAddressQuery(suggestion.displayName);
        applyLocation(suggestion);
      },
      (error) => {
        setLoadingLocation(false);
        setLocationError(
          error.code === error.PERMISSION_DENIED
            ? "לא אושרה גישה למיקום"
            : "לא ניתן היה לאתר את המיקום הנוכחי"
        );
      }
    );
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
        <Autocomplete
          fullWidth
          options={addressOptions}
          filterOptions={(options) => options}
          loading={loadingAddress}
          getOptionLabel={(option) => (typeof option === "string" ? option : option.displayName)}
          isOptionEqualToValue={(option, value) => option.displayName === value.displayName}
          value={
            eventData.eventInfo.address
              ? {
                  displayName: eventData.eventInfo.address,
                  latitude: eventData.eventInfo.latitude ?? 0,
                  longitude: eventData.eventInfo.longitude ?? 0,
                }
              : null
          }
          onInputChange={(_e, value) => setAddressQuery(value)}
          onChange={(_e, value) => handleAddressSelect(value)}
          noOptionsText="לא נמצאו כתובות"
          renderInput={(params) => (
            <TextField
              {...params}
              label="כתובת מדויקת של האירוע (אופציונלי)"
              helperText="מזג האוויר יתעדכן אוטומטית לפי הכתובת, התאריך והשעה שנבחרו"
              slotProps={{
                input: {
                  ...params.InputProps,
                  endAdornment: (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      {(loadingAddress || loadingWeather) ? <CircularProgress size={18} /> : null}
                      <Tooltip title="השתמש במיקום הנוכחי שלי">
                        <span>
                          <IconButton
                            size="small"
                            onClick={handleUseCurrentLocation}
                            disabled={loadingLocation}
                          >
                            {loadingLocation ? <CircularProgress size={18} /> : <MyLocationIcon fontSize="small" />}
                          </IconButton>
                        </span>
                      </Tooltip>
                      {params.InputProps.endAdornment}
                    </Box>
                  ),
                },
              }}
            />
          )}
        />
        {locationError && <FormHelperText error>{locationError}</FormHelperText>}
      </Grid>
      {eventData.eventInfo.address && (
        <Grid size={12}>
          <WeatherInfoCard
            condition={eventData.eventInfo.weatherCondition}
            temperatureC={weatherDetails?.temperatureC}
          />
        </Grid>
      )}
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