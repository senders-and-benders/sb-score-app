import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AscentCard from '../components/AscentCard';
import SelectionGrid from '../components/SelectionGrid';

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
    // If we came from a parameterized route, navigate to base route
    if (urlClimberId) {
      navigate('/self-scoring');
      return;
    }
    
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
    <div>
      <h2>Self Scoring - {getCurrentStepTitle()}</h2>
      
      {error && <div className="error">{error}</div>}

      {/* Progress indicator */}
      {step > 1 && (
        <div className="card" style={{ backgroundColor: '#f0f8ff', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{currentClimber?.name}</strong>
              {selections.gym_id && <span> → {getSelectedGymName()}</span>}
              {selections.gym_area_id && <span> → {getSelectedAreaName()}</span>}
              {selections.wall_area_name && <span> → {getSelectedWallName()}</span>}
              {climbType === 'Ropes' && selections.wall_id && <span> → {getRopeNumber()}</span>}
              {selections.grade && <span> → {selections.grade}</span>}
            </div>
            <div>
              <button 
                className="btn" 
                onClick={resetToClimberSelection}
                style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}
              >
                Select Another Climber
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Select Climber */}
      {step === 1 && (
        <>
          <div className="card">
            <h3>Select Your Name</h3>
            <div className="climber-selection">
              {climbers.map(climber => (
                <div 
                  key={climber.id} 
                  className="climber-option"
                  onClick={() => handleClimberSelect(climber.id.toString())}
                  style={{
                    padding: '10px',
                    margin: '5px 0',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    backgroundColor: climberId === climber.id.toString() ? '#e3f2fd' : 'white'
                  }}
                >
                  <strong>{climber.name}</strong>
                  <span style={{ color: '#666', marginLeft: '10px' }}>
                    <small>({climber.nickname})</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Step 2: Submit Score with Dropdowns */}
      {step === 2 && currentClimber && (
        <>
          <div className="card">
            <h3>Submit New Score</h3>
            
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
                    <strong>Selected Route:</strong><br />
                    {getSelectedGymName()} → {getSelectedAreaName()} → {getSelectedWallName()} → {climbType === 'Ropes' ? `${getRopeNumber()} →` : ''}  {selections.grade}
                  </div>

                  <div className="form-group">
                    <label>Number of Attempts:</label>
                    <input
                      type="number"
                      min="1"
                      value={scoreDetails.attempts}
                      onChange={(e) => setScoreDetails(prev => ({ ...prev, attempts: parseInt(e.target.value) }))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Notes:</label>
                    <textarea
                      value={scoreDetails.notes}
                      onChange={(e) => setScoreDetails(prev => ({ ...prev, notes: e.target.value }))}
                      rows="3"
                      placeholder="Any notes about your climb..."
                    />
                  </div>

                  <button type="submit" className="btn" style={{ backgroundColor: '#28a745', color: 'white' }}>
                    Submit Score
                  </button>
                </form>
              </div>
            )}

            {/* Reset button to start over */}
            {(selections.gym_id || selections.gym_area_id || selections.wall_id || selections.grade) && (
              <button
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
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Start Over
              </button>
            )}
          </div>

          {/* Recent Scores */}
          <div className="card">
            <h3>Your Recent Scores</h3>
            {scores.length > 0 ? (
              scores.slice(0, 5).map(score => (
                <AscentCard
                  score={score} 
                  onDelete={handleDeleteScore} 
                />
              ))
            ) : (
              <p>No scores recorded yet. Submit your first climb above!</p>
            )}

            {scores.length > 3 && (
              <button
                className="btn"
                onClick={() => navigate(`/climber-profile/${climberId}`)}
                style={{ marginTop: '10px' }}
              >
                View All Scores ({scores.length})
              </button>
            )}
          </div>
        </>
      )}

      {climbers.length === 0 && step === 1 && (
        <div className="card">
          <p>No climbers found. Please add climbers first!</p>
        </div>
      )}
    </div>
  );
};

export default SelfScoring;
