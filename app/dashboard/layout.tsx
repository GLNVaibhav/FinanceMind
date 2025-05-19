"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { SocketProvider } from "@/lib/socket-provider"
import { Toaster } from "@/components/ui/toaster"
import { NotificationsProvider } from "@/components/notifications/notifications-provider"
import { useAuth } from "@/lib/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="h-16 border-b bg-background">
          <div className="container flex h-16 items-center">
            <Skeleton className="h-8 w-40" />
            <div className="ml-auto flex items-center space-x-4">
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
        <div className="flex flex-1">
          <div className="hidden w-64 border-r md:block">
            <div className="flex h-full flex-col pt-16">
              <Skeleton className="mx-4 mt-6 h-8" />
              <Skeleton className="mx-4 mt-2 h-8" />
              <Skeleton className="mx-4 mt-2 h-8" />
              <Skeleton className="mx-4 mt-2 h-8" />
            </div>
          </div>
          <main className="flex-1 p-6 pt-16">
            <Skeleton className="h-8 w-64" />
            <div className="mt-4 grid gap-4">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <SocketProvider>
      <NotificationsProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-6 pt-16">{children}</main>
          </div>
          <Toaster />
        </div>
      </NotificationsProvider>
    </SocketProvider>
  )
}
