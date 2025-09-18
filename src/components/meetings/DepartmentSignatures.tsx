import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Department } from "@/types/meeting"

interface DepartmentSignaturesProps {
  departments: Department[]
}

export function DepartmentSignatures({ departments }: DepartmentSignaturesProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-muted-foreground">אישורי מחלקות</h3>
        <span className="text-sm text-muted-foreground">
          {departments.filter(d => d.signed).length}/{departments.length} אישרו
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div key={dept.id} className="flex flex-col items-center space-y-2 p-3 rounded-lg border border-border">
            <Avatar className={`w-12 h-12 ${dept.signed ? 'ring-2 ring-green-500' : 'ring-2 ring-gray-300'}`}>
              <AvatarFallback className={dept.signed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}>
                {dept.signed && dept.member ? dept.member.initials : '?'}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <div className="text-xs font-medium text-foreground">{dept.name}</div>
              {dept.signed && dept.member ? (
                <div className="text-xs text-green-600">{dept.member.name}</div>
              ) : (
                <div className="text-xs text-gray-400">ממתין לאישור</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}