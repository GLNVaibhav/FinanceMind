import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log(`Processing file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`)

    // Extract file content based on type
    let fileContent = ""
    let fileType = ""

    if (
      file.type.includes("csv") ||
      file.type.includes("text") ||
      file.name.endsWith(".csv") ||
      file.name.endsWith(".txt")
    ) {
      // Handle CSV and text files
      fileContent = await file.text()
      fileType = "text/csv"
    } else if (file.type.includes("spreadsheet") || file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      // For Excel files, we can't directly parse them, so we'll just use the name and size
      fileContent = `Excel file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`
      fileType = "excel"
    } else if (file.type.includes("pdf") || file.name.endsWith(".pdf")) {
      // For PDF files, we can't directly parse them, so we'll just use the name and size
      fileContent = `PDF file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`
      fileType = "pdf"
    } else {
      // For other files, just use the name and size
      fileContent = `File: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`
      fileType = file.type || "unknown"
    }

    // In a real implementation, you would use a library to parse Excel files and extract text from PDFs
    // For this demo, we'll simulate AI analysis with some sample insights

    // Generate analysis using AI
    const { text: analysis } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Analyze the following financial document and provide key insights:
      
      File name: ${file.name}
      File type: ${fileType}
      File size: ${(file.size / 1024).toFixed(2)} KB
      
      Content preview:
      ${fileContent.substring(0, 1000)}${fileContent.length > 1000 ? "..." : ""}
      
      Provide a detailed analysis with key financial insights, potential issues, and recommendations.`,
      system: `You are a financial document analysis AI. Extract key information from financial documents including:
      - Important financial figures
      - Trends and patterns
      - Potential issues or discrepancies
      - Recommendations based on the data
      
      Since this is a simulation, generate realistic financial insights based on the file name and type.
      For example, if it's a "Q2 Financial Report.xlsx", provide insights about quarterly performance.
      If it's "Bank Statement.pdf", provide insights about transaction patterns and account balances.
      
      Format your response in a clear, structured way that highlights the most important information.`,
    })

    console.log("Analysis generated successfully")

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileType: fileType,
      analysis: analysis,
    })
  } catch (error) {
    console.error("Document analysis error:", error)
    return NextResponse.json(
      { error: "Failed to analyze document", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
