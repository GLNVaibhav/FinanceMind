"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export interface User {
  id: string
  email: string
  name: string
  role: "chairman" | "md" | "employee" | "admin"
  companyId: string
  companyName: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would be an API call to validate the session
        const storedUser = localStorage.getItem("financemind_user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call to your auth endpoint
      // For demo purposes, we'll simulate a successful login with mock data

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock users for demo
      const users = [
        {
          id: "1",
          email: "chairman@acme.com",
          password: "password",
          name: "John Chairman",
          role: "chairman",
          companyId: "1",
          companyName: "Acme Inc",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "2",
          email: "md@acme.com",
          password: "password",
          name: "Sarah Director",
          role: "md",
          companyId: "1",
          companyName: "Acme Inc",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "3",
          email: "admin@financemind.com",
          password: "password",
          name: "Admin User",
          role: "admin",
          companyId: "0",
          companyName: "FinanceMind",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      ]

      const matchedUser = users.find((u) => u.email === email && u.password === password)

      if (!matchedUser) {
        throw new Error("Invalid email or password")
      }

      // Remove password before storing
      const { password: _, ...userWithoutPassword } = matchedUser

      // Set user in state and localStorage
      setUser(userWithoutPassword as User)
      localStorage.setItem("financemind_user", JSON.stringify(userWithoutPassword))

      toast({
        title: "Login successful",
        description: `Welcome back, ${userWithoutPassword.name}!`,
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("financemind_user")
    router.push("/login")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
