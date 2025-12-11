import { useEffect, useState } from "react";
import { Box, Grid, LinearProgress, Typography } from "@mui/material";

import DashboardIcon from '@mui/icons-material/Dashboard';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

import StatCard from "../components/common/StatCard";
import { getOverviewStats } from "../api/overview.api";
import BackHandIcon from '@mui/icons-material/BackHand';
import { useUser } from "../hooks/useUser";
import { headerText } from "../styles/common";

export default function HomePage() {
  const { user } = useUser();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const result = await getOverviewStats();
        console.log(result);
        if (result.success) setStats(result.data);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        console.log(stats)
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Box sx={{ width: '100%' }}>
    <LinearProgress />
  </Box>;
  return (
    <Box sx={{ direction: 'rtl', display: 'flex', flexDirection: 'column', alignItems: 'center', width: "100%" }}>
      <Typography variant="h6" sx={{ ...headerText, mb: 10 }}>
        {user ? `${user.fullName.split(" ")[0]} היקר/ה! ברוך הבא למערכת!` : "משתמש יקר, ברוך הבא למערכת!"}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>

        <StatCard
          icon={<DashboardIcon />}
          color="primary"
          label="סך כל האירועים"
          value={stats?.totalEvents || 0}
        />

        <StatCard
          icon={<EventAvailableIcon />}
          color="success"
          label="אירועים שהושלמו היום"
          value={stats?.completedToday || 0}
        />

        <StatCard
          icon={<BackHandIcon />}
          color="warning"
          label="אירועים פתוחים"
          value={stats?.openEvents || 0}
        />
        <StatCard
          icon={<ReportProblemIcon />}
          color="error"
          label="אירועים קריטיים פתוחים"
          value={stats?.highPriorityEvents || 0}
        />
      </Grid>
    </Box>
  );
}