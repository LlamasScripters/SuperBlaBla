import { Message } from "../lib/types"
import { formatDistanceToNow } from "date-fns"

interface MessageListProps {
  messages: Message[]
  currentUserId?: string
  currentUserColor?: string
}

export default function MessageList({ messages, currentUserId, currentUserColor }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500 text-center">No messages yet. Start the conversation!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.userId === currentUserId

        return (
          <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[80%] flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                {!isCurrentUser && (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: message.userColor || "#10b981" }}
                  >
                    {message.userName?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs text-slate-500">{message.userName}</span>
                <span className="text-xs text-slate-400">
                  {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                </span>
              </div>

              <div
                className={`px-4 py-2 rounded-lg text-white`}
                style={{
                  backgroundColor: isCurrentUser 
                    ? currentUserColor || "#10b981"
                    : message.userColor || "#10b981"
                }}
              >
                {message.content}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}