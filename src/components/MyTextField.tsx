import { TextField } from "@mui/material";

export default function MyTextField({
    label,
    value,
    onChange,
    type = "text",
    readOnly = false,
    required = false,
    validate,
    color = "primary",
}: {
    label: string;
    value: string;
    onChange?: (val: string) => void;
    type?: string;
    readOnly?: boolean;
    required?: boolean;
    validate?: (val: string| Date) => string | null;
    color?: "primary" | "secondary" | "error" | "info" | "success" | "warning" ;
}) {
    const errorMessage = validate ? validate(value) : null;

    return (
        <TextField
            label={label}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            type={type}
            fullWidth
            required={required}
            error={!!errorMessage}
            helperText={errorMessage || ""}
            InputProps={readOnly ? { readOnly: true } : undefined}
            color={color}
        />
    );
};
