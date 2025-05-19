"use client"

import { useState, useEffect } from "react"
import { useSocket } from "@/lib/socket-provider"

type DataType = "financial" | "employee" | "tasks" | "reconciliation"

interface UseRealTimeDataOptions {
  type: DataType
  id?: string
  initialData?: any
}

export function useRealTimeData<T>({ type, id, initialData }: UseRealTimeDataOptions) {
  const [data, setData] = useState<T | null>(initialData || null)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<Error | null>(null)
  const { socket, isConnected } = useSocket()

  useEffect(() => {
    if (!socket || !isConnected) return

    // Join the appropriate room
    const roomId = id ? `${type}-${id}` : type
    socket.emit("join-room", roomId)

    // Listen for data updates
    socket.on(`${type}-update`, (updatedData: T) => {
      setData(updatedData)
      setIsLoading(false)
    })

    // Listen for errors
    socket.on(`${type}-error`, (err: Error) => {
      setError(err)
      setIsLoading(false)
    })

    // Initial data fetch if not provided
    if (!initialData) {
      socket.emit(`get-${type}`, id, (response: { data?: T; error?: Error }) => {
        if (response.error) {
          setError(response.error)
        } else if (response.data) {
          setData(response.data)
        }
        setIsLoading(false)
      })
    }

    // Cleanup
    return () => {
      socket.off(`${type}-update`)
      socket.off(`${type}-error`)
      socket.emit("leave-room", roomId)
    }
  }, [socket, isConnected, type, id, initialData])

  return { data, isLoading, error }
}
