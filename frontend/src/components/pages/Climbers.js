import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Climbers = () => {
  const [climbers, setClimbers] = useState([]);
  const [newClimber, setNewClimber] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

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

      <div className='card'>
        <h3>Climber List</h3>
        <i>Talk to admin to delete you as a climber.</i>
        
        <div className="climber-list">
          {climbers.map(climber => (
            <div key={climber.id} className="card">
              <h3>🧗‍♂️ <i>{climber.name}</i></h3>
              <p>📧 <i>{climber.email}</i></p>
              <button 
                className='btn'
                onClick={() => navigate(`/climber-profile/${climber.id}`)}
                style={{ fontSize: '0.9rem', padding: '0.3rem 0.8rem' }}
              >
                Profile
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {climbers.length === 0 && (
        <div className="card">
          <p><i>No climbers found. Add some climbers to get started!</i></p>
        </div>
      )}
    </div>
  );
};

export default Climbers;
