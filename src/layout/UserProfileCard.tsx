import { useState } from "react";
import { Paper, Typography, Box, Menu, MenuItem, Divider, ListItemIcon, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { truncateText } from "../styles/common";
import { useUser } from "../hooks/useUser";
import { useAvatarUpload } from "../hooks/useAvatarUpload";
import { roleLabel } from "../api/users.api";
import UserAvatar from "../components/common/UserAvatar";
import AvatarPictureField from "../components/profile/AvatarPictureField";

export default function UserProfileCard() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { logout } = useUser();
    const { user, busy, message, messageType, remove, dismiss } = useAvatarUpload();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [editorOpen, setEditorOpen] = useState(false);
    const menuOpen = Boolean(anchorEl);

    if (!user) return null;

    const closeMenu = () => setAnchorEl(null);

    const openProfile = () => {
        closeMenu();
        navigate("/profile");
    };

    const openEditor = () => {
        closeMenu();
        setEditorOpen(true);
    };

    const handleRemove = async () => {
        closeMenu();
        if (!user.avatarUrl || busy) return;
        if (!window.confirm("להסיר את תמונת הפרופיל?")) return;
        await remove();
    };

    const handleLogout = () => {
        closeMenu();
        if (!window.confirm("אתה בטוח שברצונך להתנתק?")) return;
        logout();
    };

    return (
        <Box sx={{ m: "clamp(0.5rem, 1vw, 1rem)" }}>
            <Box
                role="button"
                tabIndex={0}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="פתיחת תפריט משתמש"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "0.8rem",
                    cursor: "pointer",
                }}
                onClick={(event) => setAnchorEl(event.currentTarget)}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setAnchorEl(event.currentTarget);
                    }
                }}
            >
                <Paper
                    elevation={4}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: "clamp(0.4rem, 0.8vw, 0.8rem)",
                        borderRadius: "0.8rem",
                        width: "100%",
                        maxWidth: "clamp(10rem, 12vw, 12rem)",
                        minHeight: "clamp(7rem, 9vw, 9rem)",
                        bgcolor: "rgba(113, 158, 203, 0.2)",
                        transition: "0.3s",
                        "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                            transform: "scale(1.02)",
                        },
                    }}
                >
                    <UserAvatar
                        name={user.fullName}
                        avatarUrl={user.avatarUrl}
                        sx={{
                            width: "clamp(3rem, 6vw, 4rem)",
                            height: "clamp(3rem, 6vw, 4rem)",
                            m: "clamp(0.3rem, 0.5vw, 0.5rem)",
                            fontSize: "1rem",
                        }}
                    />
                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                            ...truncateText,
                            fontSize: "clamp(0.9rem, 1.2vw, 1.2rem)",
                        }}
                    >
                        {user.fullName}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            ...truncateText,
                            mb: "0.3rem",
                            fontSize: "clamp(0.8rem, 1vw, 1rem)",
                        }}
                    >
                        {user.rank}
                    </Typography>
                </Paper>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={closeMenu}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                transformOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Box sx={{ px: 2, py: 1.5, minWidth: 240, display: "flex", gap: 1.5, alignItems: "center" }}>
                    <UserAvatar name={user.fullName} avatarUrl={user.avatarUrl} sx={{ width: 56, height: 56 }} />
                    <Box sx={{ minWidth: 0 }}>
                        <Typography fontWeight={700} noWrap>{user.fullName}</Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>{user.rank || "—"}</Typography>
                        <Typography variant="body2" noWrap>{roleLabel(user.role)}</Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>יחידה: {user.unit?.trim() || "—"}</Typography>
                    </Box>
                </Box>
                <Divider />
                <MenuItem onClick={openProfile}>
                    <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                    הפרופיל שלי
                </MenuItem>
                <MenuItem onClick={openEditor}>
                    <ListItemIcon><PhotoCameraIcon fontSize="small" /></ListItemIcon>
                    {user.avatarUrl ? "החלפת תמונה" : "הוספת תמונה"}
                </MenuItem>
                <MenuItem disabled={!user.avatarUrl || busy} onClick={handleRemove}>
                    <ListItemIcon><DeleteOutlineIcon fontSize="small" /></ListItemIcon>
                    הסרת תמונה
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                    התנתקות
                </MenuItem>
            </Menu>

            <Dialog open={editorOpen} onClose={() => { if (!busy) setEditorOpen(false); }} fullWidth maxWidth="xs">
                <DialogTitle>תמונת פרופיל</DialogTitle>
                <DialogContent>
                    {editorOpen && <AvatarPictureField startEditing />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditorOpen(false)}>סגירה</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={Boolean(message)} onClose={dismiss} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity={messageType} onClose={dismiss} variant="filled">{message}</Alert>
            </Snackbar>
        </Box>
    );
}
