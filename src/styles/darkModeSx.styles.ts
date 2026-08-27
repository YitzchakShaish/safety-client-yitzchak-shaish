import type { Theme, SxProps } from "@mui/material/styles";

export const dateTimeInputDarkModeSx = (theme: Theme): SxProps<Theme> => ({
  '& input::-webkit-calendar-picker-indicator': {
    filter: theme.palette.mode === "dark" ? "invert(1)" : "invert(0)",
  },
});
