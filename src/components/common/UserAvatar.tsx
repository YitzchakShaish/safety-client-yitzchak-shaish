import { Avatar } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import { API_BASE_URL } from "../../config/env";
import { resolveAvatarUrl, userInitials } from "../../utils/avatar";

export default function UserAvatar({
    name,
    avatarUrl,
    src,
    sx,
}: {
    name?: string | null;
    avatarUrl?: string | null;
    src?: string | null;
    sx?: SxProps<Theme>;
}) {
    const resolved = src || resolveAvatarUrl(avatarUrl, API_BASE_URL);
    const initials = userInitials(name);

    return (
        <Avatar
            src={resolved}
            alt={name || "משתמש"}
            sx={[{ bgcolor: "primary.main", color: "primary.contrastText" }, sx] as SxProps<Theme>}
        >
            {initials || <PersonIcon fontSize="inherit" />}
        </Avatar>
    );
}
