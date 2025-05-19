import { Server } from "socket.io"
import type { NextApiRequest } from "next"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const ioHandler = (req: NextApiRequest, res: any) => {
  // Check if Socket.io server is already initialized
  if (!res.socket.server.io) {
    console.log("Initializing Socket.io server...")

    const httpServer = res.socket.server

    // Create a new Socket.io server with more permissive CORS settings
    const io = new Server(httpServer, {
      path: "/api/socketio", // Match the path in the client
      cors: {
        origin: "*", // Allow all origins in development
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket", "polling"], // Support both WebSocket and polling
    })

    // Socket.io event handlers
    io.on("connection", (socket) => {
      console.log(`Socket ${socket.id} connected`)

      // Send an immediate welcome message to confirm connection
      socket.emit("welcome", {
        message: "Connected to Socket.io server",
        socketId: socket.id,
        timestamp: new Date().toISOString(),
      })

      // Test message handler
      socket.on("test-message", (data) => {
        console.log(`Received test message from ${socket.id}:`, data)

        // Send a response back
        socket.emit("test-response", {
          message: "Hello from server! Your connection is working properly.",
          receivedMessage: data.message,
          timestamp: new Date().toISOString(),
        })
      })

      socket.on("disconnect", () => {
        console.log(`Socket ${socket.id} disconnected`)
      })
    })

    // Store the Socket.io server instance
    res.socket.server.io = io

    console.log("Socket.io server initialized")
  } else {
    console.log("Socket.io server already initialized")
  }

  return NextResponse.json({ success: true, message: "Socket.io server running" })
}

export { ioHandler as GET, ioHandler as POST }
