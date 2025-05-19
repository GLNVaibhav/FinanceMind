"use client"

import { useEffect, useState } from "react"
import { useSocket } from "@/lib/socket-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LucideAlertTriangle, LucideCheckCircle, LucideXCircle } from "lucide-react"

export function SocketTest() {
  const { socket, isConnected } = useSocket()
  const [messages, setMessages] = useState<string[]>([])
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle")

  useEffect(() => {
    if (!socket) return

    // Listen for test responses
    socket.on("test-response", (data) => {
      console.log("Received test response:", data)
      setMessages((prev) => [...prev, `Received: ${JSON.stringify(data)}`])
      setTestStatus("success")
    })

    // Listen for errors
    socket.on("test-error", (error) => {
      console.error("Socket test error:", error)
      setMessages((prev) => [...prev, `Error: ${error.message}`])
      setTestStatus("error")
    })

    // Cleanup
    return () => {
      socket.off("test-response")
      socket.off("test-error")
    }
  }, [socket])

  const runTest = () => {
    if (!socket || !isConnected) {
      setMessages((prev) => [...prev, "Socket not connected. Cannot run test."])
      setTestStatus("error")
      return
    }

    setTestStatus("testing")
    setMessages((prev) => [...prev, "Sending test message..."])

    // Send a test message
    socket.emit("test-message", {
      message: "Hello from client",
      timestamp: new Date().toISOString(),
    })

    // Set a timeout to detect if no response is received
    setTimeout(() => {
      if (testStatus === "testing") {
        setTestStatus("error")
        setMessages((prev) => [...prev, "No response received within timeout period."])
      }
    }, 5000)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>WebSocket Connection Test</CardTitle>
          <Badge variant={isConnected ? "success" : "destructive"}>{isConnected ? "Connected" : "Disconnected"}</Badge>
        </div>
        <CardDescription>Test the real-time connection to verify your setup</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Connection Status:</div>
          <div className="flex items-center">
            {isConnected ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center">
                <LucideCheckCircle className="h-3 w-3 mr-1" />
                Connected to {process.env.NEXT_PUBLIC_SOCKET_URL || "server"}
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center">
                <LucideXCircle className="h-3 w-3 mr-1" />
                Disconnected
              </Badge>
            )}
          </div>
        </div>

        {testStatus === "success" && (
          <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
            <LucideCheckCircle className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              WebSocket connection is working properly. You can now implement real-time features.
            </AlertDescription>
          </Alert>
        )}

        {testStatus === "error" && (
          <Alert variant="destructive" className="mb-4">
            <LucideAlertTriangle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              There was a problem with the WebSocket connection. Check the console for more details.
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm font-medium mb-2">Test Log:</div>
        <div className="bg-muted rounded-md p-3 h-32 overflow-y-auto text-sm font-mono">
          {messages.length === 0 ? (
            <div className="text-muted-foreground">No messages yet. Run the test to see results.</div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className="pb-1">
                {msg}
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={runTest} disabled={!isConnected || testStatus === "testing"} className="w-full">
          {testStatus === "testing" ? "Testing..." : "Run Connection Test"}
        </Button>
      </CardFooter>
    </Card>
  )
}
