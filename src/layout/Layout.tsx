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
        height: "100vh",
        direction: "rtl",
        bgcolor: "background.default",
        color: "text.primary",
        overflow: "hidden",
      }}
    >
      <Box gridArea="topbar">
        <TopBar />
      </Box>

      <Box gridArea="sidebar">
        <SideBar />
      </Box>
      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          py: { xs: 2, sm: 3, md: 4 },
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}
