import React, { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

// Custom hooks
import { useScoring } from '../../hooks/useScoring';

// Components
import { ClimberHeaderCard } from '../../components/ClimberCardGrid/ClimberCards';
import SelectionGrid from '../../components/ScoreSelection/SelectionGrid';
import Button from '../../components/Button';
import ClimbingLog from '../../components/ClimbingLog/ClimbingLog';

//Icons
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const ScoringForm = () => {
  const { climberId } = useParams();
  const navigate = useNavigate();
  
  const {
    state,
    updateSelections,
    updateScoreDetails,
    fetchInitialData,
    fetchClimberScores,
    handleSelection,
    submitScore,
    deleteScoreById,
    resetForm
  } = useScoring(climberId);

  // Memoized helper functions
  const selectedItems = useMemo(() => ({
    gym: state.data.gyms.find(g => g.id === parseInt(state.selections.gym_id)),
    area: state.data.gymAreas.find(a => a.id === parseInt(state.selections.gym_area_id)),
    rope: state.data.ropeNumbers.find(r => r.id === parseInt(state.selections.wall_id))
  }), [state.data.gyms, state.data.gymAreas, state.data.ropeNumbers, state.selections]);

  // Selection configuration
  const selectionConfig = useMemo(() => [
    {
      key: 'gym',
      title: 'Select a Gym:',
      items: state.data.gyms,
      selectedValue: state.selections.gym_id,
      keyField: 'id',
      displayField: 'name',
      colorScheme: 'blue',
      condition: true
    },
    {
      key: 'area',
      title: `Select an Area in ${selectedItems.gym?.name || ''}:`,
      items: state.data.gymAreas,
      selectedValue: state.selections.gym_area_id,
      keyField: 'id',
      displayField: 'name',
      colorScheme: 'green',
      condition: state.selections.gym_id
    },
    {
      key: 'wall',
      title: `Select a Wall in ${selectedItems.area?.name || ''}:`,
      items: state.data.wallAreas,
      selectedValue: state.selections.wall_area_name,
      keyField: 'wall_name',
      displayField: state.climbType === 'Ropes' ? 'rope_wall_name' : 'wall_name',
      colorScheme: 'orange',
      condition: state.selections.gym_area_id
    },
    {
      key: 'rope',
      title: `Select Route Number on ${state.selections.wall_area_name}:`,
      items: state.data.ropeNumbers,
      selectedValue: state.selections.wall_id,
      keyField: 'id',
      displayField: 'wall_number',
      colorScheme: 'blue',
      minWidth: '80px',
      condition: state.climbType === 'Ropes' && state.selections.wall_area_name && state.data.ropeNumbers.length > 0
    },
    {
      key: 'grade',
      title: `Select Grade for ${state.selections.wall_area_name}:`,
      items: state.data.grades,
      selectedValue: state.selections.grade,
      keyField: 'grade',
      displayField: 'grade',
      colorScheme: 'purple',
      minWidth: '100px',
      condition: state.selections.wall_id
    }
  ], [state, selectedItems]);

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    const scoreData = {
      climber_id: parseInt(climberId),
      gym_id: parseInt(state.selections.gym_id),
      gym_area_id: parseInt(state.selections.gym_area_id),
      wall_id: parseInt(state.selections.wall_id),
      grade: state.selections.grade,
      completed: state.scoreDetails.completed,
      attempts: state.scoreDetails.attempts,
      notes: state.scoreDetails.notes
    };
    
    const result = await submitScore(scoreData);
    if (result.success) {
      alert('Score submitted successfully!');
    } else {
      alert(result.error);
    }
  };

  const handleDeleteScore = async (scoreId) => {
    if (window.confirm('Are you sure you want to delete this score?')) {
      const result = await deleteScoreById(scoreId);
      if (result.success) {
        alert('Score deleted successfully!');
      } else {
        alert(result.error);
      }
    }
  };

  // Progress indicator text
  const getProgressText = () => {
    const parts = [];
    if (state.selections.gym_id && selectedItems.gym) parts.push(selectedItems.gym.name);
    if (state.selections.gym_area_id && selectedItems.area) parts.push(selectedItems.area.name);
    if (state.selections.wall_area_name) parts.push(state.selections.wall_area_name);
    if (state.climbType === 'Ropes' && state.selections.wall_id && selectedItems.rope) {
      parts.push(`#${selectedItems.rope.wall_number}`);
    }
    if (state.selections.grade) parts.push(state.selections.grade);
    return parts.join(' → ');
  };

  useEffect(() => {
    fetchInitialData().then((result) => {
      if (result && result.error === 'Climber not found') {
        navigate('/self-scoring');
      }
    });
  }, [fetchInitialData, navigate]);

  useEffect(() => {
    if (climberId) {
      fetchClimberScores();
    }
  }, [climberId, fetchClimberScores]);

  if (state.loading) return <div className="loading">Loading...</div>;
  if (state.error) return <div className="error">{state.error}</div>;

  return (
    <Box sx={{ my: 5 }}>
    <Box>
      <Typography variant="h2">Self Scoring</Typography>
      <Typography variant="body1" color="text.secondary">
        Hello, points await you.
      </Typography>
    </Box>
    
    {/* Header */}
    <Box py={2}>
      <Button icon={ArrowBackIcon} label="Select Climber" variant='text' path={`/self-scoring`} />
      <ClimberHeaderCard climber={state.currentClimber}/>
    </Box>

      {state.error && <div className="error">{state.error}</div>}

      {/* Progress indicator */}
      {getProgressText() && (
        <Box className="card" sx={{ backgroundColor: '#f0f8ff', mb: 2 }}>
          <Typography component="span" fontWeight="bold">Route: </Typography>
          <Typography component="span">{getProgressText()}</Typography>
        </Box>
      )}

      {/* Scoring Form */}
      <div className="card">
        <Typography variant="h3">Submit New Score</Typography>

        {/* Dynamic Selection Grids */}
        {selectionConfig.map((config) => 
          config.condition && (
            <SelectionGrid
              key={config.key}
              title={config.title}
              items={config.items}
              onSelect={(value) => handleSelection(config.key, value)}
              selectedValue={config.selectedValue}
              keyField={config.keyField}
              displayField={config.displayField}
              colorScheme={config.colorScheme}
              minWidth={config.minWidth}
            />
          )
        )}

        {/* Score Details Form */}
        {state.selections.grade && (
          <div style={{ marginTop: '2rem' }}>
            <form onSubmit={handleScoreSubmit}>
              <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                <Typography variant="body2">
                  <strong>Selected Route:</strong><br />
                  {getProgressText()}
                </Typography>
              </div>

              <div className="form-group">
                <Typography variant="body2" component="label">Number of Attempts:</Typography>
                <input
                  type="number"
                  min="1"
                  value={state.scoreDetails.attempts}
                  onChange={(e) => updateScoreDetails({ attempts: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="form-group">
                <Typography variant="body2" component="label">Notes:</Typography>
                <textarea
                  value={state.scoreDetails.notes}
                  onChange={(e) => updateScoreDetails({ notes: e.target.value })}
                  rows="3"
                  placeholder="Any notes about your climb..."
                />
              </div>

              <Button 
                type="submit" 
                className="btn" 
                style={{ backgroundColor: '#28a745', color: 'white' }}
                label='Submit Score'
              />
            </form>
          </div>
        )}

        {/* Reset button */}
        {Object.values(state.selections).some(value => value) && (
          <Button
            label='Start Over'
            onClick={resetForm}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          />
        )}
      </div>

      {/* Recent Scores */}
      <div className="card">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h3">Your Recent Scores</Typography>
          <Button
            label='View Profile'
            path={`/climber-profile/${climberId}`}
          />
        </Box>
        {state.data.scores.length > 0 ? (
          <ClimbingLog scores={state.data.scores.slice(0, 10)} onDelete={handleDeleteScore} />
        ) : (
          <p>No scores recorded yet. Submit your first climb above!</p>
        )}

        {state.data.scores.length > 3 && (
          <Button
            label={`View All Scores (${state.data.scores.length})`}
            path={`/climber-profile/${climberId}`}
          />
        )}
      </div>
    </Box>
  );
};

export default ScoringForm;
