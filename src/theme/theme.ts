import { alpha, createTheme } from "@mui/material/styles";

declare module '@mui/material/styles' {
  interface TypeBackground {
    sidebar?: string;
    reportFormOuter?: string;
    reportFormInner?: string;
  }
}

const scrollbarStyles = (thumb: string, thumbHover: string) => ({
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
});

export const getAppTheme = (mode: "light" | "dark") => {
  const theme = createTheme({
    direction: "rtl",
    palette: {
      mode,
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#9c27b0",
      },
      success: {
        main: "#2e7d32",
      },
      background: {
        default: mode === "light" ? "#f5f5f5" : "#121212",
        paper: mode === "light" ? "#fff" : "#1e1e1e",
        sidebar:
          mode === "light"
            ? "linear-gradient(180deg, rgba(207, 239, 255, 1) 0%, rgba(179, 224, 255, 0.9) 50%, rgba(155, 213, 255, 0.8) 100%)"
            : "linear-gradient(180deg, rgba(25, 25, 25, 1) 0%, rgba(50, 50, 50, 1) 100%)",
        reportFormOuter: mode === "light"
          ? "linear-gradient(135deg, #e4edf3 0%, #d9e6ee 100%)"
          : "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)",
        reportFormInner: mode === "light"
          ? "linear-gradient(135deg, #d9e4ec 0%, #c9d8e3 100%)"
          : "linear-gradient(135deg, #2a2a2a 0%, #333333 100%)",
      },

      text: {
        primary: mode === "light" ? "#000" : "#fff",
      },
    },
    typography: {
      fontFamily: "'Heebo', sans-serif",
      h6: {
        fontWeight: 600,
      },
    },

    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage:
              mode === "light"
                ? "linear-gradient(90deg, rgba(25,118,210,1) 0%, rgba(122, 75, 192, 1) 100%)"
                : "linear-gradient(90deg, rgba(30,30,30,1) 0%, rgba(60,60,60,1) 100%)",
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            '&:hover': {
              cursor: 'default',
            },
          },
        },
      },
    }
  });

  const accent = mode === "dark" ? theme.palette.primary.light : theme.palette.primary.main;
  const thumb = alpha(accent, mode === "dark" ? 0.5 : 0.4);
  const thumbHover = alpha(accent, mode === "dark" ? 0.85 : 0.72);
  const scrollbar = scrollbarStyles(thumb, thumbHover);

  theme.components!.MuiCssBaseline = {
    styleOverrides: {
      html: {
        fontSize: "clamp(14px, 1.1vw, 18px)",
        ...scrollbar,
      },
      body: scrollbar,
      "*": scrollbar,
    },
  };

  return theme;
};
