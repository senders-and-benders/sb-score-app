from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime
import csv

app = Flask(__name__, static_folder='build', static_url_path='')
CORS(app)

# Database configuration
DATABASE = 'climbing_scores.db'

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def get_create_table_script(table_name):
    """Creates inital table structure from a file"""
    #Open SQL file
    with open(f'./table_loaders/{table_name}.sql', 'r') as file:
        return file.read()

def get_initial_table_data(table_name):
    """Get initial data for a table from a CSV file"""
    with open(f'./table_loaders/{table_name}.csv', newline='') as data_file:
        data_reader = csv.DictReader(data_file)
        return [row for row in data_reader]

def get_view_script(view_name):
    """Create database views"""
    with open(f'./views/{view_name}.sql', 'r') as file:
        query = file.read()
    
    create_view_query = f'''
    CREATE VIEW IF NOT EXISTS {view_name} AS
    {query};
    '''
    return create_view_query

def init_db():
    """Initialize database with tables"""
    conn = get_db_connection()
    
    # Create tables if they don't exist
    conn.execute(get_create_table_script('climbers'))
    conn.execute(get_create_table_script('grades'))
    conn.execute(get_create_table_script('gyms'))
    conn.execute(get_create_table_script('gym_areas'))
    conn.execute(get_create_table_script('walls'))
    conn.execute(get_create_table_script('scores'))
    conn.commit()

    # Insert data if there is no existing data
    #Climbers 
    climbers_count = conn.execute('SELECT COUNT(*) as count FROM climbers').fetchone()['count']  # Clear existing data
    if(climbers_count == 0):
        climber_data = get_initial_table_data('climbers')
        for climber in climber_data:
            conn.execute(
                '''
                INSERT INTO climbers (name, email)
                VALUES (?, ?)
                ''',
                (climber['name'], climber['email'])
            )

    # Grades table
    grades_count = conn.execute('SELECT COUNT(*) as count FROM grades').fetchone()['count']  # Clear existing data
    if(grades_count == 0):
        grade_data = get_initial_table_data('grades')
        for grade in grade_data:
            conn.execute(
                '''
                INSERT INTO grades (climbType, grade)
                VALUES (?, ?)
                ''',
                (grade['climb_type'], grade['grade'])
            )

    # Gyms table
    gym_count = conn.execute('SELECT COUNT(*) as count FROM gyms').fetchone()['count']  # Clear existing data
    if(gym_count == 0):
        gym_data = get_initial_table_data('gyms')
        for gym in gym_data:
            conn.execute(
                '''
                INSERT INTO gyms (id, gymName)
                VALUES (?, ?)
                ''',
                (gym['gym_id'], gym['gym_name'])
            )

    # Gym Areas table
    gym_area_count = conn.execute('SELECT COUNT(*) as count FROM gym_areas').fetchone()['count']  # Clear existing data
    if(gym_area_count == 0):
        gym_area_data = get_initial_table_data('gym_areas')
        for gym_area in gym_area_data:
            conn.execute(
                '''
                INSERT INTO gym_areas (id, gym_id, areaName)
                VALUES (?, ?, ?)
                ''',
                (gym_area['id'], gym_area['gym_id'], gym_area['area_name'])
            )

    # Walls table
    walls_count = conn.execute('SELECT COUNT(*) as count FROM walls').fetchone()['count']  # Clear existing data
    if(walls_count == 0):
        # Read grades.csv
        wall_data = get_initial_table_data('walls')
        for wall in wall_data:
            conn.execute(
                '''
                INSERT INTO walls (gym_id, gym_area_id, wallName, climbType)
                VALUES (?, ?, ?, ?)
                ''',
                (
                    wall.get('gym_id', ''),
                    wall.get('gym_area_id', ''),
                    wall.get('wall_name', ''),
                    wall.get('climb_type', ''),
                )
            )

    # Scores table
    scores_count = conn.execute('SELECT COUNT(*) as count FROM scores').fetchone()['count']  # Clear existing data
    if(scores_count == 0):
        score_data = get_initial_table_data('scores')
        for score in score_data:
            conn.execute(
                '''
                INSERT INTO scores (climber_id, wall_id, grade, completed, attempts, notes)
                VALUES (?, ?, ?, ?, ?, ?)
                ''',
                (
                    score['climber_id'],
                    score['wall_id'],
                    score['grade'],
                    score['completed'],
                    score['attempts'],
                    score['notes']
                )
            )

    #Initiate and create all views
    for root, _, files in os.walk('./views'):
        for file in files:
            if file.endswith('.sql'):
                view_name = file.replace('.sql','')
                conn.execute(f'DROP VIEW IF EXISTS {view_name}')
                conn.execute(get_view_script(view_name))

    conn.commit()
    conn.close()

# API Routes
@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get dashboard statistics"""
    conn = get_db_connection()
    
    total_climbers = conn.execute('SELECT COUNT(*) as count FROM climbers').fetchone()['count']
    total_walls = conn.execute('SELECT COUNT(*) as count FROM walls').fetchone()['count']
    total_ascents = conn.execute('SELECT COUNT(*) as count FROM scores WHERE completed = 1').fetchone()['count']
    
    conn.close()
    
    return jsonify({
        'totalClimbers': total_climbers,
        'totalWalls': total_walls,
        'totalAscents': total_ascents
    })

# Climbers endpoints
@app.route('/api/climbers', methods=['GET'])
def get_climbers():
    """Get all climbers with their scores"""
    conn = get_db_connection()
    
    climbers = conn.execute('''
        SELECT c.*, 
               COALESCE(SUM(CASE WHEN s.completed = 1 THEN 1 ELSE 0 END), 0) as total_score
        FROM climbers c
        LEFT JOIN scores s ON c.id = s.climber_id
        GROUP BY c.id, c.name, c.email, c.date_created
        ORDER BY total_score DESC, c.name
    ''').fetchall()
    
    conn.close()
    
    return jsonify([dict(climber) for climber in climbers])

@app.route('/api/climbers', methods=['POST'])
def add_climber():
    """Add a new climber"""
    data = request.get_json()
    
    if not data or 'name' not in data or 'email' not in data:
        return jsonify({'error': 'Name and email are required'}), 400
    
    conn = get_db_connection()
    
    try:
        conn.execute(
            'INSERT INTO climbers (name, email) VALUES (?, ?)',
            (data['name'], data['email'])
        )
        conn.commit()
        conn.close()
        return jsonify({'message': 'Climber added successfully'}), 201
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'error': 'Email already exists'}), 400

@app.route('/api/climbers/<int:climber_id>', methods=['DELETE'])
def delete_climber(climber_id):
    """Delete a climber"""
    conn = get_db_connection()
    
    # First delete all scores for this climber
    conn.execute('DELETE FROM scores WHERE climber_id = ?', (climber_id,))
    
    # Then delete the climber
    result = conn.execute('DELETE FROM climbers WHERE id = ?', (climber_id,))
    
    conn.commit()
    conn.close()
    
    if result.rowcount == 0:
        return jsonify({'error': 'Climber not found'}), 404
    
    return jsonify({'message': 'Climber deleted successfully'})

# Gyms endpoints
@app.route('/api/gyms', methods=['GET'])
def get_all_gyms():
    """Get all gyms"""
    conn = get_db_connection()
    gyms = conn.execute('SELECT * FROM gyms ORDER BY gymName').fetchall()
    conn.close()
    
    return jsonify([dict(gym) for gym in gyms])

@app.route('/api/gym/<int:gym_id>/areas', methods=['GET'])
def get_gym_areas(gym_id):
    """Get all areas for a specific gym"""
    conn = get_db_connection()
    query = f'''
    SELECT 
        ga.id,
        ga.areaName
    FROM gym_areas ga
    WHERE ga.gym_id = {gym_id}
    '''
    areas = conn.execute(query).fetchall()
    conn.close()
    return jsonify([dict(area) for area in areas])

@app.route('/api/gym/<int:gym_id>/walls')
def get_gym_routes(gym_id):
    """Get all routes for a specific gym"""
    conn = get_db_connection()
    query = f'''
    SELECT 
        w.id,
        ga.areaName,
        w.wallName,
        w.climbType
    FROM walls w
    JOIN gym_areas ga ON w.gym_area_id = ga.id
    WHERE w.gym_id = {gym_id}
    '''
    routes = conn.execute(query).fetchall()
    conn.close()
    return jsonify([dict(route) for route in routes])

#Gym Area Endpoints
@app.route('/api/gym_areas', methods=['GET'])
def get_all_gym_areas():
    """Get all gym areas"""
    conn = get_db_connection()
    query = '''
    SELECT 
        ga.id,
        g.gymName,
        ga.areaName
    FROM gym_areas ga 
    JOIN gyms g ON ga.gym_id = g.id
    ORDER BY areaName
    '''
    areas = conn.execute(query).fetchall()
    conn.close()
    return jsonify([dict(area) for area in areas])

@app.route('/api/gym_area/<int:gym_area_id>/walls', methods=['GET'])
def get_gym_area_walls(gym_area_id):
    """Get all walls for a specific gym area"""
    conn = get_db_connection()
    query = '''
    SELECT 
        w.id,
        w.wallName,
        w.climbType
    FROM walls w
    WHERE w.gym_area_id = ?
    '''
    walls = conn.execute(query, (gym_area_id,)).fetchall()
    conn.close()
    return jsonify([dict(wall) for wall in walls])

#Walls endpoints
@app.route('/api/walls', methods=['GET'])
def get_all_walls():
    """Get all walls"""
    conn = get_db_connection()
    query = '''
    SELECT 
        w.id,
        g.gymName,
        ga.areaName,
        w.wallName,
        w.climbType
    FROM walls w 
    JOIN gym_areas ga ON w.gym_area_id = ga.id
    JOIN gyms g ON ga.gym_id = g.id
    ORDER BY wallName
    '''
    walls = conn.execute(query).fetchall()
    conn.close()
    return jsonify([dict(wall) for wall in walls])

@app.route('/api/wall/<int:wall_id>/grades', methods=['GET'])
def get_wall_grades(wall_id):
    """Get available grades for a wall"""
    conn = get_db_connection()
    query = f'''
    SELECT 
        g.id as grade_id,
        w.climbType,
        g.grade
    FROM walls w
    JOIN grades g ON w.climbType = g.climbType
    WHERE w.id = {wall_id}
    ORDER BY g.id
    '''
    grades = conn.execute(query).fetchall()
    conn.close()
    return jsonify([dict(grade) for grade in grades])

# Grade endpoints
@app.route('/api/grades', methods=['GET'])
def get_grades():
    """Get all grades"""
    conn = get_db_connection()
    grades = conn.execute('SELECT * FROM grades ORDER BY climbType, grade').fetchall()
    conn.close()
    return jsonify([dict(grade) for grade in grades])

# Score endpoints
@app.route('/api/scores', methods=['GET'])
def get_all_scores():
    """Get all scores with climber and wall info"""
    conn = get_db_connection()
    scores = conn.execute('SELECT * FROM vw_completed_climbs ORDER BY dateRecorded DESC').fetchall()
    conn.close()
    
    return jsonify([dict(score) for score in scores])

@app.route('/api/scores/climber/<int:climber_id>', methods=['GET'])
def get_climber_scores(climber_id):
    """Get scores for a specific climber"""
    conn = get_db_connection()
    
    # First check if climber exists
    climber = conn.execute('SELECT * FROM climbers WHERE id = ?', (climber_id,)).fetchone()
    if not climber:
        conn.close()
        return jsonify({'error': 'Climber not found'}), 404

    scores = conn.execute('''
        SELECT * FROM vw_completed_climbs WHERE climber_id = ? ORDER BY dateRecorded DESC
        ''', (climber_id,)).fetchall()

    conn.close()
    
    return jsonify({
        'climber': dict(climber),
        'scores': [dict(score) for score in scores]
    })

@app.route('/api/scores/<int:score_id>', methods=['DELETE'])
def delete_score(score_id):
    """Delete a score"""
    conn = get_db_connection()
    
    result = conn.execute('DELETE FROM scores WHERE id = ?', (score_id,))
    conn.commit()
    conn.close()
    
    if result.rowcount == 0:
        return jsonify({'error': 'Score not found'}), 404
    
    return jsonify({'message': 'Score deleted successfully'})

@app.route('/api/scores', methods=['POST'])
def add_score():
    """Add a new score/attempt"""
    data = request.get_json()
    
    required_fields = ['climber_id', 'wall_id', 'grade', 'completed', 'attempts']
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': 'Climber ID, route ID, completed status, and attempts are required'}), 400
    
    conn = get_db_connection()
    
    conn.execute(
        'INSERT INTO scores (climber_id, wall_id, grade, completed, attempts, notes) VALUES (?, ?, ?, ?, ?, ?)',
        (data['climber_id'], data['wall_id'], data['grade'], data['completed'], data['attempts'], data.get('notes', ''))
    )
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Score recorded successfully'}), 201


# Serve React app for all other routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        # For SPA routes, always serve index.html
        return send_from_directory(app.static_folder, 'index.html')


# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Initialize database on startup
    init_db()

    # Run the app
    app.run(debug=True, host='0.0.0.0', port=5001)
