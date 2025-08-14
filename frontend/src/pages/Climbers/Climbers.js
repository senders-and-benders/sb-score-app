import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Box, TextField, Typography, Divider, Button } from '@mui/material';
import './Climbers.css'; 
import ClimberProfileCard from '../../components/ClimberProfileCard/ClimberProfileCard'; 


const Climbers = () => {
  const [climbers, setClimbers] = useState([]);
  const [newClimber, setNewClimber] = useState({ name: '', email: '', nickname: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchClimbers = useCallback(async () => {
    try {
      const response = await axios.get('/api/climbers');
      setClimbers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load climbers');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClimbers();
  }, [fetchClimbers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/climbers', newClimber);
      setNewClimber({ name: '', email: '' , nickname: '' });
      fetchClimbers();
    } catch (err) {
      setError('Failed to add climber');
    }
  };

  if (loading) return <div className="loading">Loading climbers...</div>;

  return (
    <Box py={2}>
      <Typography variant='h2'>Climbers</Typography>

      <Divider sx={{ p: 2 } } variant='middle'/>
      {error && <div className="error">{error}</div>}
      
      <Box className="card">
        <Typography variant="h3">Add New Climber</Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2, py: 2 }}>
              <TextField
                required
                id="climber-name"
              label="Name"
              value={newClimber.name}
              onChange={(e) => setNewClimber({...newClimber, name: e.target.value})}
              fullWidth
              />
              <TextField
                required
                id="climber-email"
                label="Email"
                type="email"
                value={newClimber.email}
                onChange={(e) => setNewClimber({...newClimber, email: e.target.value})}
                fullWidth
              />
              <TextField
                id="climber-nickname"
                label="Nickname (optional)"
                value={newClimber.nickname}
                onChange={(e) => setNewClimber({...newClimber, nickname: e.target.value})}
                fullWidth
              />
              <Button variant="outlined" type="submit" className="btn">Add Climber</Button>
          </Box>
        </form>
      </Box>

      <Divider sx={{ p: 2 } } variant='middle'/>

      <Box className='card'>
        <Typography variant='h3'>Climber List</Typography>
        <Typography variant='subtitle1'><i>Talk to admin to delete you as a climber.</i></Typography>

        <div className="climber-list">
          {climbers.map(climber => (
            <ClimberProfileCard key={climber.id} climber={climber} />
          ))}
        </div>
      </Box>
      
      {climbers.length === 0 && (
        <div className="card">
          <p><i>No climbers found. Add some climbers to get started!</i></p>
        </div>
      )}
    </Box>
  );
};

    export default Climbers;