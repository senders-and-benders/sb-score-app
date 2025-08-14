import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, Box, Chip, Stack, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import ClimbingKPIChart from '../components/ClimbingDashboard/ClimbingDashboard';
import ClimbingLog from '../components/ClimbingLog/ClimbingLog';


const Scores = () => {
  const { climberId } = useParams();
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [currentClimber, setCurrentClimber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data
  const fetchClimberScores = useCallback(async () => {
    try {
      const response = await axios.get(`/api/scores/climber/${climberId}`);
      setCurrentClimber(response.data.climber);
      setScores(response.data.scores);
      console.log('Fetched scores:', response.data.scores);
      setLoading(false);
    } catch (err) {
      setError('Failed to load climber scores');
      setLoading(false);
    }
  }, [climberId]);

  useEffect(() => {
    fetchClimberScores();
  }, [climberId]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this score?')) {
      try {
        await axios.delete(`/api/scores/${id}`);
        fetchClimberScores();
      } catch (err) {
        setError('Failed to delete score');
      }
    }
  };

  if (loading) return <div className="loading">Loading scores...</div>;

  return (
    <Box py={2}>
      <Typography variant="h2">Climber Profile</Typography>
      <Typography variant="subtitle">Hello {currentClimber.name} </Typography>

      <Stack direction="row" spacing={2} mb={2} sx={{ py: 2 }}>
        <Chip icon={<AddIcon />} label="Add New Score" onClick={() => window.location.href = `/self-scoring/${climberId}`} />
      </Stack>
      
      {error && <div className="error">{error}</div>}

      {/* Move Divider to center the gap */}
      <Divider sx={{ my: 2 }} />

      <div className="card">
        <Typography variant='h3'>Climbing KPI Chart - Last 30 Days</Typography>
        <ClimbingKPIChart climberID={climberId} />
      </div>
      
      <div className='card'>
        <h3>Climbing Log</h3>
        <ClimbingLog 
          scores={scores}
          showClimberName={false}
        />
      </div>

      {scores.length === 0 && (
        <div className="card">
          <p>
            {climberId && currentClimber 
              ? `No scores recorded yet for ${currentClimber.name}. Start climbing and recording your attempts!`
              : 'No scores recorded yet. Start climbing and recording your attempts!'
            }
          </p>
        </div>
      )}
    </Box>
  );
};

export default Scores;
