"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LucideHome,
  LucideBarChart2,
  LucideUsers,
  LucideFileText,
  LucideSettings,
  LucideMessageSquare,
  LucideBanknote,
  LucideFileSpreadsheet,
  LucideTestTube,
  LucideBuilding,
  LucideUserPlus,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  // Check if user has access to a specific route
  const hasAccess = (roles: string[]) => {
    if (!user) return false
    return roles.includes(user.role)
  }

  return (
    <div className={cn("fixed top-0 left-0 z-20 h-full w-64 border-r bg-background pt-16", className)}>
      <ScrollArea className="h-full py-6">
        <nav className="grid gap-2 px-2">
          <Link href="/dashboard" passHref legacyBehavior>
            <Button
              variant={pathname === "/dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <span>
                <LucideHome className="mr-2 h-4 w-4" />
                Dashboard
              </span>
            </Button>
          </Link>

          <Link href="/dashboard/ai-assistant" passHref legacyBehavior>
            <Button
              variant={pathname === "/dashboard/ai-assistant" ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <span>
                <LucideMessageSquare className="mr-2 h-4 w-4" />
                AI Assistant
              </span>
            </Button>
          </Link>

          {hasAccess(["chairman", "md", "admin"]) && (
            <Link href="/dashboard/employee-tracking" passHref legacyBehavior>
              <Button
                variant={pathname === "/dashboard/employee-tracking" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <span>
                  <LucideUsers className="mr-2 h-4 w-4" />
                  Employee Tracking
                </span>
              </Button>
            </Link>
          )}

          <Link href="/dashboard/financial-analysis" passHref legacyBehavior>
            <Button
              variant={pathname === "/dashboard/financial-analysis" ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <span>
                <LucideBarChart2 className="mr-2 h-4 w-4" />
                Financial Analysis
              </span>
            </Button>
          </Link>

          <Link href="/dashboard/bank-reconciliation" passHref legacyBehavior>
            <Button
              variant={pathname === "/dashboard/bank-reconciliation" ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <span>
                <LucideBanknote className="mr-2 h-4 w-4" />
                Bank Reconciliation
              </span>
            </Button>
          </Link>

          <Link href="/dashboard/reports" passHref legacyBehavior>
            <Button
              variant={pathname === "/dashboard/reports" ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <span>
                <LucideFileText className="mr-2 h-4 w-4" />
                Reports
              </span>
            </Button>
          </Link>

          <Link href="/dashboard/documents" passHref legacyBehavior>
            <Button
              variant={pathname === "/dashboard/documents" ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <span>
                <LucideFileSpreadsheet className="mr-2 h-4 w-4" />
                Documents
              </span>
            </Button>
          </Link>

          {hasAccess(["admin"]) && (
            <Link href="/dashboard/companies" passHref legacyBehavior>
              <Button
                variant={pathname === "/dashboard/companies" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <span>
                  <LucideBuilding className="mr-2 h-4 w-4" />
                  Companies
                </span>
              </Button>
            </Link>
          )}

          {hasAccess(["chairman", "md", "admin"]) && (
            <Link href="/dashboard/users" passHref legacyBehavior>
              <Button
                variant={pathname === "/dashboard/users" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <span>
                  <LucideUserPlus className="mr-2 h-4 w-4" />
                  Users
                </span>
              </Button>
            </Link>
          )}

          <Link href="/dashboard/test" passHref legacyBehavior>
            <Button
              variant={pathname === "/dashboard/test" ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <span>
                <LucideTestTube className="mr-2 h-4 w-4" />
                System Tests
              </span>
            </Button>
          </Link>

          <div className="mt-6 px-3 py-2">
            <h4 className="mb-2 text-xs font-semibold text-muted-foreground">Settings</h4>
            <Link href="/dashboard/settings" passHref legacyBehavior>
              <Button
                variant={pathname === "/dashboard/settings" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <span>
                  <LucideSettings className="mr-2 h-4 w-4" />
                  Settings
                </span>
              </Button>
            </Link>
          </div>
        </nav>
      </ScrollArea>
    </div>
  )
}
