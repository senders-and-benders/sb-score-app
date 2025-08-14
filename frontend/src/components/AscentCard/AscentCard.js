import './AscentCard.css';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

const AscentCard = ({ 
  score, // Score object from scores api
  onDelete, // onDelete function to handle any refreshes outside of this component
  showClimberName = false, // Show climber name in case
  showDeleteButton = true 
}) => {
  
  const scoreInfo = {
    climberName: score.climber_name || 'Unknown Climber',
    gymName: score.gym_name || 'Unknown Gym',
    gymAreaName: score.gym_area_name || 'Unknown Area',
    wallName: score.wall_name || 'Unknown Wall',
    climbType: score.climb_type || 'Unknown Type',
    wallNumber: score.wall_number || '',
    grade: score.grade || 'Unknown Grade'
    };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(score.id);
    }
  };

  return (
    <div className="ascent-card">
      {showDeleteButton && onDelete && (
        <button
          onClick={handleDelete}
          className="ascent-card__delete-button"
          title="Delete score"
        >
          x
        </button>
      )}
      
      <h4 className="ascent-card__title">
        🧗‍♂️ {showClimberName ? `${scoreInfo.climberName} - ` : ''}
        {scoreInfo.gymName} - {scoreInfo.gymAreaName} - {scoreInfo.wallName}
        {scoreInfo.climbType === "Ropes" ? ` - #${scoreInfo.wallNumber}` : ''}
      </h4>
      
      <p className="ascent-card__status">
        {score.completed ? '✅ Completed' : '❌ Not completed'} 
        {' '} in {score.attempts} attempt{score.attempts !== 1 ? 's' : ''}
      </p>
      
      <p className="ascent-card__grade"><strong>Grade:</strong> {scoreInfo.grade}</p>
      
      {score.notes && <p className="ascent-card__notes">"{score.notes}"</p>}
      
      <div className="ascent-card__timestamp">
        Recorded: {new Date(score.date_recorded).toLocaleDateString()}
      </div>
    </div>
  );
};

export default AscentCard;