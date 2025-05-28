"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Message } from "../lib/types"
import ChatHeader from "../components/chat-header"
import MessageList from "../components/message-list"
import socket from "../lib/socket"

export default function ChatPage() {
  const [messageText, setMessageText] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [currentUserId, setCurrentUserId] = useState("")
  const [currentUserName, setCurrentUserName] = useState("")
  const [currentUserColor, setCurrentUserColor] = useState("#10b981")

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/login")
    } else {
      try {
        const user = JSON.parse(userStr)
        setCurrentUserId(user.id)
        setCurrentUserName(user.user_metadata?.name || user.name || "")
        setCurrentUserColor(user.color || "#10b981")
      } catch (error) {
        router.push("/login")
      }
    }
  }, [router])

  useEffect(() => {
    socket.on("message", (msg: any) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + Math.random(),
          content: msg.text,
          userId: msg.userId,
          userName: msg.sender,
          userColor: msg.color,
          timestamp: msg.timestamp || new Date().toISOString(),
        },
      ])
    })

    socket.on("profileColorChanged", ({ sender, color }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.userId === sender ? { ...msg, userColor: color } : msg
        )
      )
      
      if (sender === currentUserId) {
        setCurrentUserColor(color)
        const userStr = localStorage.getItem("user")
        if (userStr) {
          const user = JSON.parse(userStr)
          user.color = color
          localStorage.setItem("user", JSON.stringify(user))
        }
      }
    })

    return () => {
      socket.off("message")
      socket.off("profileColorChanged")
    }
  }, [currentUserId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "user" && e.newValue) {
        const user = JSON.parse(e.newValue)
        setCurrentUserColor(user.color || "#10b981")
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim()) return
    
    setIsLoading(true)
    try {
      socket.emit("message", {
        sender: currentUserName,
        text: messageText,
        userId: currentUserId,
        color: currentUserColor,
      })
      setMessageText("")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          <MessageList 
            messages={messages} 
            currentUserId={currentUserId} 
            currentUserColor={currentUserColor} 
          />
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t bg-white p-4">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-2">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading || !messageText.trim()}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  )
}