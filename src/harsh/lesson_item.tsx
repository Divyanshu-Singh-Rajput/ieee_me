import { ChevronRight } from "lucide-react"

interface LessonItemProps {
  label: string
  isLast?: boolean
}

export function LessonItem({ label, isLast = false }: LessonItemProps) {
  return (
    <button
      className={`flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        !isLast ? "border-b border-border" : ""
      }`}
      aria-label={`Open lesson: ${label}`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-muted-foreground/40">
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </span>
      <span className="text-sm font-medium text-card-foreground md:text-base">
        {label}
      </span>
    </button>
  )
}
