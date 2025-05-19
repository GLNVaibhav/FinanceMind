// This would be a server-side service that pushes updates to connected clients

import type { Server as SocketIOServer } from "socket.io"

export class RealTimeDataService {
  private io: SocketIOServer
  private updateIntervals: Map<string, NodeJS.Timeout> = new Map()

  constructor(io: SocketIOServer) {
    this.io = io
    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    this.io.on("connection", (socket) => {
      console.log(`Socket ${socket.id} connected`)

      // Handle room joining
      socket.on("join-room", (room) => {
        socket.join(room)
        console.log(`Socket ${socket.id} joined room: ${room}`)

        // Start sending updates for this room if not already doing so
        this.startUpdatesForRoom(room)
      })

      // Handle room leaving
      socket.on("leave-room", (room) => {
        socket.leave(room)
        console.log(`Socket ${socket.id} left room: ${room}`)

        // Check if room is empty and stop updates if so
        this.checkAndStopUpdates(room)
      })

      // Handle disconnect
      socket.on("disconnect", () => {
        console.log(`Socket ${socket.id} disconnected`)

        // Check all rooms this socket was in and stop updates if empty
        Array.from(socket.rooms).forEach((room) => {
          if (room !== socket.id) {
            this.checkAndStopUpdates(room)
          }
        })
      })

      // Handle user messages for AI
      socket.on("user-message", ({ content, context }) => {
        // This would call your AI processing function
        // processAIMessage(content, context, socket)
        console.log(`Received message from ${socket.id}: ${content}`)

        // Simulate AI response for now
        setTimeout(() => {
          socket.emit("ai-message", {
            id: Date.now().toString(),
            content: `This is a simulated response to: "${content}"`,
            role: "assistant",
          })
        }, 1000)
      })
    })
  }

  private startUpdatesForRoom(room: string) {
    // If already sending updates to this room, do nothing
    if (this.updateIntervals.has(room)) return

    // Start sending updates based on room type
    if (room.startsWith("financial")) {
      const interval = setInterval(() => {
        this.sendFinancialUpdate(room)
      }, 10000) // Every 10 seconds

      this.updateIntervals.set(room, interval)
    } else if (room.startsWith("employee")) {
      const interval = setInterval(() => {
        this.sendEmployeeUpdate(room)
      }, 15000) // Every 15 seconds

      this.updateIntervals.set(room, interval)
    }
    // Add other room types as needed
  }

  private checkAndStopUpdates(room: string) {
    // Check if room is empty
    this.io
      .in(room)
      .fetchSockets()
      .then((sockets) => {
        if (sockets.length === 0 && this.updateIntervals.has(room)) {
          // Room is empty, stop sending updates
          clearInterval(this.updateIntervals.get(room)!)
          this.updateIntervals.delete(room)
          console.log(`Stopped updates for empty room: ${room}`)
        }
      })
  }

  private sendFinancialUpdate(room: string) {
    // Generate updated financial data
    const data = this.generateFinancialData()

    // Send to all clients in the room
    this.io.to(room).emit("financial-update", data)
  }

  private sendEmployeeUpdate(room: string) {
    // Generate updated employee data
    const data = this.generateEmployeeData()

    // Send to all clients in the room
    this.io.to(room).emit("employee-update", data)
  }

  private generateFinancialData() {
    // Generate some random financial data for demonstration
    return {
      data: [
        {
          name: "Jan",
          revenue: 30000 + Math.floor(Math.random() * 10000),
          expenses: 20000 + Math.floor(Math.random() * 8000),
        },
        {
          name: "Feb",
          revenue: 35000 + Math.floor(Math.random() * 10000),
          expenses: 22000 + Math.floor(Math.random() * 8000),
        },
        {
          name: "Mar",
          revenue: 40000 + Math.floor(Math.random() * 10000),
          expenses: 25000 + Math.floor(Math.random() * 8000),
        },
        {
          name: "Apr",
          revenue: 38000 + Math.floor(Math.random() * 10000),
          expenses: 24000 + Math.floor(Math.random() * 8000),
        },
        {
          name: "May",
          revenue: 42000 + Math.floor(Math.random() * 10000),
          expenses: 26000 + Math.floor(Math.random() * 8000),
        },
      ],
      lastUpdated: new Date().toISOString(),
    }
  }

  private generateEmployeeData() {
    // Generate some random employee data for demonstration
    return {
      employees: [
        {
          id: "1",
          name: "John Doe",
          department: "Accounting",
          tasksAssigned: 24,
          tasksCompleted: 20 + Math.floor(Math.random() * 4),
          productivity: 80 + Math.floor(Math.random() * 15),
        },
        {
          id: "2",
          name: "Sarah Miller",
          department: "Bookkeeping",
          tasksAssigned: 18,
          tasksCompleted: 15 + Math.floor(Math.random() * 3),
          productivity: 85 + Math.floor(Math.random() * 10),
        },
        // Add more employees as needed
      ],
      lastUpdated: new Date().toISOString(),
    }
  }
}
