interface MeetingHeaderProps {
  title: string
}

export function MeetingHeader({ title }: MeetingHeaderProps) {
  return (
    <h1 className="text-3xl font-bold text-foreground mb-4">
      {title}
    </h1>
  )
}