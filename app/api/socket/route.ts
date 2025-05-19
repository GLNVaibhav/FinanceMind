import { Server } from "socket.io"
import type { NextApiRequest } from "next"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const ioHandler = (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    const path = "/api/socket"
    const httpServer = res.socket.server

    const io = new Server(httpServer, {
      path,
      addTrailingSlash: false,
      cors: {
        origin: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_SOCKET_URL : "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    })

    // Socket.io event handlers
    io.on("connection", (socket) => {
      console.log(`Socket ${socket.id} connected`)

      // Test message handler
      socket.on("test-message", (data) => {
        console.log(`Received test message from ${socket.id}:`, data)

        // Send a response back
        setTimeout(() => {
          socket.emit("test-response", {
            message: "Hello from server! Your connection is working properly.",
            receivedMessage: data.message,
            timestamp: new Date().toISOString(),
          })
        }, 1000) // Small delay to simulate processing
      })

      // Handle financial data updates
      socket.on("join-dashboard", (userId) => {
        socket.join(`user-${userId}`)
        console.log(`User ${userId} joined dashboard room`)
      })

      socket.on("join-financial-room", (companyId) => {
        socket.join(`financial-${companyId}`)
        console.log(`Socket joined financial room for company ${companyId}`)
      })

      socket.on("disconnect", () => {
        console.log(`Socket ${socket.id} disconnected`)
      })
    })

    res.socket.server.io = io
  }

  return NextResponse.json({ success: true })
}

export { ioHandler as GET, ioHandler as POST }
