"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmployeeTable } from "@/components/dashboard/employee-table"
import { EmployeePerformance } from "@/components/dashboard/employee-performance"
import { WorkAllocationChart } from "@/components/dashboard/work-allocation-chart"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LucideShield } from "lucide-react"
import { useRouter } from "next/navigation"

export default function EmployeeTrackingPage() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  // Check if user has permission
  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "chairman" && user.role !== "md") {
      router.push("/dashboard")
    }
  }, [user, router])

  if (!user || (user.role !== "admin" && user.role !== "chairman" && user.role !== "md")) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Employee Productivity Tracking</h1>
          <p className="text-muted-foreground mt-1">Monitor employee performance and task allocation</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Assign New Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Task</DialogTitle>
              <DialogDescription>Create a new task and assign it to an employee.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task" className="text-right">
                  Task
                </Label>
                <Input id="task" placeholder="Enter task description" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employee" className="text-right">
                  Employee
                </Label>
                <Input id="employee" placeholder="Select employee" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deadline" className="text-right">
                  Deadline
                </Label>
                <Input id="deadline" type="date" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Assign Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <LucideShield className="h-4 w-4 text-blue-500" />
        <AlertTitle>Management Access</AlertTitle>
        <AlertDescription>
          As a {user.role === "chairman" ? "Chairman" : "Managing Director"}, you have full access to employee
          productivity data and task management.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Productivity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Work Allocation</CardTitle>
                <CardDescription>Distribution of work across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <WorkAllocationChart />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Employees with highest productivity scores</CardDescription>
              </CardHeader>
              <CardContent>
                <EmployeePerformance />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employee Directory</CardTitle>
              <CardDescription>View and manage employee productivity metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeeTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Task Management</CardTitle>
              <CardDescription>Track task allocation and completion status</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Task management interface will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Productivity Analytics</CardTitle>
              <CardDescription>Detailed productivity metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Advanced analytics dashboard will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
