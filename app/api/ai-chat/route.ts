import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// This would be called by your socket.io implementation
export async function processAIMessage(message: string, context: any, socket: any) {
  try {
    // For streaming responses
    const stream = await generateText({
      model: openai("gpt-4o"),
      prompt: message,
      system: `You are a professional financial AI assistant specialized in accounting, bookkeeping, MIS, and bank reconciliation.
      
      You have access to the following context about the company's financial data:
      ${context || "No specific context provided."}
      
      Provide detailed, accurate responses to financial queries. If you don't know something, say so rather than making up information.`,
      temperature: 0.7,
      stream: true,
    })

    // Stream the response chunks to the client
    for await (const chunk of stream) {
      socket.emit("ai-stream", chunk)
    }

    // Signal the end of the stream
    socket.emit("ai-stream-end")
  } catch (error) {
    console.error("AI API error:", error)
    socket.emit("ai-message", {
      id: Date.now().toString(),
      content: "Sorry, I encountered an error processing your request. Please try again.",
      role: "assistant",
    })
  }
}

// This is a placeholder for direct HTTP requests (not used in real-time mode)
export async function POST(req: NextRequest) {
  try {
    const { messages, fileContext } = await req.json()

    // Build the system prompt
    let systemPrompt = `You are a professional financial AI assistant specialized in accounting, bookkeeping, MIS, and bank reconciliation.
    
    Provide detailed, accurate responses to financial queries. If you don't know something, say so rather than making up information.`

    // Add file context if available
    if (fileContext) {
      systemPrompt += `\n\nYou have access to the following document analysis:\n${fileContext}`
    }

    // Generate response using AI
    const { text } = await generateText({
      model: openai("gpt-4o"),
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      system: systemPrompt,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("AI chat error:", error)
    return NextResponse.json(
      { error: "Failed to generate AI response", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
