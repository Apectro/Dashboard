#!/bin/bash

# Move to the backend directory
cd back-end

# Install dependencies
npm ci

# Build the backend
tsc

# Start the backend server
node dist/index.js

# Move to the frontend directory
cd ../front-end

# Install dependencies
npm ci

# Start the frontend development server
npm start
