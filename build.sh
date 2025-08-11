#!/bin/bash
echo "Building frontend"
cd frontend
npm run build

echo "Frontend build complete...Moving frontend build artifacts to backend"
cp -r build ../backend
