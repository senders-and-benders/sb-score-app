const AscentCard = ({ 
  score, 
  onDelete, 
  showClimberName = false, 
  showDeleteButton = true 
}) => {
  
  const getRouteInfo = (score) => {
    return {
      gymName: score.gymName || 'Unknown Gym',
      gymAreaName: score.gymAreaName || 'Unknown Area',
      wallName: score.wallName || 'Unknown Wall',
      grade: score.grade || 'Unknown Grade'
    };
  };

  const getClimberName = (climberId) => {
    return score.climberName || `Climber ${climberId}`;
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(score.id);
    }
  };

  const routeInfo = getRouteInfo(score);

  return (
    <div style={{ 
      padding: '10px', 
      margin: '10px 0', 
      border: '1px solid #ddd', 
      borderRadius: '4px',
      position: 'relative'
    }}>
      {showDeleteButton && onDelete && (
        <button
          onClick={handleDelete}
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: '1'
          }}
          title="Delete score"
        >
          Delete
        </button>
      )}
      
      <h4>
        🧗‍♂️ {showClimberName ? `${getClimberName(score.climber_id)} - ` : ''}{routeInfo.gymName} - {routeInfo.gymAreaName} - {routeInfo.wallName}
      </h4>
      
      <p>
        {score.completed ? '✅ Completed' : '❌ Not completed'} 
        {' '} in {score.attempts} attempt{score.attempts !== 1 ? 's' : ''}
      </p>
      
      <p><strong>Grade:</strong> {routeInfo.grade}</p>
      
      {score.notes && <p><em>"{score.notes}"</em></p>}
      
      <small>
        Recorded: {new Date(score.date_recorded || score.dateRecorded).toLocaleDateString()}
      </small>
    </div>
  );
};

export default AscentCard;