import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Meeting, User } from "@/types/meeting"

interface MeetingActionsProps {
  meetingData: Meeting
  currentUser: User
  isCurrentUserSigned: boolean
  isSignDialogOpen: boolean
  setIsSignDialogOpen: (open: boolean) => void
  isFreezeDialogOpen: boolean
  setIsFreezeDialogOpen: (open: boolean) => void
  isCloseDialogOpen: boolean
  setIsCloseDialogOpen: (open: boolean) => void
  selectedPartyToSign: string
  setSelectedPartyToSign: (party: string) => void
  selectedPartyToUnsign: string
  setSelectedPartyToUnsign: (party: string) => void
  handleSign: () => void
  handleFreeze: () => void
  handleClose: () => void
}

export function MeetingActions({
  meetingData,
  currentUser,
  isCurrentUserSigned,
  isSignDialogOpen,
  setIsSignDialogOpen,
  isFreezeDialogOpen,
  setIsFreezeDialogOpen,
  isCloseDialogOpen,
  setIsCloseDialogOpen,
  selectedPartyToSign,
  setSelectedPartyToSign,
  selectedPartyToUnsign,
  setSelectedPartyToUnsign,
  handleSign,
  handleFreeze,
  handleClose,
}: MeetingActionsProps) {
  const unsignedDepartments = meetingData.departments.filter(dept => !dept.signed)
  const signedDepartments = meetingData.departments.filter(dept => dept.signed)

  return (
    <div className="flex gap-3 pt-6 border-t border-border">
      {currentUser.isAdmin ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                className="cursor-pointer"
                disabled={unsignedDepartments.length === 0}
              >
                {selectedPartyToSign ? `חתום כגורם ${selectedPartyToSign}` : "חתום כגורם..."}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {unsignedDepartments.map((dept) => (
                <DropdownMenuItem
                  key={dept.id}
                  onClick={() => {
                    setSelectedPartyToSign(dept.name)
                    setIsSignDialogOpen(true)
                  }}
                  className="cursor-pointer"
                >
                  {dept.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="cursor-pointer"
                disabled={signedDepartments.length === 0}
              >
                {selectedPartyToUnsign ? `בטל חתימה כגורם ${selectedPartyToUnsign}` : "בטל חתימה כגורם..."}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {signedDepartments.map((dept) => (
                <DropdownMenuItem
                  key={dept.id}
                  onClick={() => {
                    setSelectedPartyToUnsign(dept.name)
                    setIsSignDialogOpen(true)
                  }}
                  className="cursor-pointer"
                >
                  {dept.name} ({dept.member?.name})
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
          <DialogTrigger asChild>
            <Button variant={isCurrentUserSigned ? "outline" : "default"} className="cursor-pointer">
              {isCurrentUserSigned ? "בטל חתימה" : "חתום"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isCurrentUserSigned ? "בטל חתימה" : "חתום על הפגישה"}
              </DialogTitle>
              <DialogDescription>
                {isCurrentUserSigned
                  ? "האם אתה בטוח שברצונך לבטל את החתימה על הפגישה זו?"
                  : "האם אתה בטוח שברצונך לחתום על הפגישה זו?"
                }
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSignDialogOpen(false)} className="cursor-pointer">
                ביטול
              </Button>
              <Button onClick={handleSign} className="cursor-pointer">
                אישור
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {currentUser.isAdmin && (
        <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedPartyToUnsign ? `בטל חתימה כגורם ${selectedPartyToUnsign}` : `חתום כגורם ${selectedPartyToSign}`}
              </DialogTitle>
              <DialogDescription>
                {selectedPartyToUnsign
                  ? `האם אתה בטוח שברצונך לבטל את החתימה בשם מחלקת ${selectedPartyToUnsign}?`
                  : `האם אתה בטוח שברצונך לחתום בשם מחלקת ${selectedPartyToSign}?`
                }
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSignDialogOpen(false)} className="cursor-pointer">
                ביטול
              </Button>
              <Button onClick={handleSign} className="cursor-pointer">
                אישור
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isFreezeDialogOpen} onOpenChange={setIsFreezeDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="cursor-pointer">
            {meetingData.isFrozen ? "בטל הקפאה" : "הקפא פגישה"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {meetingData.isFrozen ? "בטל הקפאת הפגישה" : "הקפא פגישה"}
            </DialogTitle>
            <DialogDescription>
              {meetingData.isFrozen
                ? "האם אתה בטוח שברצונך לבטל את הקפאת הפגישה? משתתפים יוכלו לעדכן את סטטוס ההשתתפות שלהם."
                : "האם אתה בטוח שברצונך להקפיא את הפגישה? משתתפים לא יוכלו לעדכן את סטטוס ההשתתפות שלהם."
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFreezeDialogOpen(false)} className="cursor-pointer">
              ביטול
            </Button>
            <Button onClick={handleFreeze} className="cursor-pointer">
              אישור
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" disabled={meetingData.isClosed} className="cursor-pointer">
            {meetingData.isClosed ? "הפגישה סגורה" : "סגור פגישה"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>סגור פגישה</DialogTitle>
            <DialogDescription>
              האם אתה בטוח שברצונך לסגור את הפגישה? פעולה זו היא בלתי הפיכה ולא ניתן יהיה לערוך או להשתתף בפגישה לאחר הסגירה.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCloseDialogOpen(false)} className="cursor-pointer">
              ביטול
            </Button>
            <Button variant="destructive" onClick={handleClose} className="cursor-pointer">
              סגור פגישה
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}