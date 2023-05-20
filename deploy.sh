#!/bin/bash

# Check if the lock file exists
if [ -f deploy.lock ]; then
  echo "Deployment is already in progress. Exiting..."
  exit 0
fi

# Create the lock file
touch deploy.lock

git pull origin master

# Move to the backend directory
cd ../back-end

# Install dependencies if node_modules doesn't exist or package-lock.json has changed
if [ ! -d "../back-end/node_modules" ] || [ "$(git diff --name-only HEAD~1 ../back-end/package-lock.json)" != "" ]; then
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

# Install dependencies if node_modules doesn't exist or package-lock.json has changed
if [ ! -d "../front-end/node_modules" ] || [ "$(git diff --name-only HEAD~1 ../front-end/package-lock.json)" != "" ]; then
  npm ci
else
  echo "Skipping npm install for frontend"
fi

# Start the frontend development server
npm start

# Remove the lock file when the deployment is complete
rm deploy.lock
