
export const cardBase = {
  p: 2,
  borderRadius: 3,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: 6,
  },
};

export const truncateText = {
  maxWidth: 150,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export const iconBox = (color: string) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 56,
  height: 56,
  borderRadius: 2,
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
  borderRadius: "12px",
  mx: 0.2,
  my: 0.4,
  transition: "0.2s",
  "&:hover": { backgroundColor: theme.palette.action.hover },
});

export const headerText = {
  fontWeight: 600,
  textAlign: "center",
};

export const subtitleText = {
  color: "text.secondary",
  textAlign: "center",
};
