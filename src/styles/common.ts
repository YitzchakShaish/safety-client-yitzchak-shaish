export const cardBase = {
  p: "clamp(0.8rem, 1.5vw, 1.6rem)",
  borderRadius: "0.8rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "translateY(-0.2rem)",
    boxShadow: 6,
  },
};

export const truncateText = {
  maxWidth: "clamp(8rem, 12vw, 14rem)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export const iconBox = (color: string) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "clamp(2.5rem, 3.5vw, 3.5rem)",
  height: "clamp(2.5rem, 3.5vw, 3.5rem)",
  borderRadius: "0.6rem",
  bgcolor: `${color}.main`,
  color: `${color}.contrastText`,
  flexShrink: 0,
});

export const topIconButton = {
  color: "inherit",
  "&:hover": { opacity: 0.8 },
};

export const sidebarItemButton = (theme: any) => ({
  textAlign: "center",
  borderRadius: "0.8rem",
  mx: "0.3rem",
  my: "0.4rem",
  transition: "0.2s",
  "&:hover": { backgroundColor: theme.palette.action.hover },
});

export const headerText = {
  fontWeight: 600,
  textAlign: "center",
  fontSize: "clamp(2rem, 1.3vw, 3rem)",
};

export const subtitleText = {
  color: "text.secondary",
  textAlign: "center",
  fontSize: "clamp(0.8rem, 1vw, 1.2rem)",
};
