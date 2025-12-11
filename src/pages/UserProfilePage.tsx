import React, { useState } from "react";
import { Box, Paper, Typography, Avatar, Button, Alert, Tab, Tabs } from "@mui/material";
import { useUser } from "../hooks/useUser";

type MessageType = "success" | "info" | "error";

export default function UserProfilePage() {
    const { user, updateUser } = useUser();
    const [editing, setEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<MessageType>("info");
    const [tab, setTab] = useState(0); // 0 = Profile, 1 = Statistics

    const showMessage = (text: string, type: MessageType = "info") => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => setMessage(null), 3000);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!selectedFile || !user) return;
        // דוגמה: updateUser({...user, avatarUrl: uploadedUrl})
        showMessage("התמונה עודכנה בהצלחה", "success");
        setEditing(false);
    };

    if (!user) return <div>Loading...</div>;

    return (
        <Box sx={{ height: "calc(100vh - 5rem)", p: 2, display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: "100%", maxWidth: 500 }}>
                {message && <Alert severity={messageType} sx={{ mb: 2 }}>{message}</Alert>}

                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Tabs value={tab} onChange={(_, newVal) => setTab(newVal)} centered>
                        <Tab label="פרופיל" />
                        <Tab label="סטטיסטיקות" />
                    </Tabs>

                    {tab === 0 && (
                        <Box sx={{ textAlign: "center", mt: 3 }}>
                            <Avatar src={user.avatarUrl} sx={{ width: 100, height: 100, mx: "auto", mb: 2 }} />
                            <Typography variant="h6" mb={2}>{user.fullName}</Typography>

                            {editing ? (
                                <Box>
                                    <input type="file" onChange={handleFileChange} />
                                    <Button variant="contained" sx={{ mt: 2 }} onClick={handleUpload}>
                                        שמור תמונה
                                    </Button>
                                    <Button variant="text" sx={{ mt: 1 }} onClick={() => setEditing(false)}>
                                        ביטול
                                    </Button>
                                </Box>
                            ) : (
                                <Button variant="contained" onClick={() => setEditing(true)}>ערוך פרופיל</Button>
                            )}
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
        </Box>
    );
}
