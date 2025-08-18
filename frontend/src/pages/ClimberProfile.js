import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Box, Card, Divider } from '@mui/material';
import {
  Add as AddIcon,
  Terrain as MountainIcon
} from '@mui/icons-material';

import ClimbingKPIChart from '../components/ClimbingDashboard/ClimbingDashboard';
import ClimbingLog from '../components/ClimbingLog/ClimbingLog';
import Button from '../components/Button';


const Scores = () => {
  const { climberId } = useParams();
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
    <Box my={5}>
      {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box>
            <Typography variant="h2">Climber Profile</Typography>
            <Typography variant="body1" color="text.secondary">
              Hello {currentClimber.name}, your stats await you.
            </Typography>
          </Box>
          <Button icon={AddIcon} label="Add Climb" path={`/self-scoring/${climberId}`} />
        </Box>
      
      {error && <div className="error">{error}</div>}

      {/* Move Divider to center the gap */}
      <Divider sx={{ my: 2 }} />

      {/* Dashboard */}
      <Box className="card" >
        <Typography my={2} variant='h3'>Climbing Dashboard - Last 30 Days</Typography>
        <ClimbingKPIChart climberID={climberId} />
      </Box>

      {/* Logs */}
      <Box className='card'>
        <Box 
          sx={{
            my: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant='h3'>Climbing Log</Typography>
          <Button icon={AddIcon} label='Add Climb' path={`/self-scoring/${climberId}`} />
        </Box>
        {scores.length > 0 ? (
          <ClimbingLog scores={scores} onDelete={handleDelete}/>
        ) : (
          <Card sx={{ p: 6, textAlign: 'center' }}>
            <MountainIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No climbs logged yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start tracking your climbing progress by adding your first climb.
            </Typography>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default Scores;
