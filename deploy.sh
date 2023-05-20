#!/bin/bash

# Check if the lock file exists
if [ -f deploy.lock ]; then
  echo "Deployment is already in progress. Exiting..."
  exit 0
fi

# Create the lock file
touch deploy.lock

# Move to the backend directory
cd back-end

# Install dependencies if package-lock.json has changed
if [ "$(git diff --name-only HEAD~1 package-lock.json)" != "" ]; then
  npm ci
else
  echo "Skipping npm install for backend"
fi

# Build the backend
tsc

# Start the backend server
node dist/index.js &

# Move to the frontend directory
cd ../front-end

# Install dependencies if package-lock.json has changed
if [ "$(git diff --name-only HEAD~1 package-lock.json)" != "" ]; then
  npm ci
else
  echo "Skipping npm install for frontend"
fi

# Start the frontend development server
npm start

# Remove the lock file when the deployment is complete
rm ../deploy.lock
