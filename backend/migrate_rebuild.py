#!/usr/bin/env python3
"""
Migration Script: Drop and Rebuild Tables
Description: Drops gym_areas, scores, and walls tables (cascaded), 
             runs init_db.py, and inserts dummy scores data.
"""

import os
import sys
from scripts.postgres_utils import get_db_connection, get_db_cursor, execute_query
from init_db import init_db as init_db_main

def drop_tables_cascaded(conn):
    """Drop the specified tables with CASCADE to handle dependencies"""
    tables_to_drop = ['gym_areas', 'scores', 'walls']
    
    cursor = get_db_cursor(conn)
    
    print("🗑️  Dropping tables...")
    for table in tables_to_drop:
        drop_query = f"DROP TABLE IF EXISTS {table} CASCADE"
        try:
            execute_query(cursor, drop_query)
            print(f"   ✓ Dropped table: {table}")
        except Exception as e:
            print(f"   ❌ Error dropping table {table}: {e}")
    
    conn.commit()
    cursor.close()

def insert_dummy_scores(conn):
    """Insert dummy scores from the SQL file"""
    dummy_scores_file = './sql/dummy_inserts/dummy_value_scores.sql'
    
    if not os.path.exists(dummy_scores_file):
        print(f"❌ Dummy scores file not found: {dummy_scores_file}")
        return False
    
    print("📊 Inserting dummy scores...")
    
    try:
        with open(dummy_scores_file, 'r') as file:
            sql_content = file.read()
        
        cursor = get_db_cursor(conn)
        
        # Split the file into individual statements (simple approach)
        # Remove comments and empty lines
        statements = []
        current_statement = ""
        
        for line in sql_content.split('\n'):
            line = line.strip()
            # Skip comments and empty lines
            if line.startswith('--') or not line:
                continue
            
            current_statement += line + " "
            
            # If line ends with semicolon, it's the end of a statement
            if line.endswith(';'):
                statements.append(current_statement.strip())
                current_statement = ""
        
        # Execute each statement
        for statement in statements:
            if statement:
                execute_query(cursor, statement)
                print(f"   ✓ Executed statement")
        
        conn.commit()
        cursor.close()
        print("   ✅ Dummy scores inserted successfully")
        return True
        
    except Exception as e:
        print(f"   ❌ Error inserting dummy scores: {e}")
        conn.rollback()
        return False

def main():
    """Main migration function"""
    print("🚀 Starting migration: Drop tables, rebuild, and insert dummy data")
    print("=" * 60)
    
    try:
        # Get database connection
        conn = get_db_connection()
        
        # Step 1: Drop tables (cascaded)
        print("\n📋 Step 1: Dropping tables with CASCADE...")
        drop_tables_cascaded(conn)
        
        # Step 2: Run init_db.py
        print("\n📋 Step 2: Running init_db.py to rebuild database...")
        try:
            init_db_main()
            print("   ✅ Database initialization completed")
        except Exception as e:
            print(f"   ❌ Error running init_db: {e}")
            return False
        
        # Step 3: Insert dummy scores
        print("\n📋 Step 3: Inserting dummy scores...")
        if not insert_dummy_scores(conn):
            return False
        
        # Close connection
        conn.close()
        
        print("\n" + "=" * 60)
        print("🎉 Migration completed successfully!")
        print("   • Tables dropped: gym_areas, scores, walls")
        print("   • Database reinitialized")
        print("   • Dummy scores inserted")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
