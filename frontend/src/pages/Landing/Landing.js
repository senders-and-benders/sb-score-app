import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Stack, Grid, Container } from '@mui/material';

// Icons
import TerrainIcon from '@mui/icons-material/Terrain';
import PersonIcon from '@mui/icons-material/Person';
import ShowChartIcon from '@mui/icons-material/ShowChart';

// Components
import Button from '../../components/Button';


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

  const KpiCard = ({ title, value, icon, description }) => (
    <Box 
      elevation={0.5} 
      sx={{ 
        p: 2, 
        textAlign: 'center', 
        height: '150px',
        minWidth: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Stack spacing={0.5} alignItems="center" width="100%">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: '#dfdfdfba',
            margin: '0 auto',
            mb: 2
          }}
        >
          {React.cloneElement(icon, { sx: { fontSize: 32 } })}
        </Box>
        <Typography variant="h3">{value}</Typography>
        <Typography variant="body2"><i>{title}</i></Typography>
        <Typography variant="caption"><i>{description ? <>{description}</> : ''}</i></Typography>
      </Stack>
    </Box>
  );

  return (
    // <Box display="flex" flexDirection="column" alignItems="center" width="100%">
    <Container>
      {/* Intro */}
      <Box py={10}>
        <Stack direction="column" spacing={2} mb={2} sx={{ py: 2 }} justifyContent="center" alignItems="center">
          <Typography align='center' variant='h1'>Score Your Climbs</Typography>
          <Typography align='center' variant="body1">Hello. Get started on scoring by adding your climbs</Typography>
          <Button colour="primary" icon={ShowChartIcon} label="Start Scoring" path="/self-scoring"/>
        </Stack>
      </Box>

      {/* Stats */}
      <Box>
        <Stack direction="column" spacing={2} mb={2} sx={{ py: 2 }} justifyContent="center" alignItems="center">
          <Typography align='center' variant='h2'><b>Senders and Benders Stats</b></Typography>
          <Typography align='center' variant='body1'>We are nerds and love some numbers</Typography>
          <Grid container spacing={2} mb={2} justifyContent="center" alignItems="center">
            <Grid size={{ xs: 12, sm: 6 }}>
              <KpiCard 
                title="Climbers" 
                value={stats.totalClimbers} 
                icon={<PersonIcon />} 
                description='Climbers who use the app'
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <KpiCard 
                title="Sends" 
                value={stats.totalAscents} 
                icon={<TerrainIcon />} 
                description='Climbs we sent' 
              />
            </Grid>
          </Grid>     
        </Stack>
      </Box> 
    </Container>
  );
};

export default Dashboard;
