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

      <Box
        gridArea="main"
        component="main"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "all 0.3s ease",
        }}
      >
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid",
          }}
        >
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
