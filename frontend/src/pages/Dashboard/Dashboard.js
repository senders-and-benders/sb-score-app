import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Chip, Stack, Grid, Paper } from '@mui/material';
import Divider from '@mui/material/Divider';

// Icons
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TerrainIcon from '@mui/icons-material/Terrain';
import PersonIcon from '@mui/icons-material/Person';

import RecentActivityFeed from '../../components/RecentActivityFeed';


const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClimbers: 0,
    totalWalls: 0,
    totalAscents: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats');
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard stats');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  const KpiCard = ({ title, value, icon }) => (
    <Grid item xs={12} sm={4}>
      <Paper elevation={1} sx={{ p: 4, textAlign: 'center', height: '100%', minWidth: '150px'}}>
        {icon}
        <Typography variant="h3">{value}</Typography>
        <Typography variant="body1"><i>{title}</i></Typography>
      </Paper>
    </Grid>
  );

  return (
    <Box py={2}>
      <Typography variant='h2'>Dashboard</Typography>
      <Stack direction="row" spacing={2} mb={2} sx={{ py: 2 }}>
        <Chip icon={<AddIcon />} label="Add New Score" onClick={() => window.location.href = '/self-scoring'} />
        <Chip icon={<PersonAddIcon />} label="Add New Climber" onClick={() => window.location.href = '/climbers'} />
      </Stack>

      <Stack gap={2}>
        <Box>
          <Grid container spacing={2} mb={2} justifyContent="center" alignItems="center" width="100%">
            <KpiCard title="Total Climbers" value={stats.totalClimbers} icon={<PersonIcon sx={{ fontSize: 64 }} />} />
            <KpiCard title="Total Walls" value={stats.totalWalls} icon={<TerrainIcon sx={{ fontSize: 64 }} />} />
            <KpiCard title="Total Ascents" value={stats.totalAscents} icon={<TerrainIcon sx={{ fontSize: 64 }} />} />
          </Grid>
        </Box>

        <Divider />

        <Box>
          <Typography variant='h3'>🏆 Recent Activity</Typography>
          <RecentActivityFeed maxItems={10} />
        </Box>
      </Stack>
    
    </Box>
  );
};

export default Dashboard;
