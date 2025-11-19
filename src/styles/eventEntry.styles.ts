import type { SxProps, Theme } from "@mui/material/styles";

export const outerBoxSx = (theme: Theme): SxProps<Theme> => ({
    width: '100%',
    height: 'calc(100vh - 128px)',
    p: 2,
    my: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: theme.palette.background.reportFormOuter!,
    borderRadius: 2,
    boxShadow: 2,
    overflow: 'hidden',
});

export const innerBoxSx = (theme: Theme): SxProps<Theme> => ({
    mt: 1,
    background: theme.palette.background.reportFormInner!,
    borderRadius: 2,
    p: 2,
    boxShadow: 1,
    flex: '1 1 auto',
    overflowY: 'auto',
    minHeight: 0,
});
