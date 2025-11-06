import { createTheme } from "@mui/material/styles";

declare module '@mui/material/styles' {
  interface TypeBackground {
    sidebar?: string;
  }
}

export const getAppTheme = (mode: "light" | "dark") =>
  createTheme({
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
      }
    }
  });
