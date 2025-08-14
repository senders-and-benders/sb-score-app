const AscentCard = ({ 
  score, 
  onDelete, 
  showClimberName = false, 
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
        🧗‍♂️ {showClimberName ? `${scoreInfo.climberName} - ` : ''}
        {scoreInfo.gymName} - {scoreInfo.gymAreaName} - {scoreInfo.wallName}
        {scoreInfo.climbType === "Ropes" ? ` - #${scoreInfo.wallNumber}` : ''}
      </h4>
      
      <p>
        {score.completed ? '✅ Completed' : '❌ Not completed'} 
        {' '} in {score.attempts} attempt{score.attempts !== 1 ? 's' : ''}
      </p>
      
      <p><strong>Grade:</strong> {scoreInfo.grade}</p>
      
      {score.notes && <p><em>"{score.notes}"</em></p>}
      
      <small>
        Recorded: {new Date(score.date_recorded).toLocaleDateString()}
        <br />
      </small>
    </div>
  );
};

export default AscentCard;