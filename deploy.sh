#!/bin/bash

# Function to shut down running processes
shutdown_processes() {
  echo "Shutting down processes..."
  pkill -P "$backend_pid"
  pkill -P "$frontend_pid"
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
backend_pid=$!

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
  frontend_pid=$!
fi

# Wait for user input to exit the script
read -r -p "Press any key to stop the script..."

# Remove the lock file when the deployment is complete
rm -f deploy.lock
