#!/bin/bash
echo "Building frontend"
cd frontend
npm run build

echo "Frontend build complete...Moving frontend build artifacts to backend"
mv build ../backend

echo "Frontend build artifacts moved to backend ...Initialising backend"
cd ../backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo "Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
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
