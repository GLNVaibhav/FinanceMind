"use client"

import { useState, useEffect } from "react"
import { useSocket } from "@/lib/socket-provider"

// Sample data for fallback
const sampleData = {
  data: [
    {
      name: "Jan",
      revenue: 34000,
      expenses: 24000,
    },
    {
      name: "Feb",
      revenue: 38000,
      expenses: 25000,
    },
    {
      name: "Mar",
      revenue: 42000,
      expenses: 27000,
    },
    {
      name: "Apr",
      revenue: 39000,
      expenses: 26000,
    },
    {
      name: "May",
      revenue: 45000,
      expenses: 28000,
    },
  ],
  lastUpdated: new Date().toISOString(),
}

export function useDashboardData() {
  const [data, setData] = useState(sampleData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { socket, isConnected } = useSocket()

  useEffect(() => {
    // If socket is connected, set up real-time updates
    if (socket && isConnected) {
      console.log("Setting up dashboard data listeners")

      // Listen for financial data updates
      socket.on("financial-update", (updatedData) => {
        console.log("Received financial update:", updatedData)
        setData(updatedData)
      })

      // Request initial data
      socket.emit("get-financial-data")

      return () => {
        socket.off("financial-update")
      }
    } else {
      // If socket is not connected, fetch data using REST API as fallback
      const fetchData = async () => {
        try {
          setIsLoading(true)
          // In a real app, you would fetch from your API
          // For now, we'll just simulate a delay and use sample data
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Generate some random variations in the data
          const updatedData = {
            ...sampleData,
            data: sampleData.data.map((item) => ({
              ...item,
              revenue: item.revenue + Math.floor(Math.random() * 5000),
              expenses: item.expenses + Math.floor(Math.random() * 3000),
            })),
            lastUpdated: new Date().toISOString(),
          }

          setData(updatedData)
          setIsLoading(false)
        } catch (err) {
          setError(err instanceof Error ? err : new Error("Failed to fetch dashboard data"))
          setIsLoading(false)
        }
      }

      fetchData()
    }
  }, [socket, isConnected])

  return { data, isLoading, error, isRealTime: socket && isConnected }
}
