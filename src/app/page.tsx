
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const meetings = [
  {
    id: 1,
    title: "פגישת צוות שבועית",
    description: "דיון על התקדמות הפרויקטים והמשימות השבועיות",
    date: "2025-01-15",
    time: "10:00",
    participants: 8,
    status: "scheduled"
  },
  {
    id: 2,
    title: "הצגת דמו ללקוח",
    description: "הצגת התכונות החדשות שפותחו החודש",
    date: "2025-01-16",
    time: "14:30",
    participants: 5,
    status: "scheduled"
  },
  {
    id: 3,
    title: "סקירת ביצועים חודשית",
    description: "ביקורת הישגים ויעדים לחודש הבא",
    date: "2025-01-18",
    time: "09:00",
    participants: 12,
    status: "in-progress"
  },
  {
    id: 4,
    title: "פגישת תכנון אסטרטגי",
    description: "תכנון יעדים לרבעון הבא ואלוקציה של משאבים",
    date: "2025-01-20",
    time: "11:00",
    participants: 6,
    status: "scheduled"
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled': return 'bg-blue-100 text-blue-800'
    case 'in-progress': return 'bg-green-100 text-green-800'
    case 'completed': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'scheduled': return 'מתוכננת'
    case 'in-progress': return 'בעיצומה'
    case 'completed': return 'הושלמה'
    default: return status
  }
}

export default function Home() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-custom-100">פגישות פעילות</h2>
        <Link href="/meetings/create">
          <Button className="cursor-pointer">
            + צור פגישה חדשה
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetings.map((meeting) => (
          <Card key={meeting.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{meeting.title}</CardTitle>
              <CardAction>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                  {getStatusText(meeting.status)}
                </span>
              </CardAction>
              <CardDescription>
                {meeting.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">תאריך:</span>
                  <span>{new Date(meeting.date).toLocaleDateString('he-IL')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">שעה:</span>
                  <span>{meeting.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">משתתפים:</span>
                  <span>{meeting.participants}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Link 
                href={`/meetings/${meeting.id}`}
                className="bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md transition-colors"
              >
                צפה בפרטים
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
