import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Climbers from './components/Climbers';
import SelfScoring from './components/SelfScoring';
import Scores from './components/Scores';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Navigation />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/climbers" element={<Climbers />} />
            <Route path="/self-scoring" element={<SelfScoring />} />
            <Route path="/scores/:climberId" element={<Scores />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
