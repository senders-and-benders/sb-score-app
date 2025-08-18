import { Gauge } from '@mui/x-charts';
import { Typography, Paper } from '@mui/material';
import { GRADE_COLOUR_MAPPING } from '../../context/GradeColourMap';

const ClimbingKPIContainer = ({ children, title }) => (
  <Paper 
    elevation={1} 
    sx={{ 
      display: 'inline-block', 
      minWidth: 150, 
      minHeight: 150,
      width: '100%'
    }}
  >
    <Typography variant="subtitle2" color="text.secondary">
      {title}
    </Typography>
      {children}
  </Paper>
);

const getColorForGrade = (grade) => {
  const gradeName = grade.split('/')[0].trim();
  const matchedKey = Object.keys(GRADE_COLOUR_MAPPING).find(key => key.toLowerCase() === gradeName.toLowerCase());
  return matchedKey ? GRADE_COLOUR_MAPPING[matchedKey] : '#000000ff';
};

export const ClimbingGradeGauge = ({ title, grade, value}) => (
  <ClimbingKPIContainer title={title}>
    <Gauge
      value={value}
      startAngle={0}
      valueMax={100}
      sx={{
        '& .MuiGauge-valueText': {
          transform: 'translate(0px, 0px)',
          fontSize: '12px',
        },
        '& .MuiGauge-valueArc': {
          fill: getColorForGrade(grade),
        }
      }}
      text={grade}
    />
  </ClimbingKPIContainer>
);