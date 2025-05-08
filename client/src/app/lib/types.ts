export interface User {
    id: string
    name: string
    email: string
    password: string
    color: string
    sessionId: string | null
  }
  
  export interface Message {
    id: string
    content: string
    userId: string
    userName: string
    userColor: string
    timestamp: string
  }
  