"use client"

import { useDashboardData } from "@/hooks/use-dashboard-data"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { LucideAlertTriangle, LucideWifi, LucideWifiOff } from "lucide-react"

export function RealTimeOverview() {
  const { data, isLoading, error, isRealTime } = useDashboardData()

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-[350px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <LucideAlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load financial data: {error.message}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Last updated: {new Date(data?.lastUpdated || "").toLocaleString()}
        </div>
        <Badge
          variant="outline"
          className={
            isRealTime
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-yellow-50 text-yellow-700 border-yellow-200"
          }
        >
          {isRealTime ? (
            <>
              <LucideWifi className="h-3 w-3 mr-1" /> Real-time
            </>
          ) : (
            <>
              <LucideWifiOff className="h-3 w-3 mr-1" /> Polling
            </>
          )}
        </Badge>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data?.data || []}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="revenue" name="Revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
