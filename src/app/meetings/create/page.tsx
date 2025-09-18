"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"

// Form validation schema
const createMeetingSchema = z.object({
  title: z.string().min(1, "שם הפגישה נדרש"),
  description: z.string().min(10, "תיאור חייב להכיל לפחות 10 תווים"),
  date: z.string().min(1, "תאריך נדרש"),
  time: z.string().min(1, "שעה נדרשת"),
  duration: z.number().min(15, "משך הפגישה חייב להיות לפחות 15 דקות"),
  location: z.string().min(1, "מיקום נדרש"),
  maxParticipants: z.number().min(1, "מספר משתתפים חייב להיות לפחות 1"),
  isRequired: z.boolean(),
  enableRecording: z.boolean(),
  sendNotifications: z.boolean(),
  isPublic: z.boolean(),
  requirePreApproval: z.boolean(),
})

type CreateMeetingForm = z.infer<typeof createMeetingSchema>

// Mock user data for departments
const departmentUsers = {
  "פיתוח": [
    { id: 1, name: "יוסי כהן", initials: "יכ" },
    { id: 2, name: "דני אלון", initials: "דא" },
    { id: 3, name: "מיכל רוזן", initials: "מר" },
  ],
  "עיצוב": [
    { id: 4, name: "שרה לוי", initials: "של" },
    { id: 5, name: "תומר זהב", initials: "תז" },
  ],
  "QA": [
    { id: 6, name: "מיכל גרין", initials: "מג" },
    { id: 7, name: "רון כהן", initials: "רכ" },
  ],
  "ניהול": [
    { id: 8, name: "ליאת כהן", initials: "לכ" },
    { id: 9, name: "אבי מור", initials: "אמ" },
  ],
  "מכירות": [
    { id: 10, name: "דני מור", initials: "דמ" },
    { id: 11, name: "נועה בר", initials: "נב" },
  ],
  "שיווק": [
    { id: 12, name: "עדי לב", initials: "על" },
    { id: 13, name: "גל כץ", initials: "גכ" },
  ]
}

// DiceBear avatar generation
const getAvatarUrl = (userName: string) => {
  return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(userName)}`
}

export default function CreateMeetingPage() {
  const [selectedUsers, setSelectedUsers] = useState<{[key: string]: number[]}>({})
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const toggleUserSelection = (department: string, userId: number) => {
    setSelectedUsers(prev => {
      const departmentUsers = prev[department] || []
      const isSelected = departmentUsers.includes(userId)
      
      if (isSelected) {
        return {
          ...prev,
          [department]: departmentUsers.filter(id => id !== userId)
        }
      } else {
        return {
          ...prev,
          [department]: [...departmentUsers, userId]
        }
      }
    })
  }

  const handleFileUpload = (files: FileList) => {
    const newFiles = Array.from(files).filter(file => {
      // Validate file types (documents, images, etc.)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/plain'
      ]
      return allowedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024 // 10MB limit
    })
    
    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreateMeetingForm>({
    resolver: zodResolver(createMeetingSchema),
    defaultValues: {
      isRequired: false,
      enableRecording: false,
      sendNotifications: true,
      isPublic: false,
      requirePreApproval: false,
    }
  })

  const onSubmit = (data: CreateMeetingForm) => {
    const meetingData = {
      ...data,
      selectedUsers,
      uploadedFiles: uploadedFiles.map(f => f.name)
    }
    console.log("Meeting data:", meetingData)
    // Handle form submission here
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">צור פגישה חדשה</h1>
          <p className="text-muted-foreground mt-2">מלא את הפרטים ליצירת פגישה חדשה</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Row 1: Basic Information + Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information Section */}
            <Card>
              <CardHeader>
                <CardTitle>פרטי הפגישה</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">שם הפגישה *</Label>
                    <Input
                      id="title"
                      {...register("title")}
                      className={errors.title ? "border-destructive" : ""}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="location">מיקום *</Label>
                    <Input
                      id="location"
                      {...register("location")}
                      className={errors.location ? "border-destructive" : ""}
                    />
                    {errors.location && (
                      <p className="text-sm text-destructive mt-1">{errors.location.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">תיאור הפגישה *</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    rows={3}
                    className={errors.description ? "border-destructive" : ""}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="date">תאריך *</Label>
                    <Input
                      id="date"
                      type="date"
                      {...register("date")}
                      className={errors.date ? "border-destructive" : ""}
                    />
                    {errors.date && (
                      <p className="text-sm text-destructive mt-1">{errors.date.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="time">שעה *</Label>
                    <Input
                      id="time"
                      type="time"
                      {...register("time")}
                      className={errors.time ? "border-destructive" : ""}
                    />
                    {errors.time && (
                      <p className="text-sm text-destructive mt-1">{errors.time.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="duration">משך (דקות) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      {...register("duration", { valueAsNumber: true })}
                      className={errors.duration ? "border-destructive" : ""}
                    />
                    {errors.duration && (
                      <p className="text-sm text-destructive mt-1">{errors.duration.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="maxParticipants">מספר משתתפים מקסימלי *</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    {...register("maxParticipants", { valueAsNumber: true })}
                    className={errors.maxParticipants ? "border-destructive" : ""}
                  />
                  {errors.maxParticipants && (
                    <p className="text-sm text-destructive mt-1">{errors.maxParticipants.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Settings Section */}
            <Card>
              <CardHeader>
                <CardTitle>הגדרות פגישה</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="isRequired">פגישה חובה</Label>
                      <p className="text-sm text-muted-foreground">האם הפגישה היא חובה לכל המשתתפים</p>
                    </div>
                    <Switch 
                      id="isRequired"
                      checked={watch("isRequired")}
                      onCheckedChange={(checked) => setValue("isRequired", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="enableRecording">הפעל הקלטה</Label>
                      <p className="text-sm text-muted-foreground">האם להקליט את הפגישה</p>
                    </div>
                    <Switch 
                      id="enableRecording"
                      checked={watch("enableRecording")}
                      onCheckedChange={(checked) => setValue("enableRecording", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="sendNotifications">שלח התראות</Label>
                      <p className="text-sm text-muted-foreground">שלח התראות למשתתפים</p>
                    </div>
                    <Switch 
                      id="sendNotifications"
                      checked={watch("sendNotifications")}
                      onCheckedChange={(checked) => setValue("sendNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="isPublic">פגישה ציבורית</Label>
                      <p className="text-sm text-muted-foreground">האם הפגישה פתוחה לכולם</p>
                    </div>
                    <Switch 
                      id="isPublic"
                      checked={watch("isPublic")}
                      onCheckedChange={(checked) => setValue("isPublic", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="requirePreApproval">דרוש אישור מוקדם</Label>
                      <p className="text-sm text-muted-foreground">האם נדרש אישור מנהל לפני הפגישה</p>
                    </div>
                    <Switch 
                      id="requirePreApproval"
                      checked={watch("requirePreApproval")}
                      onCheckedChange={(checked) => setValue("requirePreApproval", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Department Signers + File Upload */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Signers Section */}
            <Card>
              <CardHeader>
                <CardTitle>בחירת חותמים לפי מחלקות</CardTitle>
                <p className="text-sm text-muted-foreground">בחר משתתפים מכל מחלקה שיידרשו לחתום על הפגישה</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(departmentUsers).map(([department, users]) => {
                    const selectedCount = selectedUsers[department]?.length || 0
                    return (
                      <div key={department} className="space-y-2">
                        <Label className="text-sm font-medium">{department}</Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="outline" 
                              className="w-full justify-between cursor-pointer"
                            >
                              <span>
                                {selectedCount > 0 
                                  ? `נבחרו ${selectedCount} משתתפים` 
                                  : "בחר משתתפים"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ▼
                              </span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            {users.map((user) => {
                              const isSelected = selectedUsers[department]?.includes(user.id) || false
                              return (
                                <DropdownMenuCheckboxItem
                                  key={user.id}
                                  checked={isSelected}
                                  onCheckedChange={() => toggleUserSelection(department, user.id)}
                                  className="cursor-pointer"
                                >
                                  <div className="flex items-center gap-2">
                                    <Avatar className="w-6 h-6">
                                      <img 
                                        src={getAvatarUrl(user.name)} 
                                        alt={user.name}
                                        className="w-full h-full"
                                      />
                                      <AvatarFallback className="text-xs">
                                        {user.initials}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">{user.name}</span>
                                  </div>
                                </DropdownMenuCheckboxItem>
                              )
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <div className="text-xs text-muted-foreground">
                          {selectedCount} מתוך {users.length} נבחרו
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* File Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>קבצים ומסמכים</CardTitle>
                <p className="text-sm text-muted-foreground">העלה קבצים רלוונטיים לפגישה (PDF, Word, Excel, PowerPoint, תמונות)</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Drag & Drop Area */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragOver 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="text-4xl">📎</div>
                      <div>
                        <p className="text-lg font-medium">גרור קבצים לכאן או</p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('file-upload')?.click()}
                          className="mt-2"
                        >
                          בחר קבצים
                        </Button>
                        <input
                          id="file-upload"
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt"
                          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                          className="hidden"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        תומך בקבצי PDF, Word, Excel, PowerPoint, תמונות עד 10MB
                      </p>
                    </div>
                  </div>

                  {/* Uploaded Files List */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">קבצים שהועלו:</h4>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted rounded-md"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">
                                {file.type.includes('image') ? '🖼️' : 
                                 file.type.includes('pdf') ? '📄' :
                                 file.type.includes('word') ? '📝' :
                                 file.type.includes('excel') ? '📊' :
                                 file.type.includes('powerpoint') ? '📊' : '📁'}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              הסר
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline">
              ביטול
            </Button>
            <Button type="submit">
              צור פגישה
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}