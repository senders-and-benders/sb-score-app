import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="nav">
      <ul>
        <li>
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Dashboard
          </Link>
        </li>
                <li>
          <Link 
            to="/climbers" 
            className={location.pathname === '/climbers' ? 'active' : ''}
          >
            Climbers
          </Link>
        </li>
        <li>
          <Link 
            to="/self-scoring" 
            className={location.pathname === '/self-scoring' ? 'active' : ''}
          >
            Self Scoring
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
