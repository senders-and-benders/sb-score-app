import React, { useEffect, useState } from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography, Paper } from '@mui/material';
import { MIU_BAR_COLOUR_MAP, GRADE_ORDERING } from '../../context/GradeColourMap';

const ClimbingKPIContainer = ({ children, title }) => (
  <Paper 
    elevation={1} 
    sx={{ 
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
    }))
    .sort((a, b) => GRADE_ORDERING.indexOf(a.grade) - GRADE_ORDERING.indexOf(b.grade));

    setGroupedScores(flatGrouped);
  }, [climbs]);

  return (
  <ClimbingKPIContainer title={title}>
    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2, minHeight: 100}}>
      <BarChart
        dataset={groupedScores}
        xAxis={[{ 
          dataKey: 'grade',
          colorMap: MIU_BAR_COLOUR_MAP
        }]}
        series={[{ dataKey: 'count', label: 'grade' }]}
        yAxis={[{ label: 'Score' }]}
        height={400}
        hideLegend={true}
        slotProps={{
          bar: {
            style: {
              stroke: '#000000',        // Outline color (black)
              strokeWidth: 0.5,           // Outline thickness
              strokeOpacity: 1,       // Outline opacity
              strokeLinejoin: 'round',  // Rounded corners
              strokeLinecap: 'round'    // Rounded line endings
            }
          }
        }}
      />
    </Box>
  </ClimbingKPIContainer>
  )
}
