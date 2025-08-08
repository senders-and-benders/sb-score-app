import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const [newRoute, setNewRoute] = useState({
    gymLocation: '',
    wallName: '',
    grade: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const gradeOptions = [
    '5.5', '5.6', '5.7', '5.8', '5.9', '5.10a', '5.10b', '5.10c', '5.10d',
    '5.11a', '5.11b', '5.11c', '5.11d', '5.12a', '5.12b', '5.12c', '5.12d',
    '5.13a', '5.13b', '5.13c', '5.13d', '5.14a', '5.14b', '5.14c', '5.14d'
  ];

  const gymLocationOptions = [
    'Downtown Boulder',
    'Uptown Boulder',
    'Denver Gym',
    'Golden Gym',
    'Boulder Canyon',
    'Flatirons Gym'
  ];

  const wallNameOptions = [
    'Main Wall',
    'Overhang Wall',
    'Slab Wall',
    'Cave',
    'Competition Wall',
    'Training Wall',
    'Beginner Wall',
    'Advanced Wall'
  ];

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get('/api/routes');
      setRoutes(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load routes');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/routes', newRoute);
      setNewRoute({ gymLocation: '', wallName: '', grade: '', description: '' });
      fetchRoutes();
    } catch (err) {
      setError('Failed to add route');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await axios.delete(`/api/routes/${id}`);
        fetchRoutes();
      } catch (err) {
        setError('Failed to delete route');
      }
    }
  };

  if (loading) return <div className="loading">Loading routes...</div>;

  return (
    <div>
      <h2>Climbing Routes</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div className="card">
        <h3>Add New Route</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Gym Location:</label>
            <select
              value={newRoute.gymLocation}
              onChange={(e) => setNewRoute({...newRoute, gymLocation: e.target.value})}
              required
            >
              <option value="">Select a gym location</option>
              {gymLocationOptions.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Wall Name:</label>
            <select
              value={newRoute.wallName}
              onChange={(e) => setNewRoute({...newRoute, wallName: e.target.value})}
              required
            >
              <option value="">Select a wall</option>
              {wallNameOptions.map(wall => (
                <option key={wall} value={wall}>{wall}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Grade:</label>
            <select
              value={newRoute.grade}
              onChange={(e) => setNewRoute({...newRoute, grade: e.target.value})}
              required
            >
              <option value="">Select a grade</option>
              {gradeOptions.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={newRoute.description}
              onChange={(e) => setNewRoute({...newRoute, description: e.target.value})}
              rows="3"
            />
          </div>
          <button type="submit" className="btn">Add Route</button>
        </form>
      </div>

      <div className="route-list">
        {routes.map(route => (
          <div key={route.id} className="card">
            <h3>🧗 {route.gymLocation} - {route.wallName}</h3>
            <div className="grade-badge">{route.grade}</div>
            <p>📍 {route.gymLocation}</p>
            <p>🧱 {route.wallName}</p>
            {route.description && <p>{route.description}</p>}
            <button 
              className="btn btn-danger"
              onClick={() => handleDelete(route.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      
      {routes.length === 0 && (
        <div className="card">
          <p>No routes found. Add some routes to get started!</p>
        </div>
      )}
    </div>
  );
};

export default Routes;
