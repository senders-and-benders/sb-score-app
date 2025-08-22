import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

// Services
import { getClimbers } from '../../services/APIService';

// Components
import ClimberProfileGrid from '../../components/ClimberCardGrid/ClimberProfileGrid';
import AddClimberForm from '../../components/AddClimberForm';

const ClimberSelection = () => {
  const [climbers, setClimbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchClimbers = async () => {
    try {
      const climbersData = await getClimbers();
      setClimbers(climbersData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load climbers');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClimbers();
  }, []);

  const handleClimberSelect = (selectedClimberId) => {
    const climber = climbers.find(c => c.id === parseInt(selectedClimberId));
    if (climber) {
      navigate(`/self-scoring/${climber.id}`);
    }
  };

  if (loading) return <div className="loading">Loading climbers...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <Box sx={{ my: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Box>
          <Typography variant="h2">Self Scoring - Select Climber</Typography>
          <Typography variant="body1" color="text.secondary">
            Choose a climber to start scoring.
          </Typography>
        </Box>
        <AddClimberForm onAddClimber={fetchClimbers} />
      </Box>

      {error && <div className="error">{error}</div>}

      <Box className="card" sx={{ my: 5 }}>
        <ClimberProfileGrid 
          climbers={climbers} 
          onClimberClick={handleClimberSelect}
          loading={loading} 
        />
      </Box>

      {climbers.length === 0 && (
        <Box className="card">
          <Typography>No climbers found. Please add climbers first!</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ClimberSelection;
