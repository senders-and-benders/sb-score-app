import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import SelectionGrid from '../../components/SelectionGrid';
import ClimberProfileCard from '../../components/ClimberProfileCard';
import Button from '../../components/Button';
import ClimbingLog from '../../components/ClimbingLog/ClimbingLog';
import AddClimberForm from '../../components/AddClimberForm';

const SelfScoring = () => {
  const { climberId: urlClimberId } = useParams(); // Get climber ID from URL
  const [step, setStep] = useState(1); // 1: Select climber, 2: Select all options & submit
  // Climbers
  const [climberId, setClimberId] = useState(urlClimberId || '');
  const [currentClimber, setCurrentClimber] = useState(null);
  const [climbers, setClimbers] = useState([]);
  // Route
  const [gyms, setGyms] = useState([]);
  const [gymAreas, setGymAreas] = useState([]);
  const [wallAreas, setWallAreas] = useState([]);
  const [climbType, setClimbType] = useState('');
  const [walls, setWalls] = useState([]);
  const [ropeNumbers, setRopeNumbers] = useState([]);
  const [grades, setGrades] = useState([]);
  // Scores
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  //Error
  const [error, setError] = useState(null);
  // Submit form data
  const [selections, setSelections] = useState({
    gym_id: '',
    gym_area_id: '',
    wall_area_name: '',
    wall_id: '',
    grade: ''
  });
  const [scoreDetails, setScoreDetails] = useState({
    completed: true,
    attempts: 1,
    notes: ''
  });
  // Navigate
  const navigate = useNavigate();

  // Add use effects to update data
  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (climberId) {
      fetchClimberScores(climberId);
    }
  }, [climberId]);

  useEffect(() => {
    if (urlClimberId && climbers.length > 0) {
      const climber = climbers.find(c => c.id === parseInt(urlClimberId));
      if (climber) {
        setClimberId(urlClimberId);
        setCurrentClimber(climber);
        setStep(2);
      }
    }
  }, [urlClimberId, climbers]);

  // Fetching data
  const fetchInitialData = async () => {
    try {
      const [climbersRes, gymsRes] = await Promise.all([
        axios.get('/api/climbers'),
        axios.get('/api/gyms')
      ]);
      setClimbers(climbersRes.data);
      setGyms(gymsRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load data');
      setLoading(false);
    }
  };

  const fetchGymAreas = async (gymId) => {
    try {
      const response = await axios.get(`/api/gym/${gymId}/areas`);
      setGymAreas(response.data);
    } catch (err) {
      setError('Failed to load gym areas');
    }
  };

  const fetchWallAreasAndGrades = async (gymAreaId) => {
    try {
      // Walls
      if (gymAreaId) {
        const responseWalls = await axios.get(`/api/gym_area/${gymAreaId}/walls`);
        const dataWalls = responseWalls.data;
        
        // Get base data - This will be all walls irrespective of climb type in the area
        setWalls(dataWalls);
        
        // Set wall areas which again do some lazy set to handle both unique bouldering walls and duplicate rope wall names (many rope numbers to one wall name)
        const wallAreaNames = [ ... new Set(dataWalls.map(wall => wall.wall_name)) ];
        setWallAreas(wallAreaNames.map(name => ({ wall_name: name })));

        // Get the current area's climb type to alter the selection flow logic
        const selectedGymArea = gymAreas.find(area => area.id === parseInt(gymAreaId));
        const climbType = selectedGymArea.climb_type;
        setClimbType(climbType);

        // Finally get grades
        const responseGrades = await axios.get(`/api/gym_area/${gymAreaId}/grades`);
        setGrades(responseGrades.data);
      } else {
        setWallAreas([]);
        setClimbType('');
      }
    } catch (err) {
      setError('Failed to load walls and grades');
    }
  };

  const fetchGrades = async (gymAreaId) => {
    try {
      if (gymAreaId) {
        // Get grades
        const responseGrades = await axios.get(`/api/gym_area/${gymAreaId}/grades`);
        setGrades(responseGrades.data);
      } else {
        setGrades([]);
      }
    } catch (err) {
      setError('Failed to load grades');
    }
  };

  const fetchClimberScores = async (climberId) => {
    try {
      const response = await axios.get(`/api/scores/climber/${climberId}`);
      setScores(response.data.scores || []);
    } catch (err) {
      console.error('Failed to load climber scores', err);
    }
  };

  // Simplified selection handlers
  const handleClimberSelect = (selectedClimberId) => {
    setClimberId(selectedClimberId);
    const climber = climbers.find(c => c.id === parseInt(selectedClimberId));
    setCurrentClimber(climber);
    // Update URL with climber ID
    navigate(`/self-scoring/${climber.id}`);
    setStep(2);
  };

  const handleGymSelect = (gymId) => {
    setSelections(prev => ({ ...prev, gym_id: gymId, gym_area_id: '', wall_area_name: '', wall_id: '', grade: '' }));
    resetSelectionData(['gymAreas', 'wallsAreas', 'walls', 'ropeNumbers', 'grades']);
    if (gymId) fetchGymAreas(gymId);
  };

  const handleAreaSelect = (areaId) => {
    setSelections(prev => ({ ...prev, gym_area_id: areaId, wall_area_name: '', wall_id: '', grade: '' }));
    resetSelectionData(['wallsAreas', 'walls', 'ropeNumbers', 'grades']);
    setClimbType('');
    if (areaId) {
      fetchWallAreasAndGrades(areaId);
      fetchGrades(areaId);
    };
  };

  const handleWallSelect = (wallName) => {
    resetSelectionData(['ropeNumbers']);
    if (climbType === 'Ropes') {
      // For ropes there is a list of rope IDs that exist and an additional step is required so set ropes 
      const currentWall = walls.filter(wall => wall.wall_name === wallName);
      setRopeNumbers(currentWall);
      setSelections(prev => ({ ...prev, wall_area_name: wallName, wall_id: '', grade: '' }));
    } else {
      // For bouldering (not Ropes) there is always 1 wall id to 1 wall name, so set selection straight away
      const currentWall = walls.find(wall => wall.wall_name === wallName);
      console.log('current wall: ', currentWall);
      setSelections(prev => ({ ...prev, wall_area_name: wallName, wall_id: currentWall.id, grade: '' }));
    };
  };

  const handleRopeNumberSelect = (ropeId) => {
    setSelections(prev => ({ 
      ...prev, 
      wall_id: ropeId, // Store actual wall ID
      grade: '' 
    }));
  };

  const handleGradeSelect = (grade) => {
    console.log('Selected grade:', selections);
    setSelections(prev => ({ ...prev, grade: grade }));
  };

  // Helper function to reset multiple state arrays
  const resetSelectionData = (dataTypes) => {
    const resetMap = {
      gymAreas: () => setGymAreas([]),
      walls: () => setWalls([]),
      wallAreas: () => setWallAreas([]),
      ropeNumbers: () => setRopeNumbers([]),
      grades: () => setGrades([])
    };
    dataTypes.forEach(type => resetMap[type]?.());
  };  
  
  // Score submit
  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    try {
      const scoreData = {
        climber_id: parseInt(climberId),
        gym_id: parseInt(selections.gym_id),
        gym_area_id: parseInt(selections.gym_area_id),
        wall_id: parseInt(selections.wall_id),
        grade: selections.grade,
        completed: scoreDetails.completed,
        attempts: scoreDetails.attempts,
        notes: scoreDetails.notes
      };
      
      await axios.post('/api/scores', scoreData);
      
      // Reset form -- We assume the climber is in the same spot to log the next climb
      setStep(2);
      setSelections(prev => ({
        ...prev,
        grade: ''
      }));
      setScoreDetails({
        completed: true,
        attempts: 1,
        notes: ''
      });
      
      fetchClimberScores(climberId);
      alert('Score submitted successfully!');
    } catch (err) {
      setError('Failed to submit score');
    }
  };

  const handleDeleteScore = async (scoreId) => {
    if (window.confirm(`Are you sure you want to delete this score? - ${scoreId}`)) {
      try {
        await axios.delete(`/api/scores/${scoreId}`);
        fetchClimberScores(climberId);
        alert('Score deleted successfully!');
      } catch (err) {
        setError('Failed to delete score');
      }
    }
  };

  const resetToClimberSelection = () => {
    // Reset all state first
    setStep(1);
    setClimberId('');
    setCurrentClimber(null);
    setSelections({
      gym_id: '',
      gym_area_id: '',
      wall_area_name: '',
      wall_id: '',
      grade: ''
    });
    setScoreDetails({
      completed: true,
      attempts: 1,
      notes: ''
    });
    setGymAreas([]);
    setWallAreas([]);
    setWalls([]);
    setRopeNumbers([]);
    setGrades([]);
    setScores([]);
    
    // If we came from a parameterized route, navigate to base route
    if (urlClimberId) {
      navigate('/self-scoring');
    }
  };

  // Getting some pretty names
  const getCurrentStepTitle = () => {
    switch (step) {
      case 1: return 'Select Climber';
      case 2: return 'Submit Score';
      default: return 'Self Scoring';
    }
  };

  const getSelectedGymName = () => {
    const gym = gyms.find(g => g.id === parseInt(selections.gym_id));
    return gym ? gym.name : '';
  };

  const getSelectedAreaName = () => {
    const area = gymAreas.find(a => a.id === parseInt(selections.gym_area_id));
    return area ? area.name : '';
  };

  const getSelectedWallName = () => {
    return selections.wall_area_name
  };

  const getRopeNumber = () => {
    const rope = ropeNumbers.find(r => r.id === parseInt(selections.wall_id));
    return rope ? `#${rope.wall_number}` : '';
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <Box sx={{ my: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Box>
          <Typography variant="h2">Self Scoring - {getCurrentStepTitle()}</Typography>
          {step === 1 && <Typography variant="body1" color="text.secondary">Start scoring now.</Typography>}
          {step === 2 && <Typography variant="body1" color="text.secondary">Hello {currentClimber.name}, points await you.</Typography>}
        </Box>
        {step === 2 ? (
          <Button
            label='Select Climber'
            onClick={resetToClimberSelection}
          />
        ) : (
          <AddClimberForm onAddClimber={fetchInitialData} />
        )}
      </Box>

      {error && <div className="error">{error}</div>}

      {/* Step 1: Select Climber */}
      {step === 1 && (
        <Box className="card" sx={{ my: 5 }}>
          <Box className="climber-list">
            {climbers.map(climber => (
              <ClimberProfileCard key={climber.id} climber={climber} onClickOverride={() => handleClimberSelect(climber.id.toString())} />
            ))}
          </Box>
        </Box>
      )}


      {/* Progress indicator */}
      {step > 1 && (
        <Box className="card" sx={{ backgroundColor: '#f0f8ff', mb: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography component="span" fontWeight="bold">
                Route: 
              </Typography>
              {selections.gym_id && (
                <Typography component="span"> {getSelectedGymName()}</Typography>
              )}
              {selections.gym_area_id && (
                <Typography component="span"> &rarr; {getSelectedAreaName()}</Typography>
              )}
              {selections.wall_area_name && (
                <Typography component="span"> &rarr; {getSelectedWallName()}</Typography>
              )}
              {climbType === 'Ropes' && selections.wall_id && (
                <Typography component="span"> &rarr; {getRopeNumber()}</Typography>
              )}
              {selections.grade && (
                <Typography component="span"> &rarr; {selections.grade}</Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}
      {/* Step 2: Submit Score with Dropdowns */}
      {step === 2 && currentClimber && (
        <>
          <div className="card">
            <Typography variant="h3">Submit New Score</Typography>

            {/* Gym Selection */}
            <SelectionGrid
              title="Select a Gym:"
              items={gyms}
              onSelect={handleGymSelect}
              selectedValue={selections.gym_id}
              keyField="id"
              displayField="name"
              colorScheme="blue"
            />

            {/* Area Selection */}
            {selections.gym_id && (
              <SelectionGrid
                title={`Select an Area in ${getSelectedGymName()}:`}
                items={gymAreas}
                onSelect={handleAreaSelect}
                selectedValue={selections.gym_area_id}
                keyField="id"
                displayField="name"
                colorScheme="green"
              />
            )}

            {/* Wall Selection */}
            {selections.gym_area_id && (
              <SelectionGrid
                title={`Select a Wall in ${getSelectedAreaName()}:`}
                items={wallAreas}
                onSelect={handleWallSelect}
                selectedValue={selections.wall_area_name}
                keyField={'wall_name'}
                displayField={'wall_name'}
                colorScheme="orange"
              />
            )}

            {/* Rope Number Selection - Only for Ropes */}
            {climbType === 'Ropes' && selections.wall_area_name && ropeNumbers.length > 0 && (
              <SelectionGrid
                title={`Select Route Number on ${selections.wall_area_name}:`}
                items={ropeNumbers}
                onSelect={handleRopeNumberSelect}
                selectedValue={selections.wall_id}
                keyField="id"
                displayField="wall_number"
                colorScheme="blue"
                minWidth="80px"
              />
            )}

            {/* Grade Selection */}
            {selections.wall_id && (
              <SelectionGrid
                title={`Select Grade for ${getSelectedWallName()}:`}
                items={grades}
                onSelect={handleGradeSelect}
                selectedValue={selections.grade}
                keyField="grade"
                displayField="grade"
                colorScheme="purple"
                minWidth="100px"
              />
            )}

            {/* Score Details Form */}
            {selections.grade && (
              <div style={{ marginTop: '2rem' }}>
                <form onSubmit={handleScoreSubmit}>
                  <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                    <Typography variant="body2"><strong>Selected Route:</strong><br />
                    {getSelectedGymName()} → {getSelectedAreaName()} → {getSelectedWallName()} → {climbType === 'Ropes' ? `${getRopeNumber()} →` : ''}  {selections.grade}
                    </Typography>
                  </div>

                  <div className="form-group">
                    <Typography variant="body2" component="label">Number of Attempts:</Typography>
                    <input
                      type="number"
                      min="1"
                      value={scoreDetails.attempts}
                      onChange={(e) => setScoreDetails(prev => ({ ...prev, attempts: parseInt(e.target.value) }))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <Typography variant="body2" component="label">Notes:</Typography>
                    <textarea
                      value={scoreDetails.notes}
                      onChange={(e) => setScoreDetails(prev => ({ ...prev, notes: e.target.value }))}
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

            {/* Reset button to start over */}
            {(selections.gym_id || selections.gym_area_id || selections.wall_id || selections.grade) && (
              <Button
                label='Start Over'
                onClick={() => {
                  setSelections({
                    gym_id: '',
                    gym_area_id: '',
                    wall_id: '',
                    grade: ''
                  });
                  setScoreDetails({
                    completed: true,
                    attempts: 1,
                    notes: ''
                  });
                }}
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
                label='Climber Profile'
                path={`/climber-profile/${climberId}`}
              />
            </Box>
            {scores.length > 0 ? (
              <ClimbingLog scores={scores.slice(0, 10)} onDelete={handleDeleteScore} />
            ) : (
              <p>No scores recorded yet. Submit your first climb above!</p>
            )}

            {scores.length > 3 && (
              <Button
                label={`View All Scores (${scores.length})`}
                path={`/climber-profile/${climberId}`}
              />
            )}
          </div>
        </>
      )}

      {climbers.length === 0 && step === 1 && (
        <div className="card">
          <p>No climbers found. Please add climbers first!</p>
        </div>
      )}
    </Box>
  );
};

export default SelfScoring;
