import { Typography, AppBar, Toolbar, IconButton, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { topIconButton } from "../styles/common";
//icons
import AccountCircle from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useColorMode } from "../theme/ThemeContext";
import { useNavigate } from "react-router";

export default function TopBar() {
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();
  const navigate = useNavigate();


  return (
    <AppBar position="fixed" color="primary" sx={{ direction: "rtl", top: 0, left: 0, right: 0, zIndex: 1200, height: "4rem" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: "clamp(0.5rem, 1vw, 2rem)" }}>
          <Box component="img" src="/icon.png" alt="logo" sx={{ width: "clamp(3rem, 5vw, 4rem)" }} />
        </Box>

        <Typography variant="h6" sx={{ textAlign: "center", fontWeight: 600, fontSize: "clamp(1rem, 2vw, 1.2rem)" }}>
          מערכת ניהול אירועי בטיחות
        </Typography>

        <Box sx={{ display: "flex", gap: "clamp(0.5rem, 1vw, 1.5rem)" }}>
          <IconButton sx={topIconButton} onClick={toggleColorMode}>
            {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          <IconButton sx={topIconButton}>
            <SettingsIcon />
          </IconButton>

          <IconButton sx={topIconButton} onClick={() => navigate("auth")}>
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
