from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

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
    
    # Create routes table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS routes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            grade TEXT NOT NULL,
            location TEXT NOT NULL,
            description TEXT,
            date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
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

# Routes endpoints
@app.route('/api/routes', methods=['GET'])
def get_routes():
    """Get all climbing routes"""
    conn = get_db_connection()
    routes = conn.execute('SELECT * FROM routes ORDER BY grade, name').fetchall()
    conn.close()
    
    return jsonify([dict(route) for route in routes])

@app.route('/api/routes', methods=['POST'])
def add_route():
    """Add a new climbing route"""
    data = request.get_json()
    
    required_fields = ['name', 'grade', 'location']
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': 'Name, grade, and location are required'}), 400
    
    conn = get_db_connection()
    
    conn.execute(
        'INSERT INTO routes (name, grade, location, description) VALUES (?, ?, ?, ?)',
        (data['name'], data['grade'], data['location'], data.get('description', ''))
    )
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Route added successfully'}), 201

@app.route('/api/routes/<int:route_id>', methods=['DELETE'])
def delete_route(route_id):
    """Delete a climbing route"""
    conn = get_db_connection()
    
    # First delete all scores for this route
    conn.execute('DELETE FROM scores WHERE route_id = ?', (route_id,))
    
    # Then delete the route
    result = conn.execute('DELETE FROM routes WHERE id = ?', (route_id,))
    
    conn.commit()
    conn.close()
    
    if result.rowcount == 0:
        return jsonify({'error': 'Route not found'}), 404
    
    return jsonify({'message': 'Route deleted successfully'})

# Scores endpoints
@app.route('/api/scores', methods=['GET'])
def get_scores():
    """Get all scores with climber and route info"""
    conn = get_db_connection()
    
    scores = conn.execute('''
        SELECT s.*, c.name as climber_name, r.name as route_name, r.grade
        FROM scores s
        JOIN climbers c ON s.climber_id = c.id
        JOIN routes r ON s.route_id = r.id
        ORDER BY s.date_recorded DESC
    ''').fetchall()
    
    conn.close()
    
    return jsonify([dict(score) for score in scores])

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
