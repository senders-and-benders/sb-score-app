#!/bin/bash

# Start postgresql server
echo "Starting postgresql server..."
cd setup
pg_ctl -D postgres start

# Start the backend server with virtual environment
echo "Starting backend server with virtual environment..."
cd ../backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start the frontend development server
echo "Starting frontend development server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo "Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    cd ../setup
    pg_ctl -D postgres stop
    exit
}

# Trap Ctrl+C
trap cleanup SIGINT
echo "Both servers are running!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5001"
echo "Press Ctrl+C to stop both servers"

# Wait for any process to exit
wait
