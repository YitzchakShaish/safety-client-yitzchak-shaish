import type { Theme } from "@mui/material/styles";

export const sidebarHeaderStyle = (theme: Theme) => ({
    px: { xs: 1, lg: "1.2rem" },
    py: { xs: 0, lg: 0, xl: "1.2rem" },
    textAlign: "center" as const,
    typography: {
        color: theme.palette.primary.main,
        fontSize: { xs: "0.75rem", lg: "1rem" },
    },
});
