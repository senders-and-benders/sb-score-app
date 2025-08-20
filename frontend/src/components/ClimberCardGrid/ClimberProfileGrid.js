import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import ClimberProfileCard from './ClimberProfileCard';

const ClimberProfileGrid = ({
  climbers,
  onClimberClick,
  error=null,
  loading=true
}) => {
  // Set things
  if (loading) return <CircularProgress sx={{ m: 4 }} />;
  if (error) return <div>{error}</div>;


  // Return the grid
  return (
    <Grid container spacing={2} justifyContent="center">
      {climbers.map(climber => (
        <Grid item key={climber.id}>
          <ClimberProfileCard 
            key={climber.id} 
            climber={climber} 
            onClick={() => onClimberClick(climber.id)} 
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ClimberProfileGrid;