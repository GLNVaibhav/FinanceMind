import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SocketTest } from "@/components/tests/socket-test"

export default function TestPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">System Tests</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SocketTest />

        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Verify your environment configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-1">NEXT_PUBLIC_SOCKET_URL:</div>
                <div className="bg-muted rounded-md p-2 text-sm font-mono">
                  {process.env.NEXT_PUBLIC_SOCKET_URL || "Not set"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
