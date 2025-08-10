import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecentActivityFeed from '../features/RecentActivityFeed'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClimbers: 0,
    totalWalls: 0,
    totalAscents: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats');
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard stats');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="climber-list">
        <div className="card">
          <h3>📈 Quick Actions</h3>
          <button className="btn" onClick={() => window.location.href = '/self-scoring'}>
            Start Scoring
          </button>
        </div>
        
        <div className="card">
          <h3>📊 Statistics</h3>
          <div>
            <p><strong>Total Climbers:</strong> {stats.totalClimbers}</p>
            <p><strong>Total Ascents:</strong> {stats.totalAscents}</p>
          </div>
        </div>
      </div>
        
      <div className="card">
        <h3>🏆 Recent Activity</h3>
        <p>Welcome to the Senders & Benders climbing app!</p>
        <RecentActivityFeed maxItems={10} />
      </div>
        
    </div>
  );
};

export default Dashboard;
