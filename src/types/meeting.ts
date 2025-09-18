export interface Department {
  id: number
  name: string
  signed: boolean
  member: {
    name: string
    initials: string
  } | null
}

export interface Meeting {
  id: number
  title: string
  description: string
  isFrozen: boolean
  isClosed: boolean
  departments: Department[]
}

export interface ChatMessage {
  id: string
  sender: string
  content: string
  timestamp: Date
  images?: string[]
  mentions?: string[]
  isCurrentUser: boolean
}

export interface User {
  id: number
  name: string
  initials: string
  department: string
  isAdmin: boolean
}