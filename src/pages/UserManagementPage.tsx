import { useEffect, useState } from "react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { getUsers, saveUser, roleLabels, type ManagedUser, type UserRole } from "../api/users.api";
import { useUser } from "../hooks/useUser";
import UserAvatar from "../components/common/UserAvatar";

const ranks = ["טוראי", "טוראי ראשון", "סמל", "סמל ראשון", "רב סמל", "סרן", "רב סרן", "אלוף משנה", "תת אלוף", "אלוף", "רב אלוף"];

export default function UserManagementPage() {
    const { user, updateUser } = useUser();
    const [users, setUsers] = useState<ManagedUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");
    const [editing, setEditing] = useState<ManagedUser | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let active = true;
        if (user?.role !== "admin") { setLoading(false); return; }
        getUsers().then(data => { if (active) setUsers(data); })
            .catch(err => { if (active) setError(err.message); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [user?.role]);

    async function handleSave() {
        if (!editing || saving) return;
        setSaving(true);
        setError("");
        try {
            const saved = await saveUser(editing);
            setUsers(previous => previous.map(item => item.id === saved.id ? saved : item));
            if (user && saved.id === user.id) updateUser(saved);
            setEditing(null);
            setMessage("פרטי המשתמש נשמרו בהצלחה");
        } catch (err) { setError(err instanceof Error ? err.message : "שגיאה בשמירה"); }
        finally { setSaving(false); }
    }

    if (user?.role !== "admin") return <Alert severity="warning">המסך זמין למנהל מערכת בלבד</Alert>;
    if (loading) return <LinearProgress />;
    const filtered = users.filter(item => (!role || item.role === role) &&
        [item.fullName, item.email, item.unit].some(value => value.toLowerCase().includes(search.toLowerCase())));

    return <Box sx={{ p: 2, direction: "rtl" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>ניהול משתמשים</Typography>
        {error && !editing && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <TextField label="חיפוש לפי שם, אימייל או יחידה" value={search} onChange={e => setSearch(e.target.value)} />
            <TextField select label="הרשאה" value={role} onChange={e => setRole(e.target.value)} sx={{ minWidth: 180 }}>
                <MenuItem value="">כל ההרשאות</MenuItem>
                {Object.entries(roleLabels).map(([value, label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
            </TextField>
        </Box>
        <TableContainer component={Paper}><Table>
            <TableHead><TableRow>{["שם", "דרגה", "תפקיד", "יחידה", "הרשאה", "פעולה"].map(label => <TableCell key={label}>{label}</TableCell>)}</TableRow></TableHead>
            <TableBody>{filtered.map(item => <TableRow key={item.id}>
                <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <UserAvatar name={item.fullName} avatarUrl={item.avatarUrl} sx={{ width: 36, height: 36, fontSize: "0.9rem" }} />
                        <Box>
                            {item.fullName}
                            <Typography variant="caption" display="block">{item.email}</Typography>
                        </Box>
                    </Box>
                </TableCell>
                <TableCell>{item.rank}</TableCell><TableCell>{item.position || "—"}</TableCell><TableCell>{item.unit || "—"}</TableCell>
                <TableCell>{roleLabels[item.role]}</TableCell><TableCell><Button onClick={() => { setEditing({ ...item }); setError(""); setMessage(""); }}>עריכה</Button></TableCell>
            </TableRow>)}{!filtered.length && <TableRow><TableCell colSpan={6}>לא נמצאו משתמשים</TableCell></TableRow>}</TableBody>
        </Table></TableContainer>
        <Dialog open={!!editing} onClose={() => { if (!saving) setEditing(null); }} fullWidth maxWidth="sm">
            <DialogTitle>עריכת משתמש — {editing?.fullName}</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error">{error}</Alert>}
                {editing && <Box sx={{ display: "grid", gap: 2, pt: 2 }}>
                    <TextField select label="דרגה צבאית" disabled={saving} value={editing.rank} onChange={e => setEditing({ ...editing, rank: e.target.value })}>
                        {ranks.map(rank => <MenuItem key={rank} value={rank}>{rank}</MenuItem>)}
                    </TextField>
                    <TextField label="תפקיד ארגוני" disabled={saving} value={editing.position} onChange={e => setEditing({ ...editing, position: e.target.value })} />
                    <TextField label="יחידה" disabled={saving} value={editing.unit} onChange={e => setEditing({ ...editing, unit: e.target.value })} />
                    <TextField select label="הרשאת מערכת" disabled={saving || editing.id === user.id} value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value as UserRole })}>
                        {Object.entries(roleLabels).map(([value, label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
                    </TextField>
                    <Typography variant="caption">הדרגה אינה משנה הרשאות. קצין בטיחות מטפל באירועי היחידה שאליה הוא משויך.</Typography>
                </Box>}
            </DialogContent>
            <DialogActions><Button disabled={saving} onClick={() => setEditing(null)}>ביטול</Button><Button variant="contained" disabled={saving} onClick={handleSave}>{saving ? "שומר..." : "שמירה"}</Button></DialogActions>
        </Dialog>
    </Box>;
}
