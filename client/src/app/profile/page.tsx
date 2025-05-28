"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import socket from "../lib/socket"

const COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#84cc16",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#d946ef",
  "#ec4899",
]

export default function ProfilePage() {
  const [name, setName] = useState("")
  const [selectedColor, setSelectedColor] = useState("#10b981")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [currentUserId, setCurrentUserId] = useState("")

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/login")
      return
    }
    try {
      const user = JSON.parse(userStr)
      if (user.user_metadata?.name) setName(user.user_metadata.name)
      else if (user.name) setName(user.name)
      if (user.color) setSelectedColor(user.color)
      setCurrentUserId(user.id)
    } catch (e) {
      router.push("/login")
    }
  }, [router])

  const handleColorChange = (newColor: string) => {
    setSelectedColor(newColor)
    
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const user = JSON.parse(userStr)
      user.color = newColor
      localStorage.setItem("user", JSON.stringify(user))
    }
    
    socket.emit("changeColor", {
      sender: currentUserId,
      color: newColor,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        const user = JSON.parse(userStr)
        if (user.user_metadata) {
          user.user_metadata.name = name
        } else {
          user.name = name
        }
        user.color = selectedColor
        localStorage.setItem("user", JSON.stringify(user))
      }
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const handleColorChanged = (data: { sender: string, color: string }) => {
      if (data.sender === currentUserId) {
        setSelectedColor(data.color)
        const userStr = localStorage.getItem("user")
        if (userStr) {
          const user = JSON.parse(userStr)
          if (user.color !== data.color) {
            user.color = data.color
            localStorage.setItem("user", JSON.stringify(user))
          }
        }
      }
    }

    socket.on("profileColorChanged", handleColorChanged)
    
    return () => {
      socket.off("profileColorChanged", handleColorChanged)
    }
  }, [currentUserId])

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
          <CardDescription>Customize your profile appearance</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                disabled={isLoading} 
                placeholder="Enter your display name"
              />
            </div>

            <div className="space-y-3">
              <Label>Chat Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-full aspect-square rounded-full border-4 transition-all hover:scale-110 ${
                      selectedColor === color 
                        ? "border-gray-800 shadow-lg" 
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                    disabled={isLoading}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3 mt-4">
                <div className="font-medium">Preview:</div>
                <div 
                  className="px-3 py-2 rounded-lg text-white transition-colors duration-200" 
                  style={{ backgroundColor: selectedColor }}
                >
                  Hello, this is my message!
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700" 
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push("/chat")} 
              disabled={isLoading}
            >
              Back to Chat
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}