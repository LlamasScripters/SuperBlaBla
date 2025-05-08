"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserCircle, Settings, LogOut } from "lucide-react"

export default function ChatHeader() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      
    } catch (error) {
    }
  }

  return (
    <header className="bg-white border-b shadow-sm py-3 px-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/chat" className="text-xl font-bold text-emerald-600">
          ChatNexus
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center mr-2">
            <UserCircle className="h-5 w-5 mr-1 text-slate-500" />
            <span className="text-sm font-medium">test</span>
          </div>

          <Button asChild variant="ghost" size="sm">
            <Link href="/profile">
              <Settings className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          </Button>

          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
