import { Box, Grid, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import StatCard from '../components/common/StatCard';
import { headerText } from '../styles/common';


export default function HomePage() {
  return (
    <Box
      sx={{
        direction: 'rtl',
        bgcolor: 'background.default',
        color: 'text.primary',
        // border: '1px solid red',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'center',
        alignContent: 'center',
        minHeight: 'calc(100vh - 100px)',
        margin: 0
      }}
    >
      <Typography variant="h6" sx={{ ...headerText, mb: 6 }}>
        משתמש יקר, ברוך הבא למערכת!
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }} >
          <StatCard icon={<DashboardIcon />} color="primary" label="סך כל האירועים" value="103" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard icon={<TrendingUpIcon />} color="secondary" label="מגמת שינוי" value="+18%" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard icon={<EventAvailableIcon />} color="success" label="הושלמו היום" value="32" />
        </Grid>
      </Grid>
    </Box>
  );
}
