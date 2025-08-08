import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Climbers = () => {
  const [climbers, setClimbers] = useState([]);
  const [newClimber, setNewClimber] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClimbers();
  }, []);

  const fetchClimbers = async () => {
    try {
      const response = await axios.get('/api/climbers');
      setClimbers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load climbers');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/climbers', newClimber);
      setNewClimber({ name: '', email: '' });
      fetchClimbers();
    } catch (err) {
      setError('Failed to add climber');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this climber?')) {
      try {
        await axios.delete(`/api/climbers/${id}`);
        fetchClimbers();
      } catch (err) {
        setError('Failed to delete climber');
      }
    }
  };

  if (loading) return <div className="loading">Loading climbers...</div>;

  return (
    <div>
      <h2>Climbers</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div className="card">
        <h3>Add New Climber</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={newClimber.name}
              onChange={(e) => setNewClimber({...newClimber, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={newClimber.email}
              onChange={(e) => setNewClimber({...newClimber, email: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="btn">Add Climber</button>
        </form>
      </div>

      <div className="climber-list">
        {climbers.map(climber => (
          <div key={climber.id} className="card">
            <h3>🧗‍♂️ {climber.name}</h3>
            <p>📧 {climber.email}</p>
            <p>📊 Total Score: <span className="score-display">{climber.total_score || 0}</span></p>
            <button 
              className="btn btn-danger"
              onClick={() => handleDelete(climber.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      
      {climbers.length === 0 && (
        <div className="card">
          <p>No climbers found. Add some climbers to get started!</p>
        </div>
      )}
    </div>
  );
};

export default Climbers;
