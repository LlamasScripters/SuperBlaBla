"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

const COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#84cc16", // lime
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#d946ef", // fuchsia
  "#ec4899", // pink
]

export default function ProfilePage() {
  const [name, setName] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Redirect if not authenticated
//   useEffect(() => {
//     if (!isAuthenticated) {
//       router.push("/login")
//     } else if (user) {
//       setName(user.name)
//       setSelectedColor(user.color || COLORS[0])
//     }
//   }, [isAuthenticated, router, user])

  const handleSubmit = async (e: React.FormEvent) => {

  }


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
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
            </div>

            <div className="space-y-3">
              <Label>Chat Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-full aspect-square rounded-full border-2 ${
                      selectedColor === color ? "border-black" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    disabled={isLoading}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3 mt-4">
                <div className="font-medium">Preview:</div>
                <div className="px-3 py-2 rounded-lg text-white" style={{ backgroundColor: selectedColor }}>
                  Hello, this is my message!
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/chat")} disabled={isLoading}>
              Back to Chat
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
