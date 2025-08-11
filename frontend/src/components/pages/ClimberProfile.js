import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AscentCard from '../ui/AscentCard';

const Scores = () => {
  const { climberId } = useParams();
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [currentClimber, setCurrentClimber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClimberScores = useCallback(async () => {
    try {
      const response = await axios.get(`/api/scores/climber/${climberId}`);
      setCurrentClimber(response.data.climber);
      setScores(response.data.scores);
      setLoading(false);
    } catch (err) {
      setError('Failed to load climber scores');
      setLoading(false);
    }
  }, [climberId]);

  const fetchData = useCallback(async () => {
    try {
      const scoresRes = await axios.get('/api/scores');
      setScores(scoresRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load data');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (climberId) {
      fetchClimberScores();
    } else {
      fetchData();
    }
  }, [climberId, fetchClimberScores, fetchData]);

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
                onClick={() => navigate(`/self-scoring/${climberId}`)}
                style={{ fontSize: '0.9rem', padding: '0.3rem 0.8rem' }}
              >
                Back to Self Scoring
              </button>
            </span>
          </p>
        </div>
      )}
      
      {error && <div className="error">{error}</div>}

      <div className='card'>
        {filteredScores.map(score => (
          <AscentCard
            score={score}
            onDelete={handleDelete}
          />
        ))}
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
