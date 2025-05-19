"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useSocket } from "@/lib/socket-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { LucideSend, LucideBot, LucideUser } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export function RealTimeAIChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { socket, isConnected } = useSocket()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!socket || !isConnected) return

    // Listen for AI responses
    socket.on("ai-message", (message: Omit<Message, "timestamp">) => {
      const newMessage = {
        ...message,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, newMessage])
      setIsLoading(false)
    })

    // Listen for streaming responses
    socket.on("ai-stream", (chunk: string) => {
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1]
        if (lastMessage && lastMessage.role === "assistant") {
          const updatedMessages = [...prev]
          updatedMessages[prev.length - 1] = {
            ...lastMessage,
            content: lastMessage.content + chunk,
          }
          return updatedMessages
        }
        return [
          ...prev,
          {
            id: Date.now().toString(),
            content: chunk,
            role: "assistant",
            timestamp: new Date(),
          },
        ]
      })
    })

    // Listen for stream end
    socket.on("ai-stream-end", () => {
      setIsLoading(false)
    })

    // Cleanup
    return () => {
      socket.off("ai-message")
      socket.off("ai-stream")
      socket.off("ai-stream-end")
    }
  }, [socket, isConnected])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !socket || !isConnected) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Send message to server
    socket.emit("user-message", {
      content: input,
      context: {
        // Add any context needed for the AI
        previousMessages: messages.slice(-5),
      },
    })
  }

  return (
    <div className="flex h-[600px] flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-center">
              <div>
                <LucideBot className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Ask your AI financial assistant anything about your data
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex max-w-[80%] items-start gap-3 rounded-lg p-3 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>AI</AvatarFallback>
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    </Avatar>
                  )}
                  <div className="flex-1">
                    <div className="text-sm">{message.content}</div>
                    <div className="mt-1 text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <LucideUser className="h-4 w-4" />
                      </AvatarFallback>
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    </Avatar>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] items-start gap-3 rounded-lg bg-muted p-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="mt-2 h-4 w-[200px]" />
                  <Skeleton className="mt-2 h-4 w-[150px]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about financial data, employee productivity, or request analysis..."
            className="min-h-[60px] flex-1 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <LucideSend className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
