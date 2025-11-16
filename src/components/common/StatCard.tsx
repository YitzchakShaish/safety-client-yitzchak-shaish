import { Paper, Stack, Box, Typography } from "@mui/material";
import { cardBase, iconBox, subtitleText } from "../../styles/common";
import type { StatCardProps } from "../../types/viewFromAbove";

export default function StatCard({
  icon,
  color = "primary",
  label,
  value,
  elevation = 3,
}: StatCardProps) {
  return (
    <Paper elevation={elevation} sx={{ ...cardBase, height: 120, gap: 2 }}>
      <Box sx={iconBox(color)}>
        {icon}
      </Box>

      <Stack spacing={0.5}>
        <Typography variant="subtitle2" sx={subtitleText}>{label}</Typography>
        <Typography variant="h5" sx={{...subtitleText,   color: "text.primary"} } fontWeight={600}>{value}</Typography>
      </Stack>
    </Paper>
  );
}
