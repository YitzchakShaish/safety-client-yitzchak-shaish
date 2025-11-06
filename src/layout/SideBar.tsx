import { Drawer, List, ListItem, ListItemButton, ListItemText, Box, Typography, Divider, ListItemIcon } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router";
//icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import SearchIcon from '@mui/icons-material/Search';
import BarChartIcon from '@mui/icons-material/BarChart';
import UserProfileCard from "./UserProfileCard";
import { sidebarItemButton } from "../styles/common";

export default function Sidebar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const menuItems = [
    { label: "מבט על", path: "/", icon: <DashboardIcon /> },
    { label: "הזנת אירוע", path: "/event-entry", icon: <EventIcon /> },
    { label: "חיפוש אירועים", path: "/search-events", icon: <SearchIcon /> },
    { label: "דוחות BI", path: "/reports", icon: <BarChartIcon /> },
  ];


  return (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{
        width: 170,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 190,
          backgroundImage: theme.palette.background.sidebar || "#f7f9fb",
          borderLeft: `1px solid ${theme.palette.divider}`,
          borderTopLeftRadius: "16px",
          borderBottomLeftRadius: "16px",
          boxShadow: "rgba(0,0,0,0.08) -2px 0px 6px",
          top: "64px",
          height: "calc(100vh - 64px)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          // border: "solid red 2px"
        },
      }}
    >
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
          תפריט מערכת
        </Typography>
      </Box>
      <Divider />
      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton sx={sidebarItemButton(theme)} onClick={() => navigate(item.path)}>
              <ListItemText secondary={item.label} />
              <ListItemIcon>{item.icon}</ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ width: "100%" }} />
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h6" sx={{ color: "primary.main" }}>פרטי משתמש</Typography>
      </Box>
      <Divider sx={{ width: "100%", mb: 1 }} />

      <UserProfileCard name='אבי' rank='אל"מ' avatarSrc='1.png' personalNumber={770770}></UserProfileCard>
    </Drawer>
  );
}
