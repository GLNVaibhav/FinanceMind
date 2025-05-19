"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface AIResponseProps {
  response: string
  isLoading: boolean
}

export function AIResponse({ response, isLoading }: AIResponseProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    )
  }

  if (!response) {
    return (
      <div className="flex h-[300px] items-center justify-center text-center">
        <div className="max-w-md space-y-2">
          <h3 className="text-lg font-medium">Ask your AI financial assistant</h3>
          <p className="text-sm text-muted-foreground">
            Get insights on financial data, employee productivity, or request analysis of your documents.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      {response.split("\n").map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  )
}
