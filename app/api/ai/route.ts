import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: NextRequest) {
  try {
    const { query, context } = await req.json()

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: query,
      system: `You are a professional financial AI assistant specialized in accounting, bookkeeping, MIS, and bank reconciliation.
      
      You have access to the following context about the company's financial data:
      ${context || "No specific context provided."}
      
      Provide detailed, accurate responses to financial queries. If you don't know something, say so rather than making up information.`,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("AI API error:", error)
    return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 })
  }
}
