import { useEffect, useState, type ChangeEvent } from "react";
import { Alert, Box, Button, Typography } from "@mui/material";
import { useAvatarUpload } from "../../hooks/useAvatarUpload";
import { validateAvatarFile } from "../../utils/avatar";
import UserAvatar from "../common/UserAvatar";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif";

export default function AvatarPictureField({ startEditing = false }: { startEditing?: boolean }) {
    const { user, busy, message, messageType, upload, remove, showMessage } = useAvatarUpload();
    const [editing, setEditing] = useState(startEditing);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [selectedFile]);

    if (!user) return null;

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        event.target.value = "";
        if (!file) return;
        const error = validateAvatarFile(file);
        if (error) {
            setSelectedFile(null);
            showMessage(error, "error");
            return;
        }
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            showMessage("יש לבחור תמונת פרופיל", "error");
            return;
        }
        const saved = await upload(selectedFile);
        if (saved) {
            setSelectedFile(null);
            setEditing(false);
        }
    };

    const handleRemove = async () => {
        if (!user.avatarUrl || busy) return;
        if (!window.confirm("להסיר את תמונת הפרופיל?")) return;
        const removed = await remove();
        if (removed) {
            setSelectedFile(null);
            setEditing(false);
        }
    };

    const cancel = () => {
        setSelectedFile(null);
        setEditing(false);
    };

    return (
        <Box sx={{ textAlign: "center" }}>
            {message && <Alert severity={messageType} sx={{ mb: 2, textAlign: "right" }}>{message}</Alert>}
            <UserAvatar
                name={user.fullName}
                avatarUrl={user.avatarUrl}
                src={previewUrl}
                sx={{ width: 104, height: 104, mx: "auto", mb: 1, fontSize: "2rem" }}
            />
            {previewUrl && (
                <Typography variant="caption" color="primary" display="block" sx={{ mb: 1 }}>
                    תצוגה מקדימה
                </Typography>
            )}
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                JPG, PNG, WEBP או GIF, עד 5MB
            </Typography>

            {editing ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <Button variant="outlined" component="label" disabled={busy}>
                        בחירת תמונה
                        <input type="file" hidden accept={ACCEPT} onChange={handleFileChange} />
                    </Button>
                    {selectedFile && (
                        <Typography variant="body2" sx={{ maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {selectedFile.name}
                        </Typography>
                    )}
                    <Button variant="contained" disabled={busy || !selectedFile} onClick={handleUpload}>
                        {busy ? "שומר..." : "שמירת תמונה"}
                    </Button>
                    <Button variant="text" disabled={busy} onClick={cancel}>ביטול</Button>
                </Box>
            ) : (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
                    <Button variant="contained" disabled={busy} onClick={() => setEditing(true)}>
                        {user.avatarUrl ? "החלפת תמונה" : "הוספת תמונה"}
                    </Button>
                    {user.avatarUrl && (
                        <Button variant="outlined" color="error" disabled={busy} onClick={handleRemove}>
                            הסרת תמונה
                        </Button>
                    )}
                </Box>
            )}
        </Box>
    );
}
