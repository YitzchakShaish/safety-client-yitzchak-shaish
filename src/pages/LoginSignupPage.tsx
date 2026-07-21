import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Paper, Typography, Link, Alert } from "@mui/material";
import { login, signup } from "../api/auth.api"
import type { AuthResponse } from "../types/authResponse";
import { useLocation, useNavigate } from "react-router";
import { useUser } from "../hooks/useUser";

type Mode = "login" | "signup";
type MessageType = "success" | "info" | "error";

export default function LoginSignupPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { updateUser } = useUser();

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
            if (type === "success") {
                navigate("/")
            }
            if (newMode) setMode(newMode);
        }, 3000);
    };

    useEffect(() => {
        if (location?.state?.message) {
            showMessage(location.state.message, "error")
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location?.state?.message, navigate, location.pathname]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) return showMessage("אנא מלא/י את כל השדות הנדרשים", "error");
        let response: AuthResponse;
        if (mode === "login") {
            response = await login(name, email)
        }
        else {
            response = await signup(name, email)
        }

        if (!response.success) {
            //More detailed tests are needed if there are other errors.
            const type: MessageType = mode === "login" ? "info" : "error";
            return showMessage(response.message, type, mode === "login" ? "signup" : "login");
        }

        if (mode === "login" && response.success) {
            updateUser(response.user);
            navigate("/");
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
                <Typography variant="h5" mb={3} textAlign="center" >
                    {mode === "login" ? "כניסה למערכת" : "הרשמה למערכת"}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField label="שם מלא" fullWidth margin="normal" value={name} InputLabelProps={{ shrink: true }}
                        placeholder={"שם מלא"} onChange={e => setName(e.target.value)} />
                    <TextField label="אימייל" type="email" fullWidth margin="normal" value={email}   InputLabelProps={{ shrink: true }}
            placeholder={"אימייל"} onChange={e => setEmail(e.target.value)} />
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
