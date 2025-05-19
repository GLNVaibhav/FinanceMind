import { io } from "socket.io-client"

let socket

export const initializeSocket = (token) => {
  // Close existing socket if it exists
  if (socket) {
    socket.close()
  }

  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"

  // Create new socket connection
  socket = io(socketUrl, {
    auth: { token },
    transports: ["websocket"],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
  })

  // Set up event listeners
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id)
  })

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message)
  })

  socket.on("error", (error) => {
    console.error("Socket error:", error)
  })

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason)
  })

  return socket
}

export const getSocket = () => {
  return socket
}

export const closeSocket = () => {
  if (socket) {
    socket.close()
    socket = null
  }
}
