"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export const useSocket = () => {
  return useContext(SocketContext)
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // For Next.js preview environments, we need to use the current window location
    // rather than the environment variable which might not be set correctly
    const socketUrl = window.location.origin
    console.log("Attempting to connect to socket server at:", socketUrl)

    // Create socket connection with more forgiving options
    const socketInstance = io(socketUrl, {
      path: "/api/socketio", // Changed path to avoid conflicts
      transports: ["websocket", "polling"], // Try websocket first, then polling
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      forceNew: true, // Force a new connection
    })

    // Socket event listeners
    socketInstance.on("connect", () => {
      setIsConnected(true)
      console.log("Socket connected with ID:", socketInstance.id)
    })

    socketInstance.on("disconnect", (reason) => {
      setIsConnected(false)
      console.log("Socket disconnected:", reason)
    })

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message)

      // If we're in development, provide more helpful error messages
      if (process.env.NODE_ENV === "development") {
        console.log("Socket connection troubleshooting tips:")
        console.log("1. Make sure your server is running")
        console.log("2. Check that the server is properly handling Socket.io connections")
        console.log("3. Verify CORS settings if your client and server are on different domains")
        console.log("4. Check network tab for more detailed error information")
      }
    })

    // Set socket state
    setSocket(socketInstance)

    // Cleanup on unmount
    return () => {
      console.log("Cleaning up socket connection")
      socketInstance.disconnect()
    }
  }, [])

  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
}
