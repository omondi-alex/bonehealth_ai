#!/bin/bash

# BoneHealth AI Backend Server Startup Script
# This script ensures the FastAPI backend is running for predictions

# Set the working directory to the backend folder
cd "$(dirname "$0")"

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
elif [ -d "../.venv" ]; then
    echo "Activating project virtual environment..."
    source ../.venv/bin/activate
fi

# Check if required packages are installed
echo "Checking dependencies..."
python -c "import fastapi, uvicorn, pandas, sklearn, shap" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Installing required packages..."
    pip install -r ../requirements.txt
fi

# Set environment variables
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
export PORT=${PORT:-8000}
export HOST=${HOST:-"0.0.0.0"}

echo "Starting BoneHealth AI Backend Server..."
echo "Host: $HOST"
echo "Port: $PORT"
echo "API will be available at: http://$HOST:$PORT"
echo "API Documentation: http://$HOST:$PORT/docs"

# Start the server
python -m uvicorn api:app --host $HOST --port $PORT --workers 1 --log-level info 