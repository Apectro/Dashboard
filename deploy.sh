#!/bin/bash

# Check if the lock file exists
if [ -f deploy.lock ]; then
  echo "Deployment is already in progress. Checking if it's active..."

  # Check if the previous deployment is still running
  previous_pid=$(cat deploy.lock)
  if ps -p "$previous_pid" > /dev/null; then
    echo "Previous deployment is still active. Exiting..."
    exit 0
  else
    echo "Previous deployment is not active. Cleaning up the lock file..."
    rm deploy.lock
  fi
fi

# Create the lock file
echo "$$" > deploy.lock

# Function to shut down running processes
shutdown_processes() {
  echo "Shutting down processes..."
  pkill -f "node dist/index.js"
  pkill -f "npm start"
}

# Trap the script exit to ensure processes are shut down
trap shutdown_processes EXIT

# Move to the backend directory
cd back-end

# Install dependencies if node_modules doesn't exist or package-lock.json has changed
if [ ! -d "../back-end/node_modules" ] || [ "$(git diff --name-only HEAD~1 ../back-end/package-lock.json)" != "" ]; then
  npm install
else
  echo "Skipping npm install for backend"
fi

# Build the backend
tsc

# Start the backend server in the background
node dist/index.js &

# Move to the frontend directory
cd ../front-end

# Check if the front-end server is already running
if pgrep -f "npm start" >/dev/null; then
  echo "Front-end server is already running. Skipping npm start."
else
  # Install dependencies if node_modules doesn't exist or package-lock.json has changed
  if [ ! -d "../front-end/node_modules" ] || [ "$(git diff --name-only HEAD~1 ../front-end/package-lock.json)" != "" ]; then
    npm install
  else
    echo "Skipping npm install for frontend"
  fi

  # Start the frontend development server in the background
  npm start &
fi

# Wait for user input to exit the script
read -r -p "Press any key to stop the script..."

# Remove the lock file when the deployment is complete
rm deploy.lock
