import { useEffect, useState } from "react";
import { Alert, Box, Button, LinearProgress, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { getSafetyOverview, type SafetyOverview } from "../api/safetyOverview.api";
import { printSafetyReport } from "../utils/printSafetyReport";
import { useUser } from "../hooks/useUser";

function dateInput(daysAgo = 0) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function SafetyOverviewPage() {
    const { user } = useUser();
    const navigate = useNavigate();
    const [from, setFrom] = useState(() => dateInput(29));
    const [to, setTo] = useState(() => dateInput());
    const [unit, setUnit] = useState("");
    const [data, setData] = useState<SafetyOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const allowed = user?.role === "admin" || user?.role === "safety_officer";
    useEffect(() => {
        let active = true;
        if (!allowed) { setLoading(false); return; }
        setLoading(true); setError(""); setData(null);
        getSafetyOverview(from, to, unit).then(result => { if (active) setData(result); })
            .catch(err => { if (active) setError(err.message); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [from, to, unit, allowed, user?.unit]);
    if (!allowed) return <Alert severity="warning">הסקירה זמינה לקצין בטיחות ולמנהל מערכת</Alert>;
    const max = Math.max(1, ...(data?.weeks.map(week => week.total) || []));
    return <Box sx={{ p: 2, direction: "rtl" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>סקירת בטיחות</Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
            <TextField label="מתאריך" type="date" value={from} onChange={e => setFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField label="עד תאריך" type="date" value={to} onChange={e => setTo(e.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField select label="יחידה" value={unit} onChange={e => setUnit(e.target.value)} sx={{ minWidth: 180 }}>
                <MenuItem value="">כל היחידות המורשות</MenuItem>
                {[...new Set([...(data?.units || []), ...(unit ? [unit] : [])])].map(value => <MenuItem key={value} value={value}>{value}</MenuItem>)}
            </TextField>
            <Button variant="outlined" disabled={!data || loading} onClick={() => {
                try { if (data) printSafetyReport(data); } catch (err) { setError(err instanceof Error ? err.message : "שגיאה בהפקת דוח"); }
            }}>הפקת דוח / PDF</Button>
        </Box>
        {loading && <LinearProgress />}{error && <Alert severity="error">{error}</Alert>}
        {data && <>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
                {[["אירועים שדווחו", data.total], ["אירועים חמורים", data.severe], ["אירועים פתוחים", data.open], ["אירועים שטופלו", data.treated]].map(([label, value]) => <Paper key={label} sx={{ p: 2 }}><Typography>{label}</Typography><Typography variant="h4">{value}</Typography></Paper>)}
            </Box>
            {!data.total && <Alert severity="info" sx={{ mb: 2 }}>אין אירועים בטווח שנבחר</Alert>}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, mb: 3 }}>
                <Paper sx={{ p: 2 }}><Typography variant="h6">מגמת אירועים לפי שבוע</Typography>
                    {data.weeks.map(week => <Box key={week.date} sx={{ my: 2 }}>
                        <Typography variant="body2">{week.date}: {week.total} אירועים, {week.severe} חמורים</Typography>
                        <Box sx={{ bgcolor: "action.hover", height: 16, borderRadius: 1, overflow: "hidden" }}><Box sx={{ bgcolor: "primary.main", width: `${week.total / max * 100}%`, height: "100%" }} /></Box>
                        <Box sx={{ bgcolor: "error.main", width: `${week.severe / max * 100}%`, height: 5, mt: 0.5 }} />
                    </Box>)}
                </Paper>
                <Paper sx={{ p: 2 }}><Typography variant="h6">התפלגות לפי סוג אירוע</Typography>
                    {data.categories.map(item => <Box key={item.label} sx={{ my: 2 }}><Typography variant="body2">{item.label}: {item.value}</Typography><LinearProgress variant="determinate" value={item.value / Math.max(data.total, 1) * 100} sx={{ height: 12, borderRadius: 1 }} /></Box>)}
                </Paper>
            </Box>
            <Typography variant="h6" sx={{ mb: 1 }}>אירועים הדורשים טיפול</Typography>
            <TableContainer component={Paper}><Table><TableHead><TableRow>{["תאריך", "יחידה", "סוג", "חומרה", "סטטוס", "פעולה"].map(label => <TableCell key={label}>{label}</TableCell>)}</TableRow></TableHead>
                <TableBody>{data.events.filter(event => event.status !== "טופל").map(event => <TableRow key={event.id}><TableCell>{event.date}</TableCell><TableCell>{event.unit}</TableCell><TableCell>{event.category}</TableCell><TableCell>{event.severity}</TableCell><TableCell>{event.status}</TableCell><TableCell><Button onClick={() => navigate(`/events/${event.id}`)}>צפייה</Button></TableCell></TableRow>)}
                    {!data.open && <TableRow><TableCell colSpan={6}>אין אירועים פתוחים בטווח שנבחר</TableCell></TableRow>}
                </TableBody></Table></TableContainer>
        </>}
    </Box>;
}
