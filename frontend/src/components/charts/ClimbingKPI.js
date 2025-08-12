import * as React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';


export const ClimbingKPIContainer = ({ children, title }) => (
  <Paper 
    elevation={3} 
    sx={{ 
      p: 2, 
      display: 'inline-block', 
      minWidth: 200, 
      width: '100%', 
      maxHeight: 200 
    }}
  >
    <Typography variant="subtitle2" color="text.secondary">
      {title}
    </Typography>
      {children}
  </Paper>
);

export const ClimbingKPI = ({ value, title, sparklineDataY=[], sparklineDataX=[] }) => (
  <ClimbingKPIContainer title={title}>
    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2, minHeight: 100}}>
      <Typography variant="h3" color="primary">
        {value}
      </Typography>
      <SparkLineChart 
        plotType="bar"
        xAxis={{
          scaleType: "band",
          data: sparklineDataX,
          valueFormatter: (value) => new Date(value).toLocaleDateString()
        }}
        data={sparklineDataY} 
        showHighlight={true}
        showTooltip={true}
        height={100}
      />
    </Box>
  </ClimbingKPIContainer>
);

export const ClimbingKPIText = ({ children, title }) => (
  <ClimbingKPIContainer title={title}>
    <Box sx={{ mt: 1, minHeight: "100px" }}>
      <Typography variant="subtitle1" color="text.secondary">
        {children}
      </Typography>
    </Box>
  </ClimbingKPIContainer>
);