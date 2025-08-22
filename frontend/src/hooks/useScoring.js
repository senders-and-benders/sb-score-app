import { useState, useCallback } from 'react';
import { 
  getClimbers, getGyms, getGymAreas, getGymAreaWalls, 
  getGymAreaGrades, getClimberScores, addScore, deleteScore 
} from '../services/APIService';

export const useScoring = (climberId) => {
  const [state, setState] = useState({
    currentClimber: null,
    data: {
      gyms: [],
      gymAreas: [],
      wallAreas: [],
      walls: [],
      ropeNumbers: [],
      grades: [],
      scores: []
    },
    climbType: '',
    loading: true,
    error: null,
    selections: {
      gym_id: '',
      gym_area_id: '',
      wall_area_name: '',
      wall_id: '',
      grade: ''
    },
    scoreDetails: {
      completed: true,
      attempts: 1,
      notes: ''
    }
  });

  // Utility functions
  const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));
  const updateData = (dataUpdates) => setState(prev => ({ 
    ...prev, 
    data: { ...prev.data, ...dataUpdates } 
  }));
  const updateSelections = (selectionUpdates) => setState(prev => ({ 
    ...prev, 
    selections: { ...prev.selections, ...selectionUpdates } 
  }));
  const updateScoreDetails = (scoreUpdates) => setState(prev => ({ 
    ...prev, 
    scoreDetails: { ...prev.scoreDetails, ...scoreUpdates } 
  }));

  // API functions
  const fetchInitialData = useCallback(async () => {
    try {
      const [climbersData, gymsData] = await Promise.all([
        getClimbers(),
        getGyms()
      ]);
      
      const climber = climbersData.find(c => c.id === parseInt(climberId));
      if (!climber) {
        updateState({ error: 'Climber not found', loading: false });
        return { error: 'Climber not found' };
      }
      
      updateState({ 
        currentClimber: climber, 
        loading: false 
      });
      updateData({ gyms: gymsData });
      return { success: true };
    } catch (err) {
      updateState({ error: err.message || 'Failed to load data', loading: false });
      return { error: err.message || 'Failed to load data' };
    }
  }, [climberId]);

  const fetchClimberScores = useCallback(async () => {
    try {
      const response = await getClimberScores(climberId);
      updateData({ scores: response.scores || [] });
    } catch (err) {
      console.error('Failed to load climber scores', err);
    }
  }, [climberId]);

  const fetchGymAreas = async (gymId) => {
    try {
      const response = await getGymAreas(gymId);
      updateData({ gymAreas: response });
    } catch (err) {
      updateState({ error: 'Failed to load gym areas' });
    }
  };

  const fetchWallAreasAndGrades = async (gymAreaId) => {
    try {
      if (!gymAreaId) {
        updateData({ wallAreas: [] });
        updateState({ climbType: '' });
        return;
      }

      const selectedGymArea = state.data.gymAreas.find(area => area.id === parseInt(gymAreaId));
      const climbType = selectedGymArea?.climb_type;
      updateState({ climbType });
      
      const dataWalls = await getGymAreaWalls(gymAreaId);
      updateData({ walls: dataWalls });
      
      // Create unique wall areas
      const wallAreaMap = new Map();
      dataWalls.forEach(wall => {
        const key = `${wall.wall_name}|${wall.rope_wall_name}`;
        if (!wallAreaMap.has(key)) {
          wallAreaMap.set(key, { 
            wall_name: wall.wall_name, 
            rope_wall_name: wall.rope_wall_name 
          });
        }
      });
      updateData({ wallAreas: Array.from(wallAreaMap.values()) });
      
      const gradesData = await getGymAreaGrades(gymAreaId);
      updateData({ grades: gradesData });
    } catch (err) {
      updateState({ error: 'Failed to load walls and grades' });
    }
  };

  // Actions
  const handleSelection = (type, value) => {
    const resetMap = {
      gym: () => {
        updateSelections({ 
          gym_id: value, 
          gym_area_id: '', 
          wall_area_name: '', 
          wall_id: '', 
          grade: '' 
        });
        updateData({ 
          gymAreas: [], 
          wallAreas: [], 
          walls: [], 
          ropeNumbers: [], 
          grades: [] 
        });
        if (value) fetchGymAreas(value);
      },
      area: () => {
        updateSelections({ 
          gym_area_id: value, 
          wall_area_name: '', 
          wall_id: '', 
          grade: '' 
        });
        updateData({ wallAreas: [], walls: [], ropeNumbers: [], grades: [] });
        if (value) fetchWallAreasAndGrades(value);
      },
      wall: () => {
        updateData({ ropeNumbers: [] });
        if (state.climbType === 'Ropes') {
          const currentWall = state.data.walls.filter(wall => wall.wall_name === value);
          updateData({ ropeNumbers: currentWall });
          updateSelections({ wall_area_name: value, wall_id: '', grade: '' });
        } else {
          const currentWall = state.data.walls.find(wall => wall.wall_name === value);
          updateSelections({ wall_area_name: value, wall_id: currentWall?.id, grade: '' });
        }
      },
      rope: () => {
        updateSelections({ wall_id: value, grade: '' });
      },
      grade: () => {
        updateSelections({ grade: value });
      }
    };
    
    resetMap[type]?.();
  };

  const submitScore = async (scoreData) => {
    try {
      await addScore(scoreData);
      updateSelections({ grade: '' });
      updateScoreDetails({ completed: true, attempts: 1, notes: '' });
      fetchClimberScores();
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to submit score' };
    }
  };

  const deleteScoreById = async (scoreId) => {
    try {
      await deleteScore(scoreId);
      fetchClimberScores();
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to delete score' };
    }
  };

  const resetForm = () => {
    updateSelections({
      gym_id: '',
      gym_area_id: '',
      wall_area_name: '',
      wall_id: '',
      grade: ''
    });
    updateScoreDetails({ completed: true, attempts: 1, notes: '' });
    updateData({ 
      gymAreas: [], 
      wallAreas: [], 
      walls: [], 
      ropeNumbers: [], 
      grades: [] 
    });
  };

  return {
    state,
    updateSelections,
    updateScoreDetails,
    fetchInitialData,
    fetchClimberScores,
    handleSelection,
    submitScore,
    deleteScoreById,
    resetForm
  };
};
