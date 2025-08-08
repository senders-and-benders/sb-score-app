import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Scores = () => {
  const [scores, setScores] = useState([]);
  const [climbers, setClimbers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [newScore, setNewScore] = useState({
    climber_id: '',
    route_id: '',
    completed: false,
    attempts: 1,
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [scoresRes, climbersRes, routesRes] = await Promise.all([
        axios.get('/api/scores'),
        axios.get('/api/climbers'),
        axios.get('/api/routes')
      ]);
      setScores(scoresRes.data);
      setClimbers(climbersRes.data);
      setRoutes(routesRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load data');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/scores', newScore);
      setNewScore({
        climber_id: '',
        route_id: '',
        completed: false,
        attempts: 1,
        notes: ''
      });
      fetchData();
    } catch (err) {
      setError('Failed to add score');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this score?')) {
      try {
        await axios.delete(`/api/scores/${id}`);
        fetchData();
      } catch (err) {
        setError('Failed to delete score');
      }
    }
  };

  const getClimberName = (climberId) => {
    const climber = climbers.find(c => c.id === climberId);
    return climber ? climber.name : 'Unknown';
  };

  const getRouteInfo = (routeId) => {
    const route = routes.find(r => r.id === routeId);
    return route ? { name: route.name, grade: route.grade } : { name: 'Unknown', grade: '' };
  };

  if (loading) return <div className="loading">Loading scores...</div>;

  return (
    <div>
      <h2>Climbing Scores</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div className="card">
        <h3>Record New Attempt</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Climber:</label>
            <select
              value={newScore.climber_id}
              onChange={(e) => setNewScore({...newScore, climber_id: e.target.value})}
              required
            >
              <option value="">Select a climber</option>
              {climbers.map(climber => (
                <option key={climber.id} value={climber.id}>{climber.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Route:</label>
            <select
              value={newScore.route_id}
              onChange={(e) => setNewScore({...newScore, route_id: e.target.value})}
              required
            >
              <option value="">Select a route</option>
              {routes.map(route => (
                <option key={route.id} value={route.id}>
                  {route.name} ({route.grade})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={newScore.completed}
                onChange={(e) => setNewScore({...newScore, completed: e.target.checked})}
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
              onChange={(e) => setNewScore({...newScore, attempts: parseInt(e.target.value)})}
              required
            />
          </div>
          <div className="form-group">
            <label>Notes:</label>
            <textarea
              value={newScore.notes}
              onChange={(e) => setNewScore({...newScore, notes: e.target.value})}
              rows="3"
              placeholder="Any notes about the climb..."
            />
          </div>
          <button type="submit" className="btn">Record Score</button>
        </form>
      </div>

      <div>
        <h3>Recent Scores</h3>
        {scores.map(score => {
          const routeInfo = getRouteInfo(score.route_id);
          return (
            <div key={score.id} className="card">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <h4>
                    🧗‍♂️ {getClimberName(score.climber_id)} - {routeInfo.name}
                    <span className="grade-badge" style={{marginLeft: '1rem'}}>
                      {routeInfo.grade}
                    </span>
                  </h4>
                  <p>
                    {score.completed ? '✅ Completed' : '❌ Not completed'} 
                    {' '} in {score.attempts} attempt{score.attempts !== 1 ? 's' : ''}
                  </p>
                  {score.notes && <p><em>"{score.notes}"</em></p>}
                  <small>Recorded: {new Date(score.date_recorded).toLocaleDateString()}</small>
                </div>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDelete(score.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {scores.length === 0 && (
        <div className="card">
          <p>No scores recorded yet. Start climbing and recording your attempts!</p>
        </div>
      )}
    </div>
  );
};

export default Scores;
