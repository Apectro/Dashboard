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

# Install dependencies
npm install

# Build the backend
tsc

# Start the backend server
node dist/index.js &

# Move to the frontend directory
cd ../front-end

# Install dependencies
npm install

# Start the frontend development server
npm start

# Remove the lock file when the deployment is complete
rm ../deploy.lock
