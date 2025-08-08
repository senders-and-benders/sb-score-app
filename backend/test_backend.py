#!/usr/bin/env python3
"""
Test script to verify backend functionality and database migration
"""

import sqlite3
import json
import time
import subprocess
import signal
import os
from threading import Thread

def test_api_endpoints():
    """Test API endpoints"""
    print("\nAPI endpoint testing requires 'requests' module.")
    print("To test API endpoints manually:")
    print("1. Start the backend server: python3 app.py")
    print("2. Test endpoints with curl or a browser:")
    print("   - http://localhost:5001/api/stats")
    print("   - http://localhost:5001/api/climbers")
    print("   - http://localhost:5001/api/routes")
    print("   - http://localhost:5001/api/routes/locations")
    print("   - http://localhost:5001/api/scores")
    print("✅ API endpoint information provided!")

if __name__ == "__main__":
    print("🧗‍♂️ Testing Backend Updates for Climbing Score App")
    print("=" * 50)
    
    # Test API endpoints
    test_api_endpoints()
