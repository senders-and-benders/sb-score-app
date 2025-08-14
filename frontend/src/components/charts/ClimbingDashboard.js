import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material'
import axios from 'axios';
import { ClimbingKPI, ClimbingKPIText } from './ClimbingKPI';
import { GroupedBarChart } from './ClimbingBar';

const ClimbingKPIChart = ({ climberID }) => {
  const [climbingKPIData, setClimbingKPIData] = useState({
    totalClimbs: 0,
    totalPoints: 0
  });
  const [latestGreatestClimb, setLatestGreatestClimb] = useState({});
  const [climbingDailyData, setClimbingDailyData] = useState([]);
  const [climbingBarData, setClimbingBarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchScoresData();
  }, []);

  const fetchScoresData = async () => {
    try {
      setLoading(true);

      // Metrics
      const metrics_response = await axios.get(`/api/stats/climber/${climberID}/last_30_days_metrics`);
      setClimbingKPIData(metrics_response.data);

      // Latest and greatest climb
      const latestAndGreatestClimb = metrics_response.data.latestAndGreatestClimb;
      setLatestGreatestClimb({
        gym: latestAndGreatestClimb.gym_name,
        gymArea: latestAndGreatestClimb.gym_area_name,
        wall: latestAndGreatestClimb.wall_name,
        grade: latestAndGreatestClimb.grade,
        attempts: latestAndGreatestClimb.attempts,
        dateRecorded: new Date(latestAndGreatestClimb.date_recorded).toISOString().slice(0, 10)
      });

      // Spark Lines
      const day_response = await axios.get(`/api/stats/climber/${climberID}/last_30_days_daily_summary`);
      setClimbingDailyData({ 
        // x-axis: dates as Date objects
        date: day_response.data.map(item => new Date(item.date)),
        dailyTotalClimbs: day_response.data.map(item => item.total_climbs),
        dailyTotalPoints: day_response.data.map(item => item.total_score)
      });

      //Bar Charts
      const data_response = await axios.get(`/api/stats/climber/${climberID}/last_30_days_data`);
      const boulderingData = data_response.data.filter(climb => climb.climb_type === 'Bouldering');
      const RopesData = data_response.data.filter(climb => climb.climb_type === 'Ropes');
      setClimbingBarData({
        bouldering: boulderingData,
        ropes: RopesData
      });

      setLoading(false);
    } catch (err) {
      console.error('Error fetching scores:', err);
      setError('Failed to load climbing data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid size={{xs: 6, sm: 4}}>
          <ClimbingKPI 
            title="# Climbs" 
            value={climbingKPIData.totalClimbs} 
            sparklineDataY={climbingDailyData.dailyTotalClimbs}
            sparklineDataX={climbingDailyData.date}
          />
        </Grid>
        <Grid size={{xs: 6, sm: 4}}>
          <ClimbingKPI 
            title="# Points" 
            value={climbingKPIData.totalPoints} 
            sparklineDataY={climbingDailyData.dailyTotalPoints}
            sparklineDataX={climbingDailyData.date}
          />
        </Grid>
        <Grid size={{xs: 12, sm: 4}}>
          <ClimbingKPIText title="Latest and Greatest Send">
            Your greatest send was on <strong>{latestGreatestClimb.dateRecorded}</strong> and it was a <strong>{latestGreatestClimb.grade}</strong> at <strong>{latestGreatestClimb.gym} ({latestGreatestClimb.wall})</strong>.
            It took you <strong>{latestGreatestClimb.attempts}</strong> attempts.
          </ClimbingKPIText>
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <GroupedBarChart climbs={climbingBarData.bouldering} title={"# Climbs by Colour - Bouldering"} />
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
          <GroupedBarChart climbs={climbingBarData.ropes} title={"# Climbs by Colour - Ropes"} />
        </Grid>
      </Grid>
    </div>
    )
  };

export default ClimbingKPIChart;
