import { TextField, Select, MenuItem, Typography } from "@mui/material";
import { optionsMap, optionsStatus } from "../../types";

export type EditableValue = string | number | boolean | Date | null | undefined;

export default function EditableField({ field, value, editable, onChange }: {
  field: string;
  value: EditableValue;
  editable: boolean;
  onChange: (value: EditableValue) => void;
}) {
  const options = optionsMap[field];
  const optionsS = optionsStatus[field];

// If the field is not editable, just display its value nicely (date or fallback text)
  if (!editable) {
  const displayValue = value instanceof Date ? value.toISOString().split("T")[0] : value ?? "אין נתונים";
    return <Typography overflow={"auto"}>{displayValue}</Typography>;
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

// Otherwise, show a normal text input for editing
  return (
    <TextField
      fullWidth
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
