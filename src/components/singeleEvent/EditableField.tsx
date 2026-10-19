import { TextField, Select, MenuItem, Typography } from "@mui/material";
import { optionsMap, optionsStatus } from "../../types";

export type EditableValue = string | number | boolean | Date | null | undefined;

const COORDINATE_FIELDS = new Set(["latitude", "longitude"]);

function isBooleanField(field: string, value: EditableValue): boolean {
  return field === "approval" || typeof value === "boolean";
}

function booleanChoice(value: EditableValue): "true" | "false" | "" {
  if (value === true || value === "true") return "true";
  if (value === false || value === "false") return "false";
  return "";
}

function formatCoordinate(value: number): string {
  return value.toFixed(6).replace(/\.?0+$/, "");
}

function formatDisplayValue(field: string, value: EditableValue): string {
  if (isBooleanField(field, value)) {
    if (value === true || value === "true") return "כן";
    if (value === false || value === "false") return "לא";
    return "אין נתונים";
  }
  if (value instanceof Date) return value.toISOString().split("T")[0];
  if (typeof value === "number" && COORDINATE_FIELDS.has(field)) return formatCoordinate(value);
  if (value == null || value === "") return "אין נתונים";
  return String(value);
}

export default function EditableField({ field, value, editable, onChange }: {
  field: string;
  value: EditableValue;
  editable: boolean;
  onChange: (value: EditableValue) => void;
}) {
  const options = optionsMap[field];
  const optionsS = optionsStatus[field];
  const coordinate = COORDINATE_FIELDS.has(field);

  // If the field is not editable, just display its value nicely (date or fallback text)
  if (!editable) {
    return (
      <Typography
        overflow="auto"
        dir={coordinate ? "ltr" : undefined}
        sx={coordinate ? { unicodeBidi: "isolate" } : undefined}
      >
        {formatDisplayValue(field, value)}
      </Typography>
    );
  }

  // Approval is a real boolean. A text box would save "true"/"false" strings and hide false.
  if (isBooleanField(field, value)) {
    return (
      <Select
        fullWidth
        value={booleanChoice(value)}
        onChange={(e) => onChange(e.target.value === "true")}
      >
        <MenuItem value="true">כן</MenuItem>
        <MenuItem value="false">לא</MenuItem>
      </Select>
    );
  }

  // If the field has predefined options, show a dropdown select
  if (options) {
    return (
      <Select fullWidth value={value || ""} onChange={(e) => onChange(e.target.value)}>
        {options.slice(1).map((opt) => (
          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
        ))}
      </Select>
    );
  }
  if (optionsS) {
    return (
      <Select fullWidth value={value || ""} onChange={(e) => onChange(e.target.value)}>
        {optionsS.map((opt) => (
          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
        ))}
      </Select>
    );
  }

  const textValue = typeof value === "string" || typeof value === "number" ? value : "";

  // Otherwise, show a normal text input for editing
  return (
    <TextField
      fullWidth
      value={textValue}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
