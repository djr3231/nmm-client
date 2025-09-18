import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"
import type { ChatMessage, Department } from "@/types/meeting"

interface ChatSectionProps {
  chatMessages: ChatMessage[]
  setChatMessages: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void
  currentUserName: string
  departments: Department[]
}

export function ChatSection({
  chatMessages,
  setChatMessages,
  currentUserName,
  departments
}: ChatSectionProps) {
  const [newMessage, setNewMessage] = useState("")
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [showMentionDropdown, setShowMentionDropdown] = useState(false)
  const [mentionSearch, setMentionSearch] = useState("")
  const [cursorPosition, setCursorPosition] = useState(0)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const getAvatarUrl = (userName: string) => {
    return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(userName)}`
  }

  const signedParticipants = departments
    .filter(dept => dept.signed && dept.member)
    .map(dept => dept.member!.name)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages])

  const extractMentions = (message: string): string[] => {
    const mentionRegex = /@([^\s]+)/g
    const mentions: string[] = []
    let match

    while ((match = mentionRegex.exec(message)) !== null) {
      const mentionedName = match[1]
      if (signedParticipants.includes(mentionedName)) {
        mentions.push(mentionedName)
      }
    }

    return mentions
  }

  const handleSendMessage = () => {
    if (newMessage.trim() || uploadedImages.length > 0) {
      const newChatMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: currentUserName,
        content: newMessage.trim(),
        timestamp: new Date(),
        images: uploadedImages.length > 0 ? [...uploadedImages] : undefined,
        mentions: extractMentions(newMessage),
        isCurrentUser: true
      }

      setChatMessages(prev => [...prev, newChatMessage])
      setNewMessage("")
      setUploadedImages([])
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setUploadedImages(prev => [...prev, e.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    const cursorPos = e.target.selectionStart
    setCursorPosition(cursorPos)
    setNewMessage(value)

    const textBeforeCursor = value.slice(0, cursorPos)
    const lastAtIndex = textBeforeCursor.lastIndexOf('@')

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1)
      if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
        setMentionSearch(textAfterAt.toLowerCase())
        setShowMentionDropdown(true)
        return
      }
    }

    setShowMentionDropdown(false)
    setMentionSearch("")
  }

  const insertMention = (userName: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const textBeforeCursor = newMessage.slice(0, cursorPosition)
    const textAfterCursor = newMessage.slice(cursorPosition)
    const lastAtIndex = textBeforeCursor.lastIndexOf('@')

    if (lastAtIndex !== -1) {
      const beforeAt = textBeforeCursor.slice(0, lastAtIndex)
      const newText = beforeAt + `@${userName} ` + textAfterCursor
      setNewMessage(newText)
      setShowMentionDropdown(false)
      setMentionSearch("")

      setTimeout(() => {
        textarea.focus()
        const newCursorPos = beforeAt.length + userName.length + 2
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      }, 0)
    }
  }

  const filteredParticipants = signedParticipants.filter(name =>
    name.toLowerCase().includes(mentionSearch)
  )

  const getUserInfo = (userName: string) => {
    const userDept = departments.find(dept =>
      dept.member?.name === userName
    )
    return {
      name: userName,
      department: userDept?.name || "לא זמין",
      signed: userDept?.signed || false,
      initials: userDept?.member?.initials || userName.split(' ').map(n => n[0]).join('')
    }
  }

  const renderMessageWithMentions = (content: string) => {
    const mentionRegex = /@([^\s]+(?:\s+[^\s]+)*?)(?=\s|$|@)/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = mentionRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index))
      }

      const mentionedName = match[1]
      const userInfo = getUserInfo(mentionedName)

      parts.push(
        <span
          key={match.index}
          className="relative group text-blue-600 font-medium cursor-pointer hover:underline"
          title={`${userInfo.name} - ${userInfo.department} - ${userInfo.signed ? 'חתום' : 'לא חתום'}`}
        >
          @{mentionedName}

          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 w-48">
            <div className="flex items-start gap-2">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <img
                  src={getAvatarUrl(userInfo.name)}
                  alt={userInfo.name}
                  className="w-full h-full"
                />
                <AvatarFallback className="text-xs">
                  {userInfo.initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-foreground">{userInfo.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {userInfo.department}
                </p>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                  userInfo.signed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {userInfo.signed ? 'חתום' : 'לא חתום'}
                </span>
              </div>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"></div>
          </div>
        </span>
      )

      lastIndex = match.index + match[0].length
    }

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex))
    }

    return parts.length > 0 ? parts : content
  }

  return (
    <div className="w-[40%] bg-card rounded-md p-6 flex flex-col">
      <h2 className="text-xl font-semibold mb-4">צ'אט פגישה</h2>

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-96 scrollbar-thin scrollbar-track-muted scrollbar-thumb-muted-foreground hover:scrollbar-thumb-primary"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'hsl(var(--muted-foreground)) hsl(var(--muted))'
        }}
      >
        {chatMessages.map((message) => (
          <div key={message.id} className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] gap-2 ${message.isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <Avatar className="w-8 h-8 flex-shrink-0">
                <img
                  src={getAvatarUrl(message.sender)}
                  alt={message.sender}
                  className="w-full h-full"
                />
                <AvatarFallback>
                  {message.sender.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className={`rounded-lg p-3 ${
                message.isCurrentUser
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              } ${message.isCurrentUser ? 'text-right' : 'text-left'}`}>
                <div className={`text-xs mb-1 ${
                  message.isCurrentUser
                    ? 'text-primary-foreground/80 text-right'
                    : 'text-muted-foreground text-left'
                }`}>
                  {message.isCurrentUser ? 'אני' : message.sender}
                </div>

                <div className={`text-sm ${message.isCurrentUser ? 'text-right' : 'text-left'}`}>
                  {renderMessageWithMentions(message.content)}
                </div>

                {message.images && message.images.length > 0 && (
                  <div className={`mt-2 grid grid-cols-2 gap-2 ${message.isCurrentUser ? 'justify-items-end' : 'justify-items-start'}`}>
                    {message.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="uploaded"
                        className="rounded-md max-w-full h-auto"
                      />
                    ))}
                  </div>
                )}

                <div className={`text-xs mt-1 ${
                  message.isCurrentUser
                    ? 'text-primary-foreground/60 text-right'
                    : 'text-muted-foreground text-left'
                }`}>
                  {message.timestamp.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {uploadedImages.length > 0 && (
        <div className="mb-3 flex gap-2 flex-wrap">
          {uploadedImages.map((img, idx) => (
            <div key={idx} className="relative">
              <img src={img} alt="preview" className="w-16 h-16 object-cover rounded-md" />
              <button
                onClick={() => removeUploadedImage(idx)}
                className="absolute -top-1 -right-1 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2 relative">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={newMessage}
            onChange={handleTextareaChange}
            placeholder="הקלד הודעה... (הקלד @ כדי לציין משתתף)"
            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={2}
            onKeyDown={(e) => {
              if (showMentionDropdown) {
                if (e.key === 'Escape') {
                  setShowMentionDropdown(false)
                  return
                }
              }
              if (e.key === 'Enter' && !e.shiftKey && !showMentionDropdown) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />

          {showMentionDropdown && filteredParticipants.length > 0 && (
            <div className="absolute bottom-full left-0 mb-1 w-64 bg-background border border-border rounded-md shadow-lg max-h-40 overflow-y-auto z-50">
              {filteredParticipants.map((participant, index) => (
                <div
                  key={index}
                  onClick={() => insertMention(participant)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer text-sm"
                >
                  <Avatar className="w-6 h-6 flex-shrink-0">
                    <img
                      src={getAvatarUrl(participant)}
                      alt={participant}
                      className="w-full h-full"
                    />
                    <AvatarFallback className="text-xs">
                      {participant.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span>{participant}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            className="hidden"
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer"
          >
            📷
          </Button>

          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() && uploadedImages.length === 0}
            className="cursor-pointer flex-1"
          >
            שלח
          </Button>
        </div>
      </div>
    </div>
  )
}