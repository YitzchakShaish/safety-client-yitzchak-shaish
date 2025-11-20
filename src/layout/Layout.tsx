import { Outlet } from "react-router";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import { Box, Container } from "@mui/material";

export default function Layout() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gridTemplateRows: "4rem 1fr",
        gridTemplateAreas: `
          "topbar topbar"
          "sidebar main"
        `,
        minHeight: "100vh",
        direction: "rtl",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Box gridArea="topbar">
        <TopBar />
      </Box>

      <Box gridArea="sidebar">
        <SideBar />
      </Box>
      <Box
        gridArea="main"
      >
        <Container
          maxWidth="lg"
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
