package main

import (
	"encoding/json"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"time"
)

// Define a simple message response
type MessageResponse struct {
	Message string `json:"message"`
	Source  string `json:"source"`
}

// CORS middleware to allow cross-origin requests
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Call the next handler
		next.ServeHTTP(w, r)
	})
}

// Handler for the basic message endpoint
func messageHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(MessageResponse{
		Message: "Hello from Go over Unix socket",
		Source:  "Go backend",
	})
}

// Handler for status information
func statusHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "running",
		"os":     runtime.GOOS,
		"time":   time.Now().Format(time.RFC3339),
	})
}

func main() {
	// Use a platform-appropriate socket path
	var socketPath string
	if runtime.GOOS == "windows" {
		// On Windows, use a named pipe in the temp directory
		socketPath = filepath.Join(os.TempDir(), "go.sock")
	} else {
		// On Unix systems, use the standard /tmp location
		socketPath = "/tmp/go.sock"
	}

	// Clean up any existing socket
	os.Remove(socketPath)

	// Create the listener based on OS
	var listener net.Listener
	var err error

	if runtime.GOOS == "windows" {
		// Windows doesn't support Unix domain sockets in the same way
		// For Windows, we'll use a regular TCP socket on localhost instead
		listener, err = net.Listen("tcp", "localhost:8080")
		if err != nil {
			panic(err)
		}
		socketPath = "localhost:8080" // Update the path for informational purposes
	} else {
		// Unix domain socket for Linux/macOS
		listener, err = net.Listen("unix", socketPath)
		if err != nil {
			panic(err)
		}
	}

	defer listener.Close()
	println("Go server listening on", socketPath)

	// Register API handlers
	http.HandleFunc("/api/message", messageHandler)
	http.HandleFunc("/api/status", statusHandler)

	// Add CORS headers for all responses
	handler := corsMiddleware(http.DefaultServeMux)

	// Start server
	http.Serve(listener, handler)
}
