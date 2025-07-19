#!/bin/bash

# BoneHealth AI Backend Monitoring Script
# This script monitors the backend service and restarts it if it's down

BACKEND_URL="http://localhost:8000/docs"
LOG_FILE="/var/log/bonehealth-ai/monitor.log"
PID_FILE="/var/run/bonehealth-ai.pid"
RESTART_SCRIPT="/home/threatseal/projects/bonehealth_ai/bonehealth_ai/backend/start_server.sh"

# Create log directory if it doesn't exist
mkdir -p /var/log/bonehealth-ai

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Function to check if backend is running
check_backend() {
    if curl -f -s "$BACKEND_URL" > /dev/null 2>&1; then
        return 0  # Backend is running
    else
        return 1  # Backend is down
    fi
}

# Function to start backend
start_backend() {
    log_message "Starting BoneHealth AI backend..."
    nohup "$RESTART_SCRIPT" > /var/log/bonehealth-ai/backend.log 2>&1 &
    echo $! > "$PID_FILE"
    sleep 5  # Wait for startup
}

# Function to stop backend
stop_backend() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if kill -0 "$PID" 2>/dev/null; then
            log_message "Stopping backend process $PID"
            kill "$PID"
            rm -f "$PID_FILE"
        fi
    fi
}

# Main monitoring loop
log_message "Starting BoneHealth AI backend monitor"

while true; do
    if check_backend; then
        log_message "Backend is running - OK"
    else
        log_message "Backend is down - attempting restart"
        stop_backend
        start_backend
        
        # Check if restart was successful
        sleep 10
        if check_backend; then
            log_message "Backend restart successful"
        else
            log_message "Backend restart failed"
        fi
    fi
    
    # Wait before next check
    sleep 60
done 