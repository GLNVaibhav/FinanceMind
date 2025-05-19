"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LucideSend, LucideUser, LucideFileText, LucideInfo } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant" | "system"
  timestamp: Date
}

interface AIAnalysis {
  analysis: string
  fileName?: string
  fileType?: string
}

interface AIChatProps {
  fileAnalysis?: AIAnalysis | null
}

export function AIChat({ fileAnalysis }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI financial assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Handle file analysis updates
  useEffect(() => {
    if (fileAnalysis) {
      // Add system message about the file analysis
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        content: `I've analyzed the uploaded document. Here's what I found:\n\n${fileAnalysis.analysis}`,
        role: "system",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, systemMessage])
    }
  }, [fileAnalysis])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Get the last few messages for context
      const recentMessages = messages.slice(-5).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      // Add the new user message
      recentMessages.push({
        role: "user",
        content: input,
      })

      // Send the request to the AI API
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: recentMessages,
          fileContext: fileAnalysis ? fileAnalysis.analysis : null,
        }),
      })

      if (!response.ok) {
        throw new Error(`AI request failed: ${response.statusText}`)
      }

      const data = await response.json()

      // Add the AI response to the messages
      const aiMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: data.response,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("AI chat error:", error)

      // Add an error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-[600px] flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {fileAnalysis && (
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <LucideFileText className="h-4 w-4" />
              <AlertTitle>Document Analyzed</AlertTitle>
              <AlertDescription>
                I've analyzed your document and incorporated the insights into our conversation.
              </AlertDescription>
            </Alert>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} ${
                message.role === "system" ? "justify-center" : ""
              }`}
            >
              <div
                className={`flex max-w-[80%] items-start gap-3 rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : message.role === "system"
                      ? "bg-blue-50 text-blue-800 border border-blue-200"
                      : "bg-muted"
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AI</AvatarFallback>
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  </Avatar>
                )}
                {message.role === "system" && <LucideInfo className="h-5 w-5 text-blue-500 mt-0.5" />}
                <div className="flex-1">
                  <div className="text-sm whitespace-pre-line">{message.content}</div>
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
          ))}
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
