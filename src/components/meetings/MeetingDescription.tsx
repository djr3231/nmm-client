interface MeetingDescriptionProps {
  description: string
}

export function MeetingDescription({ description }: MeetingDescriptionProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-muted-foreground">תיאור הפגישה</h3>
      <div className="bg-muted rounded-md p-4 text-sm leading-relaxed text-muted-foreground">
        {description}
      </div>
    </div>
  )
}