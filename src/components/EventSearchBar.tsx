import { Paper, TextField, Button, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { Grid } from "@mui/system";
import type { EventFilters } from "../types";
import { dateTimeInputDarkModeSx } from "../styles/darkModeSx.styles";


export default function EventSearchBar({
  filters,
  isSearching,
  onSearchToggle,
  onFiltersChange,
}: {
  filters: EventFilters;
  isSearching: boolean;
  onSearchToggle: () => void;
  onFiltersChange: (filters: EventFilters) => void;
}) {

  const handleChange = (field: keyof EventFilters) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFiltersChange({
      ...filters,
      [field]: field.includes("date")
        ? e.target.value || null
        : e.target.value,
    });
  };
  const theme = useTheme();

  return (
    <Paper elevation={4} sx={{ p: 3, mt: 2, borderRadius: 3, border: "1px solid #A7C7E7", width: "calc(100vw - 775px)" }}>
      <Grid container spacing={2}>
        <Grid size={6}>
          <TextField
            fullWidth
            label="חיפוש חופשי"
            placeholder="מספר אירוע, שם, יחידה, קטגוריה..."
            value={filters.q}
            onChange={handleChange("q")}
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}

          />
        </Grid>
        <Grid size={2}>
          <TextField
            fullWidth
            type="date"
            label="מתאריך"
            InputLabelProps={{ shrink: true }}
            value={filters.dateFrom || ""}
            onChange={handleChange("dateFrom")}
            size="small"
            sx={dateTimeInputDarkModeSx(theme)}
          />
        </Grid>
        <Grid size={2}>
          <TextField
            fullWidth
            type="date"
            label="עד תאריך"
            InputLabelProps={{ shrink: true }}
            value={filters.dateTo || ""}
            onChange={handleChange("dateTo")}
            size="small"
            sx={dateTimeInputDarkModeSx(theme)}
          />
        </Grid>

        <Grid size={2}>
          <Button
            fullWidth
            variant={isSearching ? "outlined" : "contained"}
            color={isSearching ? "error" : "primary"}
            size="large"
            startIcon={isSearching ? <ClearIcon /> : <SearchIcon />}
            onClick={onSearchToggle}
            sx={{ height: 40, fontWeight: "bold", display: "flex", justifyContent: "space-around" }}
          >
            {isSearching ? "נקה חיפוש" : "חפש"}
          </Button>
        </Grid>

      </Grid>
    </Paper>

  );
}
