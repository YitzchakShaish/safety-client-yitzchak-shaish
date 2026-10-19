import { alpha, type Theme } from "@mui/material/styles";

/**
 * Slim scrollbar for the sidebar's scroll container.
 * Firefox uses scrollbar-width / scrollbar-color; Chrome and Edge use
 * ::-webkit-scrollbar. The document is dir=rtl, so the bar stays on the
 * sidebar's inline-start edge and does not change the page grid.
 */
export const sidebarScrollbarSx = (theme: Theme) => {
    const accent = theme.palette.mode === "dark"
        ? theme.palette.primary.light
        : theme.palette.primary.main;
    const thumb = alpha(accent, theme.palette.mode === "dark" ? 0.5 : 0.4);
    const thumbHover = alpha(accent, theme.palette.mode === "dark" ? 0.85 : 0.72);

    return {
        scrollbarWidth: "thin" as const,
        scrollbarColor: `${thumb} transparent`,
        "&:hover": {
            scrollbarColor: `${thumbHover} transparent`,
        },
        "&::-webkit-scrollbar": {
            width: 6,
            height: 6,
        },
        "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: thumb,
            borderRadius: 999,
        },
        "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: thumbHover,
        },
        "&::-webkit-scrollbar-corner": {
            backgroundColor: "transparent",
        },
    };
};

export const sidebarHeaderStyle = (theme: Theme) => ({
    px: { xs: 1, lg: "1.2rem" },
    py: { xs: 0, lg: 0, xl: "1.2rem" },
    textAlign: "center" as const,
    typography: {
        color: theme.palette.primary.main,
        fontSize: { xs: "0.75rem", lg: "1rem" },
    },
});
