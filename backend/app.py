from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime
import csv

app = Flask(__name__)
CORS(app)

# Database configuration
DATABASE = 'climbing_scores.db'

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database with tables"""
    conn = get_db_connection()
    
    # Create climbers table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS climbers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Create gyms table with schema
    conn.execute('''
        CREATE TABLE IF NOT EXISTS gyms (
            id INTEGER PRIMARY KEY,
            gymName TEXT NOT NULL
        )
    ''')
    # Insert data into gyms table
    gym_count = conn.execute('SELECT COUNT(*) as count FROM gyms').fetchone()['count']  # Clear existing data
    if(gym_count == 0):
        with open('./data/gyms.csv', newline='') as gyms_file:
            gyms_reader = csv.DictReader(gyms_file)
            gyms = [row for row in gyms_reader]
            for gym in gyms:
                conn.execute(
                    '''
                    INSERT INTO gyms (id, gymName)
                    VALUES (?, ?)
                    ''',
                    (gym['gym_id'], gym['gym_name'])
                )

    # Create routes table with updated schema
    conn.execute('''
        CREATE TABLE IF NOT EXISTS routes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            gym_id INTEGER NOT NULL,
            areaName TEXT NOT NULL,
            wallName TEXT NOT NULL,
            climbType TEXT NOT NULL,
            grade TEXT NOT NULL,
            date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (gym_id) REFERENCES gyms (id)
        )
    ''')

    # Insert joined data from grades.csv and gym_walls.csv into routes table
    routes_count = conn.execute('SELECT COUNT(*) as count FROM routes').fetchone()['count']  # Clear existing data
    if(routes_count == 0):
        # Read grades.csv
        with open('./data/grades.csv', newline='') as grades_file:
            grades_reader = csv.DictReader(grades_file)
            grades = [row for row in grades_reader]

        # Read gym_walls.csv
        with open('./data/gym_walls.csv', newline='') as walls_file:
            walls_reader = csv.DictReader(walls_file)
            walls = [row for row in walls_reader]

        # Join grades and gym walls by climbType (assuming both have 'climbType' column)
        for wall in walls:
            for grade in grades:
                if wall.get('climb_type') == grade.get('climb_type'):
                    conn.execute(
                        '''
                        INSERT INTO routes (gym_id, areaName, wallName, climbType, grade)
                        VALUES (?, ?, ?, ?, ?)
                        ''',
                        (
                            wall.get('gym_id', ''),
                            wall.get('area_name', ''),
                            wall.get('wall_name', ''),
                            wall.get('climb_type', ''),
                            grade.get('grade', '')
                        )
                    )
    
    # Create scores table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            climber_id INTEGER NOT NULL,
            route_id INTEGER NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT 0,
            attempts INTEGER NOT NULL DEFAULT 1,
            notes TEXT,
            date_recorded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (climber_id) REFERENCES climbers (id),
            FOREIGN KEY (route_id) REFERENCES routes (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# API Routes
@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get dashboard statistics"""
    conn = get_db_connection()
    
    total_climbers = conn.execute('SELECT COUNT(*) as count FROM climbers').fetchone()['count']
    total_routes = conn.execute('SELECT COUNT(*) as count FROM routes').fetchone()['count']
    total_ascents = conn.execute('SELECT COUNT(*) as count FROM scores WHERE completed = 1').fetchone()['count']
    
    conn.close()
    
    return jsonify({
        'totalClimbers': total_climbers,
        'totalRoutes': total_routes,
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
def get_gyms():
    """Get all gyms"""
    conn = get_db_connection()
    gyms = conn.execute('SELECT * FROM gyms ORDER BY gymName').fetchall()
    conn.close()
    
    return jsonify([dict(gym) for gym in gyms])

@app.route('/api/routes', methods=['GET'])
def get_routes():
    """Get all climbing routes"""
    conn = get_db_connection()
    query = '''
        SELECT 
            r.id, 
            g.gymName, 
            r.areaName, 
            r.wallName, 
            r.climbType, 
            r.grade
        FROM routes r
        LEFT JOIN gyms g ON r.gym_id = g.id
       ORDER BY r.grade, g.gymName, r.wallName
    '''

    routes = conn.execute(query).fetchall()
    conn.close()
    
    return jsonify([dict(route) for route in routes])

@app.route('/api/routes/locations/<int:gym_id>', methods=['GET'])
def get_routes_by_gym(gym_id):
    """Get all routes for a specific gym"""
    conn = get_db_connection()
    routes = conn.execute(
        '''
        SELECT r.id, r.areaName, r.wallName, r.climbType, r.grade
        FROM routes r
        WHERE r.gym_id = ?
        ORDER BY r.grade, r.wallName
        ''',
        (gym_id,)
    ).fetchall()
    conn.close()
    return jsonify([dict(route) for route in routes])

# Get scores
# Setup base query
base_score_query = ''' 
SELECT 
    s.*, 
    c.name as climberName, 
    g.gymName, 
    r.wallName, 
    r.grade
FROM scores s
JOIN climbers c ON s.climber_id = c.id
JOIN routes r ON s.route_id = r.id
JOIN gyms g ON r.gym_id = g.id
'''

@app.route('/api/scores', methods=['GET'])
def get_scores():
    """Get all scores with climber and route info"""
    conn = get_db_connection()
    scores = conn.execute(f'''
        {base_score_query}
        ORDER BY s.date_recorded DESC
    ''').fetchall()
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
    
    scores = conn.execute(f'''
        {base_score_query}
        WHERE s.climber_id = {climber_id}
        ORDER BY s.date_recorded DESC
    ''').fetchall()
    
    conn.close()
    
    return jsonify({
        'climber': dict(climber),
        'scores': [dict(score) for score in scores]
    })

@app.route('/api/scores', methods=['POST'])
def add_score():
    """Add a new score/attempt"""
    data = request.get_json()
    
    required_fields = ['climber_id', 'route_id', 'completed', 'attempts']
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': 'Climber ID, route ID, completed status, and attempts are required'}), 400
    
    conn = get_db_connection()
    
    conn.execute(
        'INSERT INTO scores (climber_id, route_id, completed, attempts, notes) VALUES (?, ?, ?, ?, ?)',
        (data['climber_id'], data['route_id'], data['completed'], data['attempts'], data.get('notes', ''))
    )
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Score recorded successfully'}), 201

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
