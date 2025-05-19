"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUploader } from "@/components/dashboard/file-uploader"
import { AIChat } from "@/components/dashboard/ai-chat"
import { LucideFileSpreadsheet, LucideFileText, LucideUpload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LucideInfo } from "lucide-react"

export default function AIAssistantPage() {
  const [fileAnalysis, setFileAnalysis] = useState<any>(null)

  const handleFileAnalyzed = (analysis: any) => {
    setFileAnalysis(analysis)
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">AI Financial Assistant</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Financial AI Assistant</CardTitle>
              <CardDescription>Get insights on accounting, bookkeeping, MIS, and bank reconciliation</CardDescription>
            </CardHeader>
            <CardContent>
              <AIChat fileAnalysis={fileAnalysis} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>Upload financial documents for AI analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <LucideInfo className="h-4 w-4" />
                <AlertTitle>Document Analysis</AlertTitle>
                <AlertDescription>
                  Upload your financial documents and our AI will analyze them. The analysis will be automatically added
                  to your chat context.
                </AlertDescription>
              </Alert>

              <Tabs defaultValue="excel">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="excel">Excel</TabsTrigger>
                  <TabsTrigger value="pdf">PDF</TabsTrigger>
                  <TabsTrigger value="other">Other</TabsTrigger>
                </TabsList>
                <TabsContent value="excel" className="mt-4">
                  <FileUploader
                    icon={<LucideFileSpreadsheet className="h-10 w-10 text-gray-400" />}
                    title="Upload Excel Files"
                    description="Upload QuickBooks exports, financial statements, or payroll reports"
                    acceptedFileTypes=".xlsx,.xls,.csv"
                    onFileAnalyzed={handleFileAnalyzed}
                  />
                </TabsContent>
                <TabsContent value="pdf" className="mt-4">
                  <FileUploader
                    icon={<LucideFileText className="h-10 w-10 text-gray-400" />}
                    title="Upload PDF Documents"
                    description="Upload bank statements, invoices, or financial reports"
                    acceptedFileTypes=".pdf"
                    onFileAnalyzed={handleFileAnalyzed}
                  />
                </TabsContent>
                <TabsContent value="other" className="mt-4">
                  <FileUploader
                    icon={<LucideUpload className="h-10 w-10 text-gray-400" />}
                    title="Upload Other Files"
                    description="Upload any other financial documents for analysis"
                    acceptedFileTypes=".txt,.json,.xml"
                    onFileAnalyzed={handleFileAnalyzed}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
