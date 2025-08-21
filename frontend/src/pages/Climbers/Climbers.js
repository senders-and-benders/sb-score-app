import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate  } from 'react-router-dom';
import { getClimbers } from '../../services/APIService';

// MUI components
import { Box, Typography } from '@mui/material';

// Components
import ClimberProfileGrid from '../../components/ClimberCardGrid/ClimberProfileGrid'; 
import AddClimberForm from '../../components/AddClimberForm';

// CSS
import './Climbers.css'; 


const Climbers = () => {
  const [climbers, setClimbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchClimbers = useCallback(async () => {
    try {
  const climbersData = await getClimbers();
  setClimbers(climbersData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load climbers');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClimbers();
  }, [fetchClimbers]);

  if (loading) return <div className="loading">Loading climbers...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <Box my={5}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box>
          <Typography variant='h2'>Climbers</Typography>
          <Typography variant="body1" color="text.secondary">
            Choose a climber to see their profile
          </Typography>
        </Box>
        <AddClimberForm onAddClimber={fetchClimbers} />
      </Box>
            
      <Box className='card' sx={{ my: 5}}>
        <Typography variant='caption' color='text.secondary'><i>To delete or update your profile, talk to admin.</i></Typography>

        <Box className="climber-list">
            <ClimberProfileGrid 
              climbers={climbers} 
              loading={loading} 
              onClimberClick={(id) => navigate(`/climber-profile/${id}`)}
            />
        </Box>
      </Box>
      
      {climbers.length === 0 && (
        <Box className="card">
          <p><i>No climbers found. Add some climbers to get started!</i></p>
        </Box>
      )}
    </Box>
  );
};

    export default Climbers;