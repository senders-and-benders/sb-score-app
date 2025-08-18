
from flask import Blueprint, jsonify, request
from scripts.postgres_utils import create_connection_and_query, execute_query

# Create a Blueprint for routes
routes_blueprint = Blueprint('routes', __name__)

# API Routes
@routes_blueprint.route('/api/stats', methods=['GET'])
def get_stats():
    """Get dashboard statistics"""
    total_climbers = create_connection_and_query('SELECT COUNT(*) as count FROM climbers', fetch_one=True)['count']
    total_walls = create_connection_and_query('SELECT COUNT(*) as count FROM walls', fetch_one=True)['count']
    total_ascents = create_connection_and_query('SELECT COUNT(*) as count FROM scores WHERE completed = true', fetch_one=True)['count']
    
    return jsonify({
        'totalClimbers': total_climbers,
        'totalWalls': total_walls,
        'totalAscents': total_ascents
    })

@routes_blueprint.route('/api/stats/climber/<int:climber_id>/last_30_days_metrics', methods=['GET'])
def get_climber_stats_last_30_days_metrics(climber_id):
    """Get last 30 dats statistics for a specific climber"""
    kpi_query = '''
    SELECT 
	    count(*) as total_climbs,
	    sum(score) as total_score,
        count(distinct date_recorded) as total_days_climbed,
        cast(count(*) as decimal(10,2)) / count(distinct date_recorded) as daily_avg_climbs_completed
    FROM vw_completed_climbs_last_30_days
    WHERE climber_id = %s
    '''
    kpis = create_connection_and_query(kpi_query, params=(climber_id,), fetch_one=True)
    total_climbs = kpis['total_climbs']
    total_points = kpis['total_score']
    total_days_climbed = kpis['total_days_climbed']
    daily_avg_climbs_completed = kpis['daily_avg_climbs_completed']
    latest_and_greatest_climb_data = create_connection_and_query('SELECT * FROM vw_completed_climbs_last_30_days WHERE climber_id = %s AND best_climb_rank = 1', params=(climber_id,), fetch_one=True)

    return jsonify({
        'totalClimbs': total_climbs,
        'totalPoints': total_points,
        'totalDaysClimbed': total_days_climbed,
        'dailyAvgClimbsCompleted': daily_avg_climbs_completed,
        'latestAndGreatestClimb': latest_and_greatest_climb_data,
    })

@routes_blueprint.route('/api/stats/climber/<int:climber_id>/last_30_days_daily_summary')
def get_climber_stats_last_30_days_daily_summary(climber_id):
    daily_metrics_query = '''
    SELECT 
        date_trunc('day', date_recorded)::date as date,
        count(*) as total_climbs,
        sum(score) as total_score
    FROM vw_completed_climbs_last_30_days
    WHERE climber_id = %s
    GROUP BY date
    ORDER BY date
    '''
    daily_metrics = create_connection_and_query(daily_metrics_query, params=(climber_id,), fetch_all=True)
    return jsonify([dict(day) for day in daily_metrics])

@routes_blueprint.route('/api/stats/climber/<int:climber_id>/last_30_days_data')
def get_climber_stats_last_30_days_data(climber_id):
    data_query = '''
    SELECT *
    FROM vw_completed_climbs_last_30_days
    WHERE climber_id = %s
    '''
    data = create_connection_and_query(data_query, params=(climber_id,), fetch_all=True)
    return jsonify(data)

@routes_blueprint.route('/api/stats/climber/<int:climber_id>/avg_grade_last_60_days')
def avg_grade_last_60_days(climber_id):
    data_query = '''
    SELECT *
    FROM vw_avg_grade_last_60_days
    WHERE climber_id = %s
    '''
    data = create_connection_and_query(data_query, params=(climber_id,), fetch_all=True)
    return jsonify(data)

# Climbers endpoints
@routes_blueprint.route('/api/climbers', methods=['GET'])
def get_climbers():
    """Get all climbers with their scores"""
    climbers = create_connection_and_query('''
        SELECT 
            c.id,
            c.name,
            c.nickname,
            c.date_created
        FROM climbers c
        LEFT JOIN scores s ON c.id = s.climber_id
        GROUP BY c.id, c.name, c.nickname, c.date_created
        ORDER BY c.name
    ''', fetch_all=True)
    
    return jsonify([dict(climber) for climber in climbers])

@routes_blueprint.route('/api/climbers', methods=['POST'])
def add_climber():
    """Add a new climber"""
    data = request.get_json()

    if not data or 'name' not in data or 'email' not in data:
        return jsonify({'error': 'Name and email are required'}), 400

    if 'nickname' in data and data['nickname']:
        query = 'INSERT INTO climbers (name, email, nickname) VALUES (%s, %s, %s)'
        params = (data['name'], data['email'], data['nickname'])
    else:
        query = 'INSERT INTO climbers (name, email) VALUES (%s, %s)'
        params = (data['name'], data['email'])

    create_connection_and_query(query, params=params)
    return jsonify({'message': 'Climber added successfully'}), 201

@routes_blueprint.route('/api/climbers/<int:climber_id>', methods=['DELETE'])
def delete_climber(climber_id):
    """Delete a climber"""
    # First delete all scores for this climber
    create_connection_and_query('DELETE FROM scores WHERE climber_id = %s', params=(climber_id,))

    # Then delete the climber
    result = create_connection_and_query('DELETE FROM climbers WHERE id = %s', params=(climber_id,))
    
    if result.rowcount == 0:
        return jsonify({'error': 'Climber not found'}), 404
    
    return jsonify({'message': 'Climber deleted successfully'})

# Gyms endpoints
@routes_blueprint.route('/api/gyms', methods=['GET'])
def get_all_gyms():
    """Get all gyms"""
    gyms = create_connection_and_query('SELECT * FROM gyms ORDER BY name', fetch_all=True)
    return jsonify([dict(gym) for gym in gyms])

@routes_blueprint.route('/api/gym/<int:gym_id>/areas', methods=['GET'])
def get_gym_areas(gym_id):
    """Get all areas for a specific gym"""
    query = '''
    SELECT 
        ga.id,
        ga.climb_type,
        ga.name
    FROM gym_areas ga
    WHERE ga.gym_id = %s
    '''
    params = (gym_id,)
    areas = create_connection_and_query(query, params=params, fetch_all=True)
    return jsonify([dict(area) for area in areas])

@routes_blueprint.route('/api/gym/<int:gym_id>/walls')
def get_gym_routes(gym_id):
    """Get all routes for a specific gym"""
    query = '''
    SELECT 
        w.id,
        ga.name as gym_area_name,
        w.wall_name,
        w.wall_number
    FROM walls w
    JOIN gym_areas ga ON w.gym_area_id = ga.id
    WHERE w.gym_id = %s
    '''
    params = (gym_id,)
    routes = create_connection_and_query(query, params=params, fetch_all=True)
    return jsonify([dict(route) for route in routes])

#Gym Area Endpoints
@routes_blueprint.route('/api/gym_areas', methods=['GET'])
def get_all_gym_areas():
    """Get all gym areas"""
    query = '''
    SELECT 
        ga.id,
        g.name as gym_name,
        ga.climb_type,
        ga.name
    FROM gym_areas ga 
    JOIN gyms g ON ga.gym_id = g.id
    ORDER BY ga.name
    '''
    areas = create_connection_and_query(query, fetch_all=True)
    return jsonify([dict(area) for area in areas])

@routes_blueprint.route('/api/gym_area/<int:gym_area_id>/walls', methods=['GET'])
def get_gym_area_walls(gym_area_id):
    """Get all walls for a specific gym area"""
    query = '''
    SELECT 
        w.id,
        w.wall_name,
        w.wall_number
    FROM walls w
    WHERE w.gym_area_id = %s
    '''
    params = (gym_area_id,)
    walls = create_connection_and_query(query, params=params, fetch_all=True)
    return jsonify([dict(wall) for wall in walls])

@routes_blueprint.route('/api/gym_area/<int:gym_area_id>/grades', methods=['GET'])
def get_gym_area_grades(gym_area_id):
    """Get all walls for a specific gym area"""
    query = '''
    SELECT 
        g.id,
        a.climb_type,
        g.grade
    FROM gym_areas a
    LEFT JOIN grades g ON a.climb_type = g.climb_type
    WHERE a.id = %s
    '''
    params = (gym_area_id,)
    walls = create_connection_and_query(query, params=params, fetch_all=True)
    return jsonify([dict(wall) for wall in walls])

#Walls endpoints
@routes_blueprint.route('/api/walls', methods=['GET'])
def get_all_walls():
    """Get all walls"""
    query = '''
    SELECT 
        w.id,
        g.name as gym_name,
        ga.name as gym_area_name,
        ga.climb_type,
        w.wall_name,
        w.wall_number
    FROM walls w 
    JOIN gym_areas ga ON w.gym_area_id = ga.id
    JOIN gyms g ON ga.gym_id = g.id
    ORDER BY w.wall_name
    '''
    walls = create_connection_and_query(query, fetch_all=True)
    return jsonify([dict(wall) for wall in walls])

@routes_blueprint.route('/api/wall/<int:wall_id>/grades', methods=['GET'])
def get_wall_grades(wall_id):
    """Get available grades for a wall"""
    query = '''
    SELECT 
        g.id,
        w.wall_name,
        a.climb_type,
        g.grade
    FROM walls w
    JOIN gym_areas a ON w.gym_area_id = a.id
    JOIN grades g ON a.climb_type = g.climb_type
    WHERE w.id = %s
    ORDER BY g.id
    '''
    params = (wall_id,)
    grades = create_connection_and_query(query, params=params, fetch_all=True)
    return jsonify([dict(grade) for grade in grades])

# Grade endpoints
@routes_blueprint.route('/api/grades', methods=['GET'])
def get_grades():
    """Get all grades"""
    query = '''
    SELECT * FROM grades ORDER BY climb_type, grade
    '''
    grades = create_connection_and_query(query, fetch_all=True)
    return jsonify([dict(grade) for grade in grades])

# Score endpoints
@routes_blueprint.route('/api/scores', methods=['GET'])
def get_all_scores():
    """Get all scores with climber and wall info"""
    query = '''
    SELECT * FROM vw_completed_climbs ORDER BY date_recorded DESC
    '''
    scores = create_connection_and_query(query, fetch_all=True)
    return jsonify([dict(score) for score in scores])

@routes_blueprint.route('/api/scores/climber/<int:climber_id>', methods=['GET'])
def get_climber_scores(climber_id):
    """Get scores for a specific climber"""
    query = '''
    SELECT 
        c.id,
        c.name,
        c.nickname,
        c.date_created
    FROM climbers c WHERE id = %s
    '''
    params = (climber_id,)
    climber = create_connection_and_query(query, params=params, fetch_one=True)
    if not climber:
        return jsonify({'error': 'Climber not found'}), 404

    query = '''
        SELECT * FROM vw_completed_climbs WHERE climber_id = %s ORDER BY date_recorded DESC
    '''
    scores = create_connection_and_query(query, params=params, fetch_all=True)

    return jsonify({
        'climber': dict(climber),
        'scores': [dict(score) for score in scores]
    })

@routes_blueprint.route('/api/scores/<int:score_id>', methods=['DELETE'])
def delete_score(score_id):
    """Delete a score"""
    query = '''
    DELETE FROM scores WHERE id = %s
    '''
    params = (score_id,)
    print('Deleteing')
    result = create_connection_and_query(query, params=params)

    if(result == 0):
        return jsonify({'error': 'Score not found'}), 404

    return jsonify({'message': 'Score deleted successfully'})

  
@routes_blueprint.route('/api/scores', methods=['POST'])
def add_score():
    """Add a new score/attempt"""
    data = request.get_json()
    
    required_fields = ['climber_id', 'wall_id', 'grade', 'completed', 'attempts']
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': 'Climber ID, route ID, completed status, and attempts are required'}), 400

    query = '''INSERT INTO scores (climber_id, wall_id, grade, completed, attempts, notes) VALUES (%s, %s, %s, %s, %s, %s)'''
    params = (
        data['climber_id'],
        data['wall_id'],
        data['grade'],
        data['completed'],
        data['attempts'],
        data.get('notes', '')
    )
    create_connection_and_query(query, params=params)

    return jsonify({'message': 'Score recorded successfully'}), 201