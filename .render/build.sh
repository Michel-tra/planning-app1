#!/usr/bin/env bash

# Step 1: Build frontend
cd frontend
npm install
npm run build
cd ..

# Step 2: Move build to backend
cp -r frontend/build backend/build

# Step 3: Prepare backend
cd backend
npm install
