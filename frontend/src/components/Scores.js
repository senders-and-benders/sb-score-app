import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Scores = () => {
  const { climberId } = useParams();
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [currentClimber, setCurrentClimber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (climberId) {
      fetchClimberScores();
    } else {
      fetchData();
    }
  }, [climberId]);

  const fetchClimberScores = async () => {
    try {
      const response = await axios.get(`/api/scores/climber/${climberId}`);
      setCurrentClimber(response.data.climber);
      setScores(response.data.scores);
      setLoading(false);
    } catch (err) {
      setError('Failed to load climber scores');
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const scoresRes = await axios.get('/api/scores');
      setScores(scoresRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load data');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this score?')) {
      try {
        await axios.delete(`/api/scores/${id}`);
        if (climberId) {
          fetchClimberScores();
        } else {
          fetchData();
        }
      } catch (err) {
        setError('Failed to delete score');
      }
    }
  };

  const getClimberName = (climberId) => {
    // For individual scores, we get the climber name from the score data directly
    return scores.find(s => s.climber_id === climberId)?.climberName || 'Unknown';
  };

  const getRouteInfo = (score) => {
    return {
      gymName: score.gymName || 'Unknown Gym',
      wallName: score.wallName || 'Unknown Wall',
      grade: score.grade || ''
    };
  };

  if (loading) return <div className="loading">Loading scores...</div>;

  // Filter scores if we're in self-scoring mode
  const filteredScores = climberId 
    ? scores.filter(score => score.climber_id === parseInt(climberId))
    : scores;

  return (
    <div>
      <h2>
        {climberId && currentClimber 
          ? `${currentClimber.name}'s Climbing Scores` 
          : 'Climbing Scores'
        }
      </h2>
      
      {climberId && currentClimber && (
        <div className="card" style={{ backgroundColor: '#e8f5e8', marginBottom: '1rem' }}>
          <p>
            <strong>Viewing scores for: {currentClimber.name}</strong> 
            <span style={{ marginLeft: '1rem' }}>
              <button 
                className="btn" 
                onClick={() => navigate('/self-scoring')}
                style={{ fontSize: '0.9rem', padding: '0.3rem 0.8rem' }}
              >
                Back to Self Scoring
              </button>
            </span>
          </p>
        </div>
      )}
      
      {error && <div className="error">{error}</div>}

      <div>
        <h3>
          {climberId && currentClimber 
            ? `${currentClimber.name}'s Recent Scores` 
            : 'Recent Scores'
          }
        </h3>
        {filteredScores.map(score => {
          const routeInfo = getRouteInfo(score);
          return (
            <div key={score.id} style={{ 
              padding: '10px', 
              margin: '10px 0', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              position: 'relative'
            }}>
              <button
                onClick={() => handleDelete(score.id)}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: '1'
                }}
                title="Delete score"
              >
                ×
              </button>
              <h4>🧗‍♂️ {climberId ? '' : `${getClimberName(score.climber_id)} - `}{routeInfo.gymName} - {score.gymAreaName} - {routeInfo.wallName}</h4>
              <p>
                {score.completed ? '✅ Completed' : '❌ Not completed'} 
                {' '} in {score.attempts} attempt{score.attempts !== 1 ? 's' : ''}
              </p>
              <p><strong>Grade:</strong> {routeInfo.grade}</p>
              {score.notes && <p><em>"{score.notes}"</em></p>}
              <small>Recorded: {new Date(score.date_recorded).toLocaleDateString()}</small>
            </div>
          );
        })}
      </div>
      
      {filteredScores.length === 0 && (
        <div className="card">
          <p>
            {climberId && currentClimber 
              ? `No scores recorded yet for ${currentClimber.name}. Start climbing and recording your attempts!`
              : 'No scores recorded yet. Start climbing and recording your attempts!'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Scores;
