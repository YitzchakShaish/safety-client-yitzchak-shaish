import { Box, Paper, Typography, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { useUser } from "../hooks/useUser";
import { roleLabel } from "../api/users.api";
import AvatarPictureField from "../components/profile/AvatarPictureField";

function detailValue(value: unknown): string {
    if (typeof value !== "string") return "—";
    const trimmed = value.trim();
    return trimmed || "—";
}

export default function UserProfilePage() {
    const { user } = useUser();
    const [tab, setTab] = useState(0);

    if (!user) return <div>Loading...</div>;

    const details: [string, string][] = [
        ["אימייל", detailValue(user.email)],
        ["דרגה", detailValue(user.rank)],
        ["תפקיד", detailValue(user.position)],
        ["יחידה", detailValue(user.unit)],
        ["הרשאה", roleLabel(typeof user.role === "string" ? user.role : undefined)],
    ];

    return (
        <Box sx={{ width: "100%", maxWidth: 520, maxHeight: "calc(100vh - 6rem)", overflow: "auto", p: 1 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Tabs value={tab} onChange={(_, newVal) => setTab(newVal)} centered>
                    <Tab label="פרופיל" />
                    <Tab label="סטטיסטיקות" />
                </Tabs>

                {tab === 0 && (
                    <Box sx={{ mt: 3 }}>
                        <AvatarPictureField />
                        <Typography variant="h6" textAlign="center" sx={{ mt: 2 }}>{user.fullName}</Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 2, rowGap: 1, mt: 2 }}>
                            {details.map(([label, value]) => (
                                <Box key={label} sx={{ display: "contents" }}>
                                    <Typography color="text.secondary">{label}</Typography>
                                    <Typography>{value}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}

                {tab === 1 && (
                    <Box sx={{ mt: 3 }}>
                        <Typography>דוחות שנוצרו: {user.reportsCount ?? 0}</Typography>
                        <Typography>דוחות עודכנו: {user.updatesCount ?? 0}</Typography>
                        <Typography>דוחות נמחקו: {user.deletesCount ?? 0}</Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}
