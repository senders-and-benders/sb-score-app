import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AscentCard from '../components/AscentCard';

const SelfScoring = () => {
  const { climberId: urlClimberId } = useParams(); // Get climber ID from URL
  const [step, setStep] = useState(1); // 1: Select climber, 2: Select all options & submit
  const [climberId, setClimberId] = useState(urlClimberId || '');
  const [currentClimber, setCurrentClimber] = useState(null);
  const [climbers, setClimbers] = useState([]);
  const [gyms, setGyms] = useState([]);
  const [gymAreas, setGymAreas] = useState([]);
  const [walls, setWalls] = useState([]);
  const [grades, setGrades] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selections, setSelections] = useState({
    gym_id: '',
    gym_area_id: '',
    wall_id: '',
    grade: ''
  });
  const [scoreDetails, setScoreDetails] = useState({
    completed: true,
    attempts: 1,
    notes: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (climberId) {
      fetchClimberScores(climberId);
    }
  }, [climberId]);

  // Handle URL climber ID parameter
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

  const fetchWalls = async (gymAreaId) => {
    try {
      const response = await axios.get(`/api/gym_area/${gymAreaId}/walls`);
      setWalls(response.data);
    } catch (err) {
      setError('Failed to load walls');
    }
  };

  const fetchGrades = async (wallId) => {
    try {
      const response = await axios.get(`/api/wall/${wallId}/grades`);
      setGrades(response.data);
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

  const handleClimberSelect = (selectedClimberId) => {
    setClimberId(selectedClimberId);
    const climber = climbers.find(c => c.id === parseInt(selectedClimberId));
    setCurrentClimber(climber);
    setStep(2);
  };

  const handleGymSelect = (gymId) => {
    setSelections(prev => ({ ...prev, gym_id: gymId, gym_area_id: '', wall_id: '', grade: '' }));
    setGymAreas([]);
    setWalls([]);
    setGrades([]);
    if (gymId) {
      fetchGymAreas(gymId);
    }
  };

  const handleAreaSelect = (areaId) => {
    setSelections(prev => ({ ...prev, gym_area_id: areaId, wall_id: '', grade: '' }));
    setWalls([]);
    setGrades([]);
    if (areaId) {
      fetchWalls(areaId);
    }
  };

  const handleWallSelect = (wallId, climbType) => {
    setSelections(prev => ({ 
      ...prev, 
      wall_id: wallId, 
      grade: '' 
    }));
    setGrades([]);
    if (wallId) {
      fetchGrades(wallId);
    }
  };

  const handleGradeSelect = (grade) => {
    setSelections(prev => ({ ...prev, grade: grade }));
  };

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
      wall_id: '',
      grade: ''
    });
    setScoreDetails({
      completed: true,
      attempts: 1,
      notes: ''
    });
    setGymAreas([]);
    setWalls([]);
    setGrades([]);
    setScores([]);
  };

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
    const wall = walls.find(w => w.id === parseInt(selections.wall_id));
    return wall ? wall.name : '';
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
              {selections.wall_id && <span> → {getSelectedWallName()}</span>}
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
            <div>
              <h4>Select a Gym:</h4>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '10px', 
                  marginTop: '1rem' 
                }}>
                {gyms.map(gym => (
                  <button
                    key={gym.id}
                    className="btn"
                    onClick={() => handleGymSelect(gym.id)}
                    style={{
                      padding: '1rem',
                      textAlign: 'center',
                      backgroundColor: selections.gym_id === gym.id ? '#e3f2fd' : 'white',
                      border: selections.gym_id === gym.id ? '2px solid #2196f3' : '2px solid #ddd',
                      color: '#333',
                      borderRadius: '8px'
                    }}
                  >
                    <strong>{gym.name}</strong>
                  </button>
                ))}
              </div>
            </div>

            {/* Area Selection */}
            {selections.gym_id && (
              <div style={{ marginTop: '2rem' }}>
                <h4>Select an Area in {getSelectedGymName()}:</h4>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '10px', 
                  marginTop: '1rem' 
                }}>
                  {gymAreas.map(area => (
                    <button
                      key={area.id}
                      className="btn"
                      onClick={() => handleAreaSelect(area.id)}
                      style={{
                        padding: '1rem',
                        textAlign: 'center',
                        backgroundColor: selections.gym_area_id === area.id ? '#e8f5e8' : 'white',
                        border: selections.gym_area_id === area.id ? '2px solid #4caf50' : '2px solid #ddd',
                        color: '#333',
                        borderRadius: '8px'
                      }}
                    >
                      <strong>{area.name}</strong>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Wall Selection */}
            {selections.gym_area_id && (
              <div style={{ marginTop: '2rem' }}>
                <h4>Select a Wall in {getSelectedAreaName()}:</h4>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '10px', 
                  marginTop: '1rem'
                }}>
                  {walls.map(wall => (
                    <button
                      key={wall.id}
                      className="btn"
                      onClick={() => handleWallSelect(wall.id, wall.climbType)}
                      style={{
                        padding: '1rem',
                        textAlign: 'center',
                        backgroundColor: selections.wall_id === wall.id ? '#fff3e0' : 'white',
                        border: selections.wall_id === wall.id ? '2px solid #ff9800' : '2px solid #ddd',
                        color: '#333',
                        borderRadius: '8px'
                      }}
                    >
                      <strong>{wall.name}</strong>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Grade Selection */}
            {selections.wall_id && (
              <div style={{ marginTop: '2rem' }}>
                <h4>Select Grade for {getSelectedWallName()}:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px', marginTop: '1rem' }}>
                  {grades.map(grade => (
                    <button
                      key={grade.grade}
                      className="btn"
                      onClick={() => handleGradeSelect(grade.grade)}
                      style={{
                        padding: '1rem',
                        backgroundColor: selections.grade === grade.grade ? '#f3e5f5' : 'white',
                        border: selections.grade === grade.grade ? '2px solid #9c27b0ff' : '2px solid #ddd',
                        color: '#333',
                        fontWeight: 'bold',
                        borderRadius: '8px'
                      }}
                    >
                      {grade.grade}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Score Details Form */}
            {selections.grade && (
              <div style={{ marginTop: '2rem' }}>
                <form onSubmit={handleScoreSubmit}>
                  <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                    <strong>Selected Route:</strong><br />
                    {getSelectedGymName()} → {getSelectedAreaName()} → {getSelectedWallName()} → {selections.grade}
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
