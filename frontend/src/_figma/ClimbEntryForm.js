import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  Box,
  Grid,
  Typography
} from '@mui/material';

export default function ClimbEntryForm({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    date: '',
    grade: '',
    attempts: 1,
    gym: '',
    area: '',
    wall: '',
    type: 'bouldering'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date,
        grade: initialData.grade,
        attempts: initialData.attempts,
        gym: initialData.gym,
        area: initialData.area,
        wall: initialData.wall,
        type: initialData.type
      });
    } else {
      // Reset form for new entry
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        date: today,
        grade: '',
        attempts: 1,
        gym: '',
        area: '',
        wall: '',
        type: 'bouldering'
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.grade) newErrors.grade = 'Grade is required';
    if (formData.attempts < 1) newErrors.attempts = 'Attempts must be at least 1';
    if (!formData.gym.trim()) newErrors.gym = 'Gym is required';
    if (!formData.area.trim()) newErrors.area = 'Area is required';
    if (!formData.wall.trim()) newErrors.wall = 'Wall is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (initialData) {
        onSave({ ...initialData, ...formData });
      } else {
        onSave(formData);
      }
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const boulderingGrades = ['VB', 'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17'];
  const ropeGrades = ['5.6', '5.7', '5.8', '5.9', '5.10a', '5.10b', '5.10c', '5.10d', '5.11a', '5.11b', '5.11c', '5.11d', '5.12a', '5.12b', '5.12c', '5.12d', '5.13a', '5.13b', '5.13c', '5.13d', '5.14a', '5.14b', '5.14c', '5.14d', '5.15a', '5.15b', '5.15c'];

  const availableGrades = formData.type === 'bouldering' ? boulderingGrades : ropeGrades;

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {initialData ? 'Edit Climb Entry' : 'Add New Climb'}
      </DialogTitle>
      
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => updateFormData('date', e.target.value)}
                error={!!errors.date}
                helperText={errors.date}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Attempts"
                type="number"
                inputProps={{ min: 1 }}
                value={formData.attempts}
                onChange={(e) => updateFormData('attempts', parseInt(e.target.value) || 1)}
                error={!!errors.attempts}
                helperText={errors.attempts}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Climb Type</FormLabel>
                <RadioGroup
                  row
                  value={formData.type}
                  onChange={(e) => updateFormData('type', e.target.value)}
                >
                  <FormControlLabel 
                    value="bouldering" 
                    control={<Radio />} 
                    label="Bouldering" 
                  />
                  <FormControlLabel 
                    value="ropes" 
                    control={<Radio />} 
                    label="Ropes" 
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.grade}>
                <InputLabel>Grade</InputLabel>
                <Select
                  value={formData.grade}
                  label="Grade"
                  onChange={(e) => updateFormData('grade', e.target.value)}
                >
                  {availableGrades.map((grade) => (
                    <MenuItem key={grade} value={grade}>
                      {grade}
                    </MenuItem>
                  ))}
                </Select>
                {errors.grade && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.grade}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Gym"
                value={formData.gym}
                onChange={(e) => updateFormData('gym', e.target.value)}
                placeholder="e.g., Central Rock Gym"
                error={!!errors.gym}
                helperText={errors.gym}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Area"
                value={formData.area}
                onChange={(e) => updateFormData('area', e.target.value)}
                placeholder="e.g., Main Cave"
                error={!!errors.area}
                helperText={errors.area}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Wall"
                value={formData.wall}
                onChange={(e) => updateFormData('wall', e.target.value)}
                placeholder="e.g., Overhang Wall"
                error={!!errors.wall}
                helperText={errors.wall}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
        >
          {initialData ? 'Update' : 'Add'} Climb
        </Button>
      </DialogActions>
    </Dialog>
  );
}
