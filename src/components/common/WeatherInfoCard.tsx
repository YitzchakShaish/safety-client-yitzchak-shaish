import { Paper, Typography } from "@mui/material";

export default function WeatherInfoCard({ condition, temperatureC, address }: {
    condition?: string;
    temperatureC?: number | null;
    address?: string;
}) {
    if (!condition || condition === "בחר/י") return null;

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(41,121,255,0.12)" : "rgba(25,118,210,0.06)",
                borderColor: "primary.light",
            }}
        >
            <Typography variant="body2" fontWeight={600} color="text.primary">
                מזג האוויר בשעת האירוע: {condition}
                {temperatureC != null && `  ·  ${Math.round(temperatureC)}°`}
            </Typography>
            {address && (
                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                    {address}
                </Typography>
            )}
        </Paper>
    );
}
