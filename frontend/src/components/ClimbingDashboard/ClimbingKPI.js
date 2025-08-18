import * as React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@mui/material/styles';

let theme = createTheme();
theme = responsiveFontSizes(theme);

export const ClimbingKPIContainer = ({ children, title }) => (
  <Paper 
    elevation={1} 
    sx={{ 
      p: 2, 
      width: '90%',
      maxheight: 200,
      display: 'flex',
      flexDirection: 'column'
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
    <Box sx={{ mt: 1, display: 'flex', flexDirection:'column', alignItems: 'center', gap: 2, flex: 1}}>
      <ThemeProvider theme={theme}>
        <Typography variant="h4" color="primary">
          {value}
        </Typography>
        <SparkLineChart 
          plotType="bar"
          xAxis={{
            scaleType: "band",
            data: sparklineDataX,
            valueFormatter: (value) => new Date(value).toLocaleDateString()
          }}
          yAxis={{
            min: 0 // Will never be negative
          }}
          data={sparklineDataY} 
          showHighlight={true}
          showTooltip={true}
          height={100}
          area
        />
      </ThemeProvider>
    </Box>
  </ClimbingKPIContainer>
);

export const ClimbingKPIText = ({ children, title }) => (
  <ClimbingKPIContainer title={title}>
    <Box sx={{ mt: 1, flex: 1, display: 'flex', alignItems: 'center' }}>
      <Typography variant="subtitle1" color="text.secondary">
        {children}
      </Typography>
    </Box>
  </ClimbingKPIContainer>
);