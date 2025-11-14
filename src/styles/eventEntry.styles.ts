export const outerBoxSx = {
    width: '100%',
    p: { xs: 1.5, sm: 2 },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    minHeight: { xs: 'calc(100vh - 10rem)', sm: 'calc(100vh - 9rem)', md: 'calc(100vh - 8rem)' },
    maxHeight: { xs: 'calc(100vh - 10rem)', sm: 'calc(100vh - 9rem)', md: 'calc(100vh - 8rem)' },
    background: 'linear-gradient(135deg, #e4edf3 0%, #d9e6ee 100%)',
    borderRadius: 2,
    boxShadow: 2,
    overflow: 'hidden',
};

export const innerBoxSx = {
    mt: { xs: 2, sm: 3 },
    background: 'linear-gradient(135deg, #d9e4ec 0%, #c9d8e3 100%)',
    borderRadius: 2,
    p: { xs: 2, sm: 4 },
    boxShadow: 1,
    flex: '1 1 auto',
    overflowY: 'auto',
    minHeight: 0,
};
