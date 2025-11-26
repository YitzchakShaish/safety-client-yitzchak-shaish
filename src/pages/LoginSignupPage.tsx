import React, { useState } from "react";
import { Box, TextField, Button, Paper, Typography, Link, Alert } from "@mui/material";
import { login, signup } from "../api/auth"
import type { AuthResponse } from "../types/authResponse";

export default function LoginSignupPage() {
    type Mode = "login" | "signup";
    type MessageType = "success" | "info" | "error";

    const [mode, setMode] = useState<Mode>("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<MessageType>("info");

    const showMessage = (text: string, type: MessageType = "info", newMode?: Mode) => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => {
            setMessage(null);
            if (newMode) setMode(newMode);
        }, 3000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) return showMessage("אנא מלא/י את כל השדות הנדרשים", "error");

        const action = mode === "login" ? login : signup;
        const response: AuthResponse = await action(name, email);

        if (!response.success) {
            const type: MessageType = mode === "login" ? "info" : "error";
            return showMessage(response.message, type, mode === "login" ? "signup" : "login");
        }

        const type: MessageType = mode === "login" ? "success" : "info";
        showMessage(response.message, type, mode === "signup" ? "login" : undefined);
        setName("");
        setEmail("");
    };

    return (
        <Box sx={{ height: "calc(100vh - 5rem)", p: 2 }}>
            <Box sx={{ height: 60, mb: 1, width: "auto", maxWidth: 400, display: "flex", justifyContent: "center", alignItems: "center" }}>
                {message && <Alert severity={messageType} sx={{ width: "400", textAlign: "center", px: 4 }}>{message}</Alert>}
            </Box>

            <Paper elevation={3} sx={{ width: "100%", maxWidth: 400, p: 4, borderRadius: 2 }}>
                <Typography variant="h5" mb={3} textAlign="center">
                    {mode === "login" ? "כניסה למערכת" : "הרשמה למערכת"}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField label="שם מלא" fullWidth margin="normal" value={name} onChange={e => setName(e.target.value)} />
                    <TextField label="אימייל" type="email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, py: 1.2 }}>
                        {mode === "login" ? "היכנס" : "להירשם"}
                    </Button>
                </form>

                <Box mt={2} textAlign="center">
                    <Link component="button" variant="body2" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
                        {mode === "login" ? "אין לך חשבון? להרשמה לחץ כאן" : "כבר רשום? להתחברות לחץ כאן"}
                    </Link>
                </Box>
            </Paper>
        </Box>
    );
}
