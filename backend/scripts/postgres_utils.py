import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv
import urllib.parse

# Load environment variables from .env file
load_dotenv()

# Database configuration
def get_database_url():
    """Get database URL from environment variables"""
    # Check if DATABASE_URL is provided (for production/Heroku)
    database_url = os.getenv('DATABASE_URL')
    if database_url:
        return database_url
    
    # Fallback to individual environment variables for local development
    db_host = os.getenv('DB_HOST', 'localhost')
    db_port = os.getenv('DB_PORT', '5432')
    db_name = os.getenv('DB_NAME', 'app')
    db_user = os.getenv('DB_USER', 'postgres')
    db_password = os.getenv('DB_PASSWORD', 'password')
    
    return f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

def get_db_connection():
    """Get database connection"""
    database_url = get_database_url()
    
    # Parse the database URL for psycopg2
    parsed = urllib.parse.urlparse(database_url)
    
    conn = psycopg2.connect(
        host=parsed.hostname,
        database=parsed.path[1:],  # Remove leading slash
        user=parsed.username,
        password=parsed.password,
        port=parsed.port or 5432
    )
    
    # Update connection to use the app schema for this app
    with conn.cursor() as cur:
        cur.execute("SET search_path TO app, public;")

    return conn

def get_db_cursor(conn):
    """Get database cursor"""
    return conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

def execute_query(cursor, query, params=None, fetch_one=False, fetch_all=False):
    """
    Helper function to execute database queries

    Takes in a cursor object already so it can be committed in bulk
    """
    cursor.execute(query, params)

    if fetch_one:
        result = cursor.fetchone()
    elif fetch_all:
        result = cursor.fetchall()
    else:
        result = cursor.rowcount
        print('Not counting')
        print(result)
          
    return result

def create_connection_and_query(query, params=None, fetch_one=False, fetch_all=False):
    """
    Create a database connection and execute a query.

    This is mainly used in API endpoints where we execute one thing at a time.
    """
    conn = get_db_connection()
    cursor = get_db_cursor(conn)
    
    result = execute_query(cursor, query, params=params, fetch_one=fetch_one, fetch_all=fetch_all)
    conn.commit()  # Commit changes if any
    
    cursor.close()
    conn.close()
    return result

