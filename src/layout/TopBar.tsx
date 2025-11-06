import { Typography, AppBar, Toolbar, IconButton, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { topIconButton } from "../styles/common";
//icons
import AccountCircle from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export default function TopBar() {
  const theme = useTheme();

  return (
    <AppBar position="fixed" color="primary" sx={{ direction: "rtl", top: 0, left: 0, right: 0, zIndex: 1200 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <img src="/icon.png" alt="logo" style={{ width: 55 }} />
        </Box>

        <Typography variant="h6" sx={{ textAlign: "center", fontWeight: 600 }}>
          מערכת ניהול אירועי בטיחות
        </Typography>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <IconButton sx={topIconButton}>
            {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          <IconButton sx={topIconButton}>
            <SettingsIcon />
          </IconButton>

          <IconButton sx={topIconButton}>
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
