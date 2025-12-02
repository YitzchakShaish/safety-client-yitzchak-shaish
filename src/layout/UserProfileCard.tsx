import { Paper, Avatar, Typography, Box } from "@mui/material";
import type { UserProfileCardProps } from "../types/user";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router";
import { truncateText } from "../styles/common";

export default function UserProfileCard({ fullName, rank, id }: UserProfileCardProps) {
    const theme = useTheme();
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                m: "clamp(0.5rem, 1vw, 1rem)",
                borderRadius: "0.8rem",
                cursor: "pointer",
            }}
            onClick={() => navigate(`/user/${id}`)}
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

                <Avatar
                    src={ "1.png"}
                    alt={fullName}
                    sx={{
                        width: "clamp(3rem, 6vw, 4rem)",
                        height: "clamp(3rem, 6vw, 4rem)",
                        m: "clamp(0.3rem, 0.5vw, 0.5rem)",
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
                    {fullName}
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
                    {rank}
                </Typography>
            </Paper>
        </Box>
    );
}
