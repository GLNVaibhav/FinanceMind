import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const setupSocketHandlers = (io) => {
  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token

      if (!token) {
        return next(new Error("Authentication error: Token not provided"))
      }

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Find the user
      const user = await User.findById(decoded.id).select("-password")

      if (!user) {
        return next(new Error("Authentication error: User not found"))
      }

      // Attach user to socket
      socket.user = user
      next()
    } catch (error) {
      console.error("Socket authentication error:", error.message)
      next(new Error("Authentication error: " + error.message))
    }
  })

  // Connection event
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user?.email || "Anonymous"} (${socket.id})`)

    // Join company room
    if (socket.user?.company) {
      socket.join(`company:${socket.user.company}`)
      console.log(`User ${socket.user.email} joined company room: ${socket.user.company}`)
    }

    // Handle real-time data updates
    socket.on("subscribe:financial", (data) => {
      try {
        const { companyId } = data
        if (companyId) {
          socket.join(`financial:${companyId}`)
          console.log(`User ${socket.user.email} subscribed to financial updates for company: ${companyId}`)
        }
      } catch (error) {
        console.error("Error in subscribe:financial:", error)
        socket.emit("error", { message: "Failed to subscribe to financial updates" })
      }
    })

    // Handle document updates
    socket.on("subscribe:documents", (data) => {
      try {
        const { companyId } = data
        if (companyId) {
          socket.join(`documents:${companyId}`)
          console.log(`User ${socket.user.email} subscribed to document updates for company: ${companyId}`)
        }
      } catch (error) {
        console.error("Error in subscribe:documents:", error)
        socket.emit("error", { message: "Failed to subscribe to document updates" })
      }
    })

    // Handle employee updates
    socket.on("subscribe:employees", (data) => {
      try {
        const { companyId } = data
        if (companyId) {
          socket.join(`employees:${companyId}`)
          console.log(`User ${socket.user.email} subscribed to employee updates for company: ${companyId}`)
        }
      } catch (error) {
        console.error("Error in subscribe:employees:", error)
        socket.emit("error", { message: "Failed to subscribe to employee updates" })
      }
    })

    // Handle chat messages
    socket.on("chat:message", (data) => {
      try {
        const { companyId, message } = data
        if (companyId && message) {
          io.to(`company:${companyId}`).emit("chat:message", {
            user: {
              id: socket.user._id,
              name: socket.user.name,
              email: socket.user.email,
            },
            message,
            timestamp: new Date(),
          })
        }
      } catch (error) {
        console.error("Error in chat:message:", error)
        socket.emit("error", { message: "Failed to send chat message" })
      }
    })

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user?.email || "Anonymous"} (${socket.id})`)
    })

    // Handle errors
    socket.on("error", (error) => {
      console.error(`Socket error for user ${socket.user?.email || "Anonymous"}:`, error)
    })
  })
}
