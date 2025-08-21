import axios from 'axios';

const API_BASE = '';

// Stats endpoints
export const getStats = () => axios.get(`${API_BASE}/api/stats`).then(res => res.data);
export const getClimberStatsLast30DaysMetrics = climberId => axios.get(`${API_BASE}/api/stats/climber/${climberId}/last_30_days_metrics`).then(res => res.data);
export const getClimberStatsLast30DaysDailySummary = climberId => axios.get(`${API_BASE}/api/stats/climber/${climberId}/last_30_days_daily_summary`).then(res => res.data);
export const getClimberStatsLast30DaysData = climberId => axios.get(`${API_BASE}/api/stats/climber/${climberId}/last_30_days_data`).then(res => res.data);
export const getAvgGradeLast60Days = climberId => axios.get(`${API_BASE}/api/stats/climber/${climberId}/avg_grade_last_60_days`).then(res => res.data);

// Climbers endpoints
export const getClimbers = () => axios.get(`${API_BASE}/api/climbers`).then(res => res.data);
export const addClimber = climber => axios.post(`${API_BASE}/api/climbers`, climber).then(res => res.data);
export const deleteClimber = climberId => axios.delete(`${API_BASE}/api/climbers/${climberId}`).then(res => res.data);

// Gyms endpoints
export const getGyms = () => axios.get(`${API_BASE}/api/gyms`).then(res => res.data);
export const getGymAreas = gymId => axios.get(`${API_BASE}/api/gym/${gymId}/areas`).then(res => res.data);
export const getGymRoutes = gymId => axios.get(`${API_BASE}/api/gym/${gymId}/walls`).then(res => res.data);

// Gym Area endpoints
export const getAllGymAreas = () => axios.get(`${API_BASE}/api/gym_areas`).then(res => res.data);
export const getGymAreaWalls = gymAreaId => axios.get(`${API_BASE}/api/gym_area/${gymAreaId}/walls`).then(res => res.data);
export const getGymAreaGrades = gymAreaId => axios.get(`${API_BASE}/api/gym_area/${gymAreaId}/grades`).then(res => res.data);

// Walls endpoints
export const getAllWalls = () => axios.get(`${API_BASE}/api/walls`).then(res => res.data);
export const getWallGrades = wallId => axios.get(`${API_BASE}/api/wall/${wallId}/grades`).then(res => res.data);

// Grades endpoints
export const getGrades = () => axios.get(`${API_BASE}/api/grades`).then(res => res.data);

// Scores endpoints
export const getScores = () => axios.get(`${API_BASE}/api/scores`).then(res => res.data);
export const getClimberScores = climberId => axios.get(`${API_BASE}/api/scores/climber/${climberId}`).then(res => res.data);
export const deleteScore = scoreId => axios.delete(`${API_BASE}/api/scores/${scoreId}`).then(res => res.data);
export const addScore = score => axios.post(`${API_BASE}/api/scores`, score).then(res => res.data);
