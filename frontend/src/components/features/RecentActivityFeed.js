import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const RecentActivityFeed = ({ maxItems = 5 }) => {
  const [recentScores, setRecentScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecentActivity = useCallback(async () => {
    try {
      const response = await axios.get(`/api/scores?limit=${maxItems * 2}`);
      
      // Filter for completed ascents in the last week and get the 5 most recent
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const recentCompletedAscents = response.data
        .filter(score => {
          const scoreDate = new Date(score.date_recorded || score.dateRecorded);
          return score.completed && scoreDate >= oneWeekAgo;
        })
        .sort((a, b) => new Date(b.date_recorded || b.dateRecorded) - new Date(a.date_recorded || a.dateRecorded))
        .slice(0, maxItems);
      
      setRecentScores(recentCompletedAscents);
      setLoading(false);
    } catch (err) {
      setError('Failed to load recent activity');
      setLoading(false);
    }
  }, [maxItems]);

  useEffect(() => {
    fetchRecentActivity();
  }, [fetchRecentActivity]);

  const formatActivityMessage = (score) => {
    const climberName = score.climber_name || score.climberName || `Climber ${score.climber_id}`;
    const gymName = score.gym_name || score.gymName || 'Unknown Gym';
    const gymAreaName = score.gym_area_name || score.gymAreaName || 'Unknown Area';
    const wallName = score.wall_name || score.wallName || 'Unknown Wall';
    const timeAgo = getTimeAgo(score.date_recorded || score.dateRecorded);
    
    return {
      climber: climberName,
      route: `${gymName} - ${gymAreaName} - ${wallName}`,
      grade: score.grade,
      timeAgo: timeAgo,
      attempts: score.attempts,
      notes: score.notes
    };
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        color: '#666'
      }}>
        Loading recent activity...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        color: '#dc3545'
      }}>
        {error}
      </div>
    );
  }

  if (recentScores.length === 0) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        color: '#666'
      }}>
        <p>No recent activity in the last week.</p>
        <p>Start climbing and recording your attempts!</p>
      </div>
    );
  }

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: 'white'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #eee',
        fontWeight: 'bold',
        color: '#333'
      }}>
        🏆 Last {recentScores.length} Sends This Week
      </div>

      {/* Static list of recent activities */}
      <div style={{ padding: '8px' }}>
        {recentScores.map((score, index) => {
          const activity = formatActivityMessage(score);
          
          return (
            <div key={score.id} style={{
              padding: '12px',
              margin: '4px 0',
              border: '1px solid #eee',
              borderRadius: '6px',
              backgroundColor: '#fafafa'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '6px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  flex: 1
                }}>
                  <span style={{ fontSize: '14px', marginRight: '6px' }}>🧗‍♂️</span>
                  <strong style={{ color: '#2196f3', fontSize: '13px', marginRight: '8px' }}>
                    {activity.climber}
                  </strong>
                  <span style={{ 
                    backgroundColor: '#e8f5e8', 
                    padding: '2px 6px', 
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    color: '#2e7d32'
                  }}>
                    {activity.grade}
                  </span>
                </div>
                <span style={{ 
                  fontSize: '10px', 
                  color: '#999',
                  whiteSpace: 'nowrap' 
                }}>
                  {activity.timeAgo}
                </span>
              </div>
              
              <p style={{ 
                fontSize: '11px', 
                color: '#666',
                margin: '4px 0',
                lineHeight: '1.3'
              }}>
                📍 {activity.route}
              </p>
              
              <div style={{
                fontSize: '10px',
                color: '#999'
              }}>
                {activity.attempts} attempt{activity.attempts !== 1 ? 's' : ''}
                {activity.notes && (
                  <span style={{ 
                    marginLeft: '8px',
                    fontStyle: 'italic',
                    color: '#666'
                  }}>
                    • "{activity.notes.length > 40 ? activity.notes.substring(0, 40) + '...' : activity.notes}"
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivityFeed;
