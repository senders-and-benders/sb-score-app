import React, { useState } from "react";
import axios from 'axios';
import {
  Dialog, 
  DialogContent, 
  DialogTitle, 
  TextField, 
  Box, 
  Stack 
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import Button from './Button';

export default function AddClimberDialog({ onAddClimber }) {
  const [open, setOpen] = useState(false);
  const [newClimber, setNewClimber] = useState({ 
    name: '', 
    email: '', 
    nickname: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newClimber.name.trim() && newClimber.email.trim()) {
      setLoading(true);
      setError(null);
      
      try {
        await axios.post('/api/climbers', {
          name: newClimber.name.trim(),
          email: newClimber.email.trim(),
          nickname: newClimber.nickname.trim() || null
        });
        
        // Reset the form
        setNewClimber({ name: '', email: '', nickname: '' });
        setOpen(false);
        
        // Call the parent callback if provided
        if (onAddClimber) {
          onAddClimber();
        }
      } catch (err) {
        setError('Failed to add climber');
        console.error('Error adding climber:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setNewClimber({ name: '', email: '', nickname: '' });
    setError(null);
  };

  return (
    <>
      <Button 
        icon={AddIcon}
        label="Add Climber"
        onClick={() => setOpen(true)}
      />
      
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        disableEnforceFocus={false}  // Ensure this is false (default)
        disableAutoFocus={false}     // Ensure this is false (default)
        keepMounted={false}          // Don't keep in DOM when closed
      >
        <DialogTitle>Add New Climber</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Stack spacing={3}>
              {error && (
                <Box sx={{ color: 'error.main', textAlign: 'center' }}>
                  {error}
                </Box>
              )}
              
              <TextField
                fullWidth
                label="Name"
                value={newClimber.name}
                onChange={(e) => setNewClimber({...newClimber, name: e.target.value})}
                placeholder="Enter climber's name"
                required
                variant="outlined"
                disabled={loading}
              />
              
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newClimber.email}
                onChange={(e) => setNewClimber({...newClimber, email: e.target.value})}
                placeholder="Enter climber's email"
                required
                variant="outlined"
                disabled={loading}
              />
              
              <TextField
                fullWidth
                label="Nickname (optional)"
                value={newClimber.nickname}
                onChange={(e) => setNewClimber({...newClimber, nickname: e.target.value})}
                placeholder="Enter nickname"
                variant="outlined"
                disabled={loading}
              />
              
              <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                <Button 
                  label={loading ? "Adding..." : "Add Climber"}
                  onClick={handleSubmit}
                  sx={{ width: 'auto', backgroundColor: 'primary.main' }}
                  disabled={loading}
                />
                <Button 
                  label="Cancel"
                  onClick={handleClose}
                  sx={{ width: 'auto', backgroundColor: 'primary.secondary' }}
                  disabled={loading}
                />
              </Stack>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
