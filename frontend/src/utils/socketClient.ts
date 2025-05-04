import { Agent } from 'undici';
import nodeFetch from 'node-fetch';
import * as os from 'os';
import * as path from 'path';

// Platform-specific socket path
const getSocketPath = () => {
  if (os.platform() === 'win32') {
    // On Windows, we default to TCP because Unix sockets aren't natively supported
    return null; // We'll use a regular TCP connection instead
  } else {
    // On Unix systems
    return process.env.SOCKET_PATH || '/tmp/go.sock';
  }
};

/**
 * Fetches data from the Go backend, either via Unix socket or TCP
 */
export const fetchFromBackend = async (apiPath: string) => {
  const socketPath = getSocketPath();

  try {
    if (socketPath) {
      // Unix socket approach (Linux/macOS)
      const agent = new Agent({
        connect: {
          socketPath,
        },
      });

      const response = await nodeFetch(`http://localhost${apiPath}`, {
        // @ts-ignore - Type issue with undici and node-fetch compatibility
        dispatcher: agent,
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      return await response.json();
    } else {
      // TCP fallback for Windows
      const backendUrl = process.env.NODE_ENV === 'production'
        ? `http://backend:8080${apiPath}`
        : `http://localhost:8080${apiPath}`;

      const response = await fetch(backendUrl);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      return await response.json();
    }
  } catch (error) {
    console.error('Error fetching from backend:', error);
    throw error;
  }
};
