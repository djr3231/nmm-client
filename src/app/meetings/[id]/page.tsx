"use client"

import { useState, use } from "react"
import { MeetingHeader } from "@/components/meetings/MeetingHeader"
import { MeetingDescription } from "@/components/meetings/MeetingDescription"
import { DepartmentSignatures } from "@/components/meetings/DepartmentSignatures"
import { MeetingActions } from "@/components/meetings/MeetingActions"
import { ChatSection } from "@/components/meetings/ChatSection"
import type { Meeting, User, ChatMessage } from "@/types/meeting"

const currentUser = {
  id: 1,
  name: "רוני ישראלי",
  initials: "רי",
  department: "ניהול",
  isAdmin: true
}

const meetings = [
  {
    id: 1,
    title: "פגישת צוות שבועית",
    description: "דיון על התקדמות הפרויקטים והמשימות השבועיות. נעבור על הישגי השבוע, נזהה אתגרים ונתכנן את המשימות לשבוע הבא. כל חבר צוות יציג את ההתקדמות שלו ויעדכן על כל בעיה או עזרה שהוא זקוק לה.",
    isFrozen: false,
    isClosed: false,
    departments: [
      { id: 1, name: "פיתוח", signed: true, member: { name: "יוסי כהן", initials: "יכ" } },
      { id: 2, name: "עיצוב", signed: true, member: { name: "שרה לוי", initials: "של" } },
      { id: 3, name: "QA", signed: true, member: { name: "מיכל גרין", initials: "מג" } },
      { id: 4, name: "ניהול", signed: false, member: null },
      { id: 5, name: "מכירות", signed: true, member: { name: "דני מור", initials: "דמ" } },
      { id: 6, name: "שיווק", signed: false, member: null }
    ]
  },
  {
    id: 2,
    title: "הצגת דמו ללקוח",
    description: "הצגת התכונות החדשות שפותחו החודש ללקוח. נציג את הפיצ'רים החדשים, נקבל משוב ונתאם את השלבים הבאים בפיתוח.",
    isFrozen: true,
    isClosed: false,
    departments: [
      { id: 1, name: "פיתוח", signed: true, member: { name: "שרה לוי", initials: "של" } },
      { id: 2, name: "עיצוב", signed: true, member: { name: "תומר אלון", initials: "תא" } },
      { id: 3, name: "QA", signed: false, member: null },
      { id: 4, name: "ניהול", signed: true, member: { name: "ליאת כהן", initials: "לכ" } },
      { id: 5, name: "מכירות", signed: false, member: null },
      { id: 6, name: "שיווק", signed: false, member: null }
    ]
  }
]

const mockChatMessages: ChatMessage[] = [
  {
    id: "1",
    sender: "יוסי כהן",
    content: "האם יש עדכון לגבי הפרויקט החדש?",
    timestamp: new Date(2025, 0, 15, 10, 30),
    isCurrentUser: false
  },
  {
    id: "2", 
    sender: "רוני ישראלי",
    content: "כן, נעדכן בפגישה על כל הפרטים",
    timestamp: new Date(2025, 0, 15, 10, 32),
    isCurrentUser: true
  },
  {
    id: "3",
    sender: "שרה לוי", 
    content: "מעולה! מחכה לשמוע @רוני ישראלי",
    timestamp: new Date(2025, 0, 15, 10, 35),
    mentions: ["רוני ישראלי"],
    isCurrentUser: false
  },
  {
    id: "4",
    sender: "רוני ישראלי",
    content: "נתחיל בזמן - 10:00 בדיוק",
    timestamp: new Date(2025, 0, 15, 10, 40),
    isCurrentUser: true
  }
]

export default function MeetingDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params)
  const meetingId = parseInt(id)
  const [meetingData, setMeetingData] = useState(() => meetings.find(m => m.id === meetingId) || meetings[0])
  
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false)
  const [isFreezeDialogOpen, setIsFreezeDialogOpen] = useState(false)
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false)
  
  // Admin state management
  const [selectedPartyToSign, setSelectedPartyToSign] = useState<string>("")
  const [selectedPartyToUnsign, setSelectedPartyToUnsign] = useState<string>("")

  // Chat state management
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages)
  
  // Check if current user has signed by finding their department
  const currentUserDepartment = meetingData.departments.find(dept => dept.name === currentUser.department)
  const isCurrentUserSigned = !!(currentUserDepartment?.signed && currentUserDepartment?.member?.name === currentUser.name)
  
  const handleSign = () => {
    if (currentUser.isAdmin) {
      // Admin logic - sign/unsign for selected department
      const targetDepartment = selectedPartyToUnsign || selectedPartyToSign
      
      setMeetingData(prevMeeting => {
        const updatedDepartments = prevMeeting.departments.map(dept => {
          if (dept.name === targetDepartment) {
            if (selectedPartyToUnsign) {
              // Admin unsigning a department
              return { ...dept, signed: false, member: null }
            } else {
              // Admin signing for a department
              return { 
                ...dept, 
                signed: true, 
                member: { name: currentUser.name, initials: currentUser.initials }
              }
            }
          }
          return dept
        })
        
        return { ...prevMeeting, departments: updatedDepartments }
      })
      
      console.log(selectedPartyToUnsign ? 
        `Admin ${currentUser.name} unsigned ${selectedPartyToUnsign}` : 
        `Admin ${currentUser.name} signed for ${selectedPartyToSign}`
      )
      
      // Reset selected parties after action
      setSelectedPartyToSign("")
      setSelectedPartyToUnsign("")
    } else {
      // Regular user logic - sign/unsign their own department
      setMeetingData(prevMeeting => {
        const updatedDepartments = prevMeeting.departments.map(dept => {
          if (dept.name === currentUser.department) {
            if (dept.signed && dept.member?.name === currentUser.name) {
              // Unsign - remove user signature
              return { ...dept, signed: false, member: null }
            } else {
              // Sign - add user signature
              return { 
                ...dept, 
                signed: true, 
                member: { name: currentUser.name, initials: currentUser.initials }
              }
            }
          }
          return dept
        })
        
        return { ...prevMeeting, departments: updatedDepartments }
      })
      
      console.log(isCurrentUserSigned ? `${currentUser.name} unsigned from meeting` : `${currentUser.name} signed to meeting`)
    }
    
    setIsSignDialogOpen(false)
  }
  
  const handleFreeze = () => {
    setMeetingData(prev => ({ ...prev, isFrozen: !prev.isFrozen }))
    console.log(meetingData.isFrozen ? 'Meeting unfrozen' : 'Meeting frozen')
    setIsFreezeDialogOpen(false)
  }
  
  const handleClose = () => {
    setMeetingData(prev => ({ ...prev, isClosed: true }))
    console.log('Meeting closed')
    setIsCloseDialogOpen(false)
  }

  return (
    <div className="p-6 gap-6 flex">
      <div className="w-[60%] bg-card rounded-md p-6">
        <div className="space-y-6">
          <MeetingHeader title={meetingData.title} />
          <MeetingDescription description={meetingData.description} />
          <DepartmentSignatures departments={meetingData.departments} />
          <MeetingActions
            meetingData={meetingData}
            currentUser={currentUser}
            isCurrentUserSigned={isCurrentUserSigned}
            isSignDialogOpen={isSignDialogOpen}
            setIsSignDialogOpen={setIsSignDialogOpen}
            isFreezeDialogOpen={isFreezeDialogOpen}
            setIsFreezeDialogOpen={setIsFreezeDialogOpen}
            isCloseDialogOpen={isCloseDialogOpen}
            setIsCloseDialogOpen={setIsCloseDialogOpen}
            selectedPartyToSign={selectedPartyToSign}
            setSelectedPartyToSign={setSelectedPartyToSign}
            selectedPartyToUnsign={selectedPartyToUnsign}
            setSelectedPartyToUnsign={setSelectedPartyToUnsign}
            handleSign={handleSign}
            handleFreeze={handleFreeze}
            handleClose={handleClose}
          />
        </div>
      </div>
      <ChatSection
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
        currentUserName={currentUser.name}
        departments={meetingData.departments}
      />
    </div>
  )
}