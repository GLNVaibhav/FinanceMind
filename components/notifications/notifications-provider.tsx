"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useSocket } from "@/lib/socket-provider"
import { useToast } from "@/components/ui/use-toast"

export type NotificationType = "info" | "success" | "warning" | "error"

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  timestamp: Date
  read: boolean
}

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearNotifications: () => {},
})

export const useNotifications = () => {
  return useContext(NotificationsContext)
}

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { socket, isConnected } = useSocket()
  const { toast } = useToast()

  const unreadCount = notifications.filter((notification) => !notification.read).length

  useEffect(() => {
    if (!socket || !isConnected) return

    // Listen for new notifications
    socket.on("notification", (notification: Omit<Notification, "timestamp" | "read">) => {
      const newNotification = {
        ...notification,
        timestamp: new Date(),
        read: false,
      }

      setNotifications((prev) => [newNotification, ...prev])

      // Show toast for new notification
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.type === "error" ? "destructive" : "default",
      })
    })

    // Cleanup
    return () => {
      socket.off("notification")
    }
  }, [socket, isConnected, toast])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}
