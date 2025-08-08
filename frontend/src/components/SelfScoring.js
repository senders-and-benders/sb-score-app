import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SelfScoring = () => {
  const [step, setStep] = useState(1); // 1: Select climber, 2: Submit score
  const [climberId, setClimberId] = useState('');
  const [currentClimber, setCurrentClimber] = useState(null);
  const [climbers, setClimbers] = useState([]);
  const [gyms, setGyms] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newScore, setNewScore] = useState({
    climber_id: '',
    route_id: '',
    completed: false,
    attempts: 1,
    notes: ''
  });
  const [selectedGym, setSelectedGym] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedGym) {
      fetchRoutesByGym(selectedGym);
    }
  }, [selectedGym]);

  useEffect(() => {
    if (climberId) {
      fetchClimberScores(climberId);
    }
  }, [climberId]);

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

  const fetchRoutesByGym = async (gymId) => {
    try {
      const response = await axios.get(`/api/routes/locations/${gymId}`);
      setRoutes(response.data);
    } catch (err) {
      setError('Failed to load routes for selected gym');
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
    setNewScore(prev => ({ ...prev, climber_id: selectedClimberId }));
    setStep(2);
  };

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/scores', newScore);
      setNewScore({
        climber_id: climberId,
        route_id: '',
        completed: false,
        attempts: 1,
        notes: ''
      });
      setSelectedGym('');
      setRoutes([]);
      fetchClimberScores(climberId);
      alert('Score submitted successfully!');
    } catch (err) {
      setError('Failed to submit score');
    }
  };

  const resetToClimberSelection = () => {
    setStep(1);
    setClimberId('');
    setCurrentClimber(null);
    setSelectedGym('');
    setRoutes([]);
    setScores([]);
    setNewScore({
      climber_id: '',
      route_id: '',
      completed: false,
      attempts: 1,
      notes: ''
    });
  };

  const getRouteDisplay = (route) => {
    return `${route.areaName} - ${route.wallName} (${route.grade})`;
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2>Self Scoring</h2>
      
      {error && <div className="error">{error}</div>}

      {step === 1 && (
        <>
          <div className="card">
            <h3>Enter Your Climber ID</h3>
            <p>Select your name from the list below or enter your climber ID to start scoring.</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (climberId) {
                handleClimberSelect(climberId);
              }
            }}>
              <div className="form-group">
                <label>Climber ID:</label>
                <input
                  type="text"
                  value={climberId}
                  onChange={(e) => setClimberId(e.target.value)}
                  placeholder="Enter your climber ID"
                  required
                />
              </div>
              <button type="submit" className="btn">
                Continue to Scoring
              </button>
            </form>
          </div>

          <div className="card">
            <h3>Or Select Your Name</h3>
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
                    ID: {climber.id}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {step === 2 && currentClimber && (
        <>
          <div className="card" style={{ backgroundColor: '#e8f5e8', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>Welcome, {currentClimber.name}!</h3>
                <p>Climber ID: {currentClimber.id}</p>
              </div>
              <button 
                className="btn" 
                onClick={resetToClimberSelection}
                style={{ fontSize: '0.9rem', padding: '0.3rem 0.8rem' }}
              >
                Switch User
              </button>
            </div>
          </div>

          <div className="card">
            <h3>Submit New Score</h3>
            <form onSubmit={handleScoreSubmit}>
              <div className="form-group">
                <label>Select Gym:</label>
                <select
                  value={selectedGym}
                  onChange={(e) => {
                    setSelectedGym(e.target.value);
                    setNewScore(prev => ({ ...prev, route_id: '' }));
                  }}
                  required
                >
                  <option value="">Choose a gym</option>
                  {gyms.map(gym => (
                    <option key={gym.id} value={gym.id}>{gym.gymName}</option>
                  ))}
                </select>
              </div>

              {selectedGym && (
                <div className="form-group">
                  <label>Select Route:</label>
                  <select
                    value={newScore.route_id}
                    onChange={(e) => setNewScore(prev => ({ ...prev, route_id: e.target.value }))}
                    required
                  >
                    <option value="">Choose a route</option>
                    {routes.map(route => (
                      <option key={route.id} value={route.id}>
                        {getRouteDisplay(route)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newScore.completed}
                    onChange={(e) => setNewScore(prev => ({ ...prev, completed: e.target.checked }))}
                  />
                  Completed (Send)
                </label>
              </div>

              <div className="form-group">
                <label>Number of Attempts:</label>
                <input
                  type="number"
                  min="1"
                  value={newScore.attempts}
                  onChange={(e) => setNewScore(prev => ({ ...prev, attempts: parseInt(e.target.value) }))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Notes:</label>
                <textarea
                  value={newScore.notes}
                  onChange={(e) => setNewScore(prev => ({ ...prev, notes: e.target.value }))}
                  rows="3"
                  placeholder="Any notes about your climb..."
                />
              </div>

              <button type="submit" className="btn">Submit Score</button>
            </form>
          </div>

          <div className="card">
            <h3>Your Recent Scores</h3>
            {scores.length > 0 ? (
              scores.slice(0, 5).map(score => (
                <div key={score.id} style={{ 
                  padding: '10px', 
                  margin: '10px 0', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px' 
                }}>
                  <h4>🧗‍♂️ {score.gymName} - {score.wallName}</h4>
                  <p>
                    {score.completed ? '✅ Completed' : '❌ Not completed'} 
                    {' '} in {score.attempts} attempt{score.attempts !== 1 ? 's' : ''}
                  </p>
                  <p><strong>Grade:</strong> {score.grade}</p>
                  {score.notes && <p><em>"{score.notes}"</em></p>}
                  <small>Recorded: {new Date(score.date_recorded).toLocaleDateString()}</small>
                </div>
              ))
            ) : (
              <p>No scores recorded yet. Submit your first climb above!</p>
            )}
            
            {scores.length > 5 && (
              <button 
                className="btn"
                onClick={() => navigate(`/scores/${climberId}`)}
                style={{ marginTop: '10px' }}
              >
                View All Scores
              </button>
            )}
          </div>
        </>
      )}

      {climbers.length === 0 && (
        <div className="card">
          <p>No climbers found. Please add climbers first!</p>
        </div>
      )}
    </div>
  );
};

export default SelfScoring;
