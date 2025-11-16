import type { SxProps, Theme } from "@mui/material/styles";

export const outerBoxSx = (theme: Theme): SxProps<Theme> => ({
    width: '100%',
    p: { xs: 1.5, sm: 2 },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    minHeight: { xs: 'calc(100vh - 10rem)', sm: 'calc(100vh - 9rem)', md: 'calc(100vh - 8rem)' },
    maxHeight: { xs: 'calc(100vh - 10rem)', sm: 'calc(100vh - 9rem)', md: 'calc(100vh - 8rem)' },
    background: theme.palette.background.reportFormOuter!,
    borderRadius: 2,
    boxShadow: 2,
    overflow: 'hidden',
});

export const innerBoxSx = (theme: Theme): SxProps<Theme> => ({
    mt: { xs: 2, sm: 3 },
    background: theme.palette.background.reportFormInner!,
    borderRadius: 2,
    p: { xs: 2, sm: 4 },
    boxShadow: 1,
    flex: '1 1 auto',
    overflowY: 'auto',
    minHeight: 0,
});
