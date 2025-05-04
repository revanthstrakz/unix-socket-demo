# Unix Socket Demo: Next.js + Go

This project demonstrates communication between a Next.js frontend and a Go backend using Unix domain sockets (with TCP fallback for Windows).

## Architecture

- **Go Backend**: Serves API responses over Unix socket (Linux/macOS) or TCP socket (Windows)
- **Next.js Frontend**: Server-side renders content by fetching data from the Go backend via the socket

## Features

- Fast and secure local communication using Unix domain sockets
- Platform-aware implementation that works on Linux, macOS, and Windows
- Docker setup for development and production
- TypeScript and Go for type safety

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Go 1.18+
- Docker and Docker Compose (optional, for containerized setup)

### Running Locally

1. Start the Go backend:

```bash
cd backend
go run main.go
```

2. In a separate terminal, start the Next.js frontend:

```bash
cd frontend
npm install
npm run dev
```

3. Visit http://localhost:3000 to see the application

### Using Docker

To run both services together with Docker Compose:

```bash
docker-compose up --build
```

This will:
- Build and start the Go backend
- Build and start the Next.js frontend
- Set up shared volume for Unix socket communication
- Expose the Next.js app on port 3000

## How It Works

1. The Go server listens on a Unix socket (or TCP socket on Windows)
2. The Next.js server uses `node-fetch` with a custom agent to connect to the Unix socket
3. Server-side rendering fetches data from the Go backend during page generation
4. The pre-rendered page is served to the client

## Platform Compatibility

- **Linux/macOS**: Full Unix socket implementation for maximum performance
- **Windows**: Falls back to TCP socket for compatibility
