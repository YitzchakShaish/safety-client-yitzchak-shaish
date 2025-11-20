import { Drawer, List, ListItem, ListItemButton, ListItemText, Box, Typography, Divider, ListItemIcon } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router";

//icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import SearchIcon from '@mui/icons-material/Search';
import BarChartIcon from '@mui/icons-material/BarChart';
import UserProfileCard from "./UserProfileCard";
import { sidebarItemButton } from "../styles/common";
import { sidebarHeaderStyle } from "../styles/sidebar.styles";

export default function Sidebar() {
  const theme = useTheme();
  const navigate = useNavigate();

  const menuItems = [
    { label: "מבט על", path: "/", icon: <DashboardIcon /> },
    { label: "הזנת אירוע חדש", path: "/event-entry", icon: <EventIcon /> },
    { label: "ניהול אירועים", path: "/events", icon: <SearchIcon /> },
    { label: "דוחות BI", path: "/reports", icon: <BarChartIcon /> },
  ];
  const location = useLocation();
  return (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{
        width: "clamp(8rem, 13vw, 15rem)",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: "clamp(8rem, 13vw, 15rem)",
          backgroundImage: theme.palette.background.sidebar,
          borderLeft: `1px solid ${theme.palette.divider}`,
          borderTopLeftRadius: "1rem",
          borderBottomLeftRadius: "1rem",
          boxShadow: "rgba(0,0,0,0.08) -2px 0px 6px",
          top: "4rem",
          height: "calc(100vh - 4rem)",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          transition: "width 0.3s ease",
        },
        [theme.breakpoints.down("md")]: {
          "& .MuiDrawer-paper": {
            width: "clamp(6rem, 20vw, 12rem)",
            overflow: "auto",
          },
        },
      }}
    >
      <Box sx={sidebarHeaderStyle(theme)}>
        <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
          תפריט מערכת
        </Typography>
      </Box>

      <Divider />

      <List sx={{ mt: 1, flex: 1 }}>
        {menuItems.map((item) => (      
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              sx={{
                ...sidebarItemButton(theme),
                py: { xs: 0.5, lg: 1 },
                display: 'flex',
                justifyContent: 'space-around',
                backgroundColor: location.pathname === item.path ? theme.palette.action.selected : "transparent",
              }}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                secondary={item.label}
                secondaryTypographyProps={{ fontSize: "1rem" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ width: "100%" }} />
      <Box sx={sidebarHeaderStyle(theme)}>
        <Typography variant="h6" sx={{ color: "primary.main" }}>
          פרטי משתמש
        </Typography>
      </Box>

      <Divider sx={{ width: "100%", mb: 1 }} />
      <Box sx={{ px: { xs: 1, sm: 0 }, pb: { xs: 1, sm: 0 } }}>
        <UserProfileCard
          name="אבי"
          rank='אל"מ'
          avatarSrc="1.png"
          personalNumber={770770}
        />
      </Box>
    </Drawer>
  );
}
