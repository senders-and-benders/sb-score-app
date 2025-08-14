import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PageNotFound.css';
import logo from '../../assets/pageNotFound.png';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="not-found-container">
      <img className="not-found-content" src={logo} alt="Page Not Found" />
      <div className="not-found-text-box">
        {/* Error Message */}
        <div className="error-message">
          <h2>Page Not Found</h2>
          <p>
            Sorry, the page you're looking for doesn't exist or hasn't been vibe coded yet.
          </p>
          <p className="error-path">
            <strong>Requested path:</strong> <code>{location.pathname}</code>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="btn-primary" 
            onClick={handleGoHome}
          >
            🏠 Go to Dashboard
          </button>
          
          <button 
            className="btn-secondary" 
            onClick={handleGoBack}
          >
            ← Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="helpful-links">
          <h3>Looking for something specific?</h3>
          <ul>
            <li>
              <button onClick={() => navigate('/dashboard')}>
                📊 Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/climbers')}>
                👥 Climbers
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/self-scoring')}>
                📝 Self Scoring
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
