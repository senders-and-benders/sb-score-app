import React, { useEffect, useState } from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography, Paper } from '@mui/material';


export const ClimbingKPIContainer = ({ children, title }) => (
  <Paper 
    elevation={3} 
    sx={{ 
      p: 2, 
      display: 'inline-block', 
      minWidth: 200, 
      width: '100%'
    }}
  >
    <Typography variant="subtitle2" color="text.secondary">
      {title}
    </Typography>
      {children}
  </Paper>
);

export const GroupedBarChart = ({ climbs, title }) => {
  const [groupedScores, setGroupedScores] = useState([]);

  useEffect(() => {
    const grouped = climbs.reduce((acc, climb) => {
      const grade = climb.grade;
      const score = climb.score || 0;

      if (!acc[grade]) {
        acc[grade] = { grade, totalScore: 0, count: 0 };
      }

      acc[grade].totalScore += score;
      acc[grade].count += 1;
      return acc;
    }, {});

    // Convert nested grouped object to a flat array
    const flatGrouped = Object.values(grouped).map(item => ({
      grade: item.grade,
      score: item.totalScore,
      count: item.count
    }));

    setGroupedScores(flatGrouped);
    console.log("Grouped Scores:", flatGrouped);
  }, []);

  return (
  <ClimbingKPIContainer title={title}>
    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2, minHeight: 100}}>
      <BarChart
        dataset={groupedScores}
        xAxis={[{ dataKey: 'grade' }]}
        series={[
          { dataKey: 'count', label: 'Climbs'}
        ]}
        yAxis={[{ label: 'Score' }]}
        height={400}
        hideLegend={true}
      />
    </Box>
  </ClimbingKPIContainer>
  )
}
