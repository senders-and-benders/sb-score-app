from flask import Flask, send_from_directory
from flask_cors import CORS
import os
import csv

from scripts.api_routes import routes_blueprint
from scripts.postgres_utils import get_db_connection, get_db_cursor, execute_query

#Initiate app variable and set routes defined elsewhere
app = Flask(__name__, static_folder='build', static_url_path='')
app.register_blueprint(routes_blueprint)
CORS(app)

#Helper functions useful for the main app
def create_views_from_sql(conn, view_name):
    """Create database views from sql files"""
    cursor = get_db_cursor(conn)

    with open(f'./sql/views/{view_name}.sql', 'r') as file:
        view_query = file.read()
        create_view_query = f'CREATE VIEW {view_name} AS {view_query}'
        drop_view_query = f'DROP VIEW IF EXISTS {view_name}'

    #Execute using drop first then recreate
    execute_query(cursor, drop_view_query)
    execute_query(cursor, create_view_query)
    print(f'Created view: {view_name}')
    
    conn.commit()
    cursor.close()


def create_table_from_sql(conn, table_name):
    """Retrieve the script for create table and create it"""
    #Open SQL file
    with open(f'./sql/table_loaders/{table_name}.sql', 'r') as file:
        create_sql_query = file.read()

    # Execute query
    cursor = get_db_cursor(conn)
    execute_query(cursor, create_sql_query)
    conn.commit()
    cursor.close()


def insert_data_from_csv(conn, table_name):
    """Insert initial data into a table from a CSV file"""
    cursor = get_db_cursor(conn)

    row_count = execute_query(cursor, f'SELECT * FROM {table_name}')
    if row_count == 0:
        print(f'Inserting initial data into {table_name}...')
        
        #Get data
        with open(f'./sql/table_loaders/{table_name}.csv', newline='') as data_file:
            data_reader = csv.DictReader(data_file)
            data = [row for row in data_reader]

        #Insert
        for row in data:
            # Construct query
            columns = ', '.join(row.keys())
            placeholders = ', '.join(['%s'] * len(row))
            query = f'INSERT INTO {table_name} ({columns}) VALUES ({placeholders})'
            
            #Get insert values
            params = list(row.values())
            
            #Execute
            row_count = execute_query(cursor, query, params=params)
        
        print(f'Inserted {len(data)} rows into {table_name}')
        #Commit changes
        conn.commit()

    #Close cursor
    cursor.close()

    return row_count

# Main script
def init_db():
    """Initialize database with tables"""
    print('Initialising DB')
    conn = get_db_connection()

    tables = ['climbers', 'grades', 'gyms', 'gym_areas', 'walls', 'scores']

    try:
        print('Creating tables...')
        for table_name in tables:
            print(f'Creating {table_name}...')
            create_table_from_sql(conn, table_name)

        for table_name in tables:
            print(f'Inserting initial data into {table_name}...')
            insert_data_from_csv(conn, table_name)

        #Initiate and create all views
        print('Creating views...')
        create_views_from_sql(conn, 'vw_completed_climbs')
    
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

# Serve React app for all other routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        # For SPA routes, always serve index.html
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # Initialize database on startup
    init_db()

    # Print all registered routes
    print('Printing out all API endpoints for reference')
    for rule in app.url_map.iter_rules():
        print(rule.endpoint, rule.rule, list(rule.methods))

    # Run the app
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=True, host='0.0.0.0', port=port)
