import { Paper, TextField, Button, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { Grid } from "@mui/system";
import type { EventFilters } from "../types";
import { dateTimeInputDarkModeSx } from "../styles/darkModeSx.styles";
import { validateDateRange } from "../utils/validate";


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

  const hasChanges =
    (filters.q && filters.q.trim() !== "") ||
    !!filters.dateFrom ||
    !!filters.dateTo;

  const handleChange = (field: keyof EventFilters) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      [field]: field.includes("date")
        ? e.target.value || null
        : e.target.value,
    });
  };
  const dateError = validateDateRange(filters.dateFrom, filters.dateTo);

  const theme = useTheme();

  return (
    <Paper elevation={4} sx={{ p: 3, mt: 2, borderRadius: 3, border: "1px solid #A7C7E7", height: "90px" }}>
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
            disabled={isSearching}
          />
        </Grid>
        <Grid size={2}>
          <TextField
            fullWidth
            type="date"
            label="מתאריך"
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: new Date().toISOString().split("T")[0] }}
            value={filters.dateFrom || ""}
            onChange={handleChange("dateFrom")}
            size="small"
            sx={dateTimeInputDarkModeSx(theme)}
            error={dateError?.field === "dateFrom"}
            helperText={dateError?.field === "dateFrom" ? dateError.message : ""}
            disabled={isSearching}
          />
        </Grid>
        <Grid size={2}>
          <TextField
            fullWidth
            type="date"
            label="עד תאריך"
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: new Date().toISOString().split("T")[0] }}
            value={filters.dateTo || ""}
            onChange={handleChange("dateTo")}
            size="small"
            sx={dateTimeInputDarkModeSx(theme)}
            error={dateError?.field === "dateTo"}
            helperText={dateError?.field === "dateTo" ? dateError.message : ""}
            disabled={isSearching}
          />
        </Grid>

        <Grid size={2}>
          <Button
            disabled={!hasChanges || !!dateError}
            fullWidth
            variant={isSearching ? "outlined" : "contained"}
            color={isSearching ? "error" : "primary"}
            size="large"
            startIcon={isSearching ? <ClearIcon /> : <SearchIcon />}
            onClick={onSearchToggle}
            sx={{
              height: 40, fontWeight: "bold", display: "flex", justifyContent: "space-around", opacity: hasChanges && !dateError ? 1 : 0.5
}}
          >
            {isSearching ? "נקה חיפוש" : "חפש"}
          </Button>
        </Grid>

      </Grid>
    </Paper>

  );
}
