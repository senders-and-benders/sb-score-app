import React, { useState, useEffect, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material'
import { getClimberStatsLast30DaysMetrics, getAvgGradeLast60Days, getClimberStatsLast30DaysDailySummary, getClimberStatsLast30DaysData } from '../../services/APIService';
import { ClimbingKPI, ClimbingKPIText } from './ClimbingKPI';
import { GroupedBarChart } from './ClimbingBar';
import { ClimbingGradeGauge } from './ClimbingGradeGauge'

const ClimbingDashboard = ({ climberID, refreshTrigger }) => {
  const [climbingKPIData, setClimbingKPIData] = useState({
    totalClimbs: 0,
    totalPoints: 0
  });
  const [avgGradeData, setAvgGradeData] = useState({});
  const [latestGreatestClimb, setLatestGreatestClimb] = useState({});
  const [climbingDailyData, setClimbingDailyData] = useState([]);
  const [climbingBarData, setClimbingBarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchScoresData = useCallback(async () => {
    setLoading(true);
    try {
      const metrics_response = await getClimberStatsLast30DaysMetrics(climberID);
      setClimbingKPIData(metrics_response);
      const latestAndGreatestClimb = metrics_response.latestAndGreatestClimb;
      setLatestGreatestClimb({
        gym: latestAndGreatestClimb.gym_name,
        gymArea: latestAndGreatestClimb.gym_area_name,
        wall: latestAndGreatestClimb.wall_name,
        grade: latestAndGreatestClimb.grade,
        attempts: latestAndGreatestClimb.attempts,
        dateRecorded: new Date(latestAndGreatestClimb.date_recorded).toISOString().slice(0, 10)
      });
      const avgGradeDataArr = await getAvgGradeLast60Days(climberID);
      setAvgGradeData({
        all: avgGradeDataArr.find(climb => climb.climb_type === 'All'),
        bouldering: avgGradeDataArr.find(climb => climb.climb_type === 'Bouldering'),
        ropes: avgGradeDataArr.find(climb => climb.climb_type === 'Ropes')
      });
      const day_response = await getClimberStatsLast30DaysDailySummary(climberID);
      setClimbingDailyData({
        date: day_response.map(item => new Date(item.date)),
        dailyTotalClimbs: day_response.map(item => item.total_climbs),
        dailyTotalPoints: day_response.map(item => item.total_score)
      });
      const data_response = await getClimberStatsLast30DaysData(climberID);
      setClimbingBarData({
        bouldering: data_response.filter(climb => climb.climb_type === 'Bouldering'),
        ropes: data_response.filter(climb => climb.climb_type === 'Ropes')
      });
      setError(null);
    } catch (err) {
      setError('Failed to load climbing data');
    } finally {
      setLoading(false);
    }
  }, [climberID]);

  useEffect(() => {
    fetchScoresData();
  }, [refreshTrigger, fetchScoresData]);

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
    <Box>
      <Typography variant="h4">Last 60 Average Grade</Typography>
      <Typography variant='caption' color='text.secondary' sx={{ mb: 2 }}>
        How it's calculated: Takes the top 10 climbs over the last 60 days and averages the score. The score is mapped back to a grade. 
        The remainder represents progress towards the next grade.
      </Typography>
      <Grid my={2} container spacing={3} justifyContent="center" alignItems="center">
        {avgGradeData.all && (
          <Grid size={{xs:12, sm:4}}>
            <ClimbingGradeGauge
              title="Average Grade - All"
              grade={avgGradeData.all.avg_grade}
              value={avgGradeData.all.perc_to_next_grade * 100} // Gauge max value is 100
            />
          </Grid>
        )}
        {avgGradeData.bouldering && (
          <Grid size={{xs:6, sm:4}}>
            <ClimbingGradeGauge
              title="Average Grade - Bouldering"
              grade={avgGradeData.bouldering.avg_grade}
              value={avgGradeData.bouldering.perc_to_next_grade * 100} // Gauge max value is 100
            />
          </Grid>
        )}
        {avgGradeData.ropes && (
          <Grid size={{xs:6, sm:4}}>
            <ClimbingGradeGauge
              title="Average Grade - Ropes"
              grade={avgGradeData.ropes.avg_grade}
              value={avgGradeData.ropes.perc_to_next_grade * 100} // Gauge max value is 100
            />
          </Grid>
        )}
      </Grid>
      {/* Last 30 Days */}
      <Typography my={2} variant="h4">Last 30 days statistics</Typography>
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid size={{xs:12, sm:6}}>
          <ClimbingKPI
            title="# Climbs"
            value={climbingKPIData.totalClimbs}
            sparklineDataY={climbingDailyData.dailyTotalClimbs}
            sparklineDataX={climbingDailyData.date}
          />
        </Grid>
        <Grid size={{xs:12, sm:6}}>
          <ClimbingKPI
            title="# Points"
            value={climbingKPIData.totalPoints}
            sparklineDataY={climbingDailyData.dailyTotalPoints}
            sparklineDataX={climbingDailyData.date}
          />
        </Grid>
        <Grid size={{xs:12, sm:12}}>
          <ClimbingKPIText title="Latest and Greatest Send">
            Your greatest send was on <strong>{latestGreatestClimb.dateRecorded}</strong> and it was a <strong>{latestGreatestClimb.grade}</strong> at <strong>{latestGreatestClimb.gym} ({latestGreatestClimb.wall})</strong>.
            It took you <strong>{latestGreatestClimb.attempts}</strong> attempts.
          </ClimbingKPIText>
        </Grid>
        <Grid size={{xs:12, sm:6}}>
          <GroupedBarChart climbs={climbingBarData.bouldering} title="# Climbs by Colour - Bouldering" />
        </Grid>
        <Grid size={{xs:12, sm:6}}>
          <GroupedBarChart climbs={climbingBarData.ropes} title="# Climbs by Colour - Ropes" />
        </Grid>
      </Grid>
    </Box>
  );
  };

export default ClimbingDashboard;
