import { Paper, Avatar, Typography, Box } from "@mui/material";
import type { UserProfileCardProps } from "../types/user";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router";
import { truncateText } from "../styles/common";


export default function UserProfileCard({ name, rank, avatarSrc, personalNumber }: UserProfileCardProps) {
    const theme = useTheme();
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                m: 2,
                borderRadius: "12px",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                    transform: "scale(1.02)",
                },
            }}
            onClick={() => navigate(`/user/${personalNumber}`)}
        >
            <Paper
                elevation={4}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: .8,
                    borderRadius: "12px",
                    width: 150,
                    height: 130,
                    bgcolor: "rgba(113, 158, 203, 0.2)",
                }}
            >
                <Avatar
                    src={avatarSrc}
                    alt={name}
                    sx={{ width: 60, height: 60, m: .5 }}
                />

                <Typography variant="h6" fontWeight={600} sx={truncateText}>
                    {name}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ ...truncateText, mb: 0.5 }}>
                    {rank}
                </Typography>

            </Paper>
        </Box>
    );
}
