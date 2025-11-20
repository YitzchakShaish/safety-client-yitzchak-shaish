import { TextField, Select, MenuItem, Typography } from "@mui/material";
import { optionsMap } from "../../types";

export default function EditableField({ field, value, editable, onChange }: {
  field: string;
  value: any;
  editable: boolean;
  onChange: (value: any) => void;
}) {
  const options = optionsMap[field];

// If the field is not editable, just display its value nicely (date or fallback text)
  if (!editable) {
  const displayValue = value instanceof Date ? value.toISOString().split("T")[0] : value ?? "אין נתונים";
    return <Typography>{displayValue}</Typography>;
  }

// If the field has predefined options, show a dropdown select
  if (options) {
    return (
      <Select fullWidth value={value || ""} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
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