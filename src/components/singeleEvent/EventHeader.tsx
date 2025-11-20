import { Typography, Box } from "@mui/material";

export default function EventHeader({ eventId, status }: {
    eventId: number;
    status: string;
}) {
    return (
        <Box mb={4} textAlign="center">
            <Typography variant="h4" component="h1" gutterBottom>
                פרטי אירוע {eventId}
            </Typography>
            <Typography variant="h6" color="text.secondary">
                סטטוס: {status}
            </Typography>
        </Box>
    );
}