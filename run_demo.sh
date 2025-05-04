#!/bin/bash
# Script to run the Unix Socket Demo

echo "=== Unix Socket Demo Setup ==="
echo

# Check if Go is installed
if ! command -v go &> /dev/null; then
    echo "Error: Go is not installed or not in PATH"
    echo "Please install Go from https://golang.org/dl/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Clean up existing socket if it exists
if [ -e "/tmp/go.sock" ]; then
    echo "Removing existing socket..."
    rm /tmp/go.sock
fi

# Start the Go backend in the background
echo "Starting Go backend..."
(cd backend && go run main.go) &
GO_PID=$!

# Give the backend a moment to start
echo "Waiting for backend to initialize..."
sleep 3

# Install frontend dependencies if needed
echo "Checking frontend dependencies..."
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    (cd frontend && npm install)
fi

# Start the Next.js frontend
echo "Starting Next.js frontend..."
cd frontend && npm run dev

# Clean up on exit
trap "kill $GO_PID" EXIT
