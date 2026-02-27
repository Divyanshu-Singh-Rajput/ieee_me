"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { ModuleIcon } from "@/components/module-icon"
import { LessonItem } from "@/components/lesson-item"

interface CourseModuleProps {
  title: string
  lessons: string[]
  defaultExpanded?: boolean
}

export function CourseModule({
  title,
  lessons,
  defaultExpanded = false,
}: CourseModuleProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <button
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:px-6 md:py-5"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={`module-content-${title.replace(/\s+/g, "-")}`}
      >
        <div className="flex items-center gap-4">
          <ModuleIcon />
          <h2 className="text-base font-bold text-card-foreground md:text-lg lg:text-xl text-balance">
            {title}
          </h2>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform">
          {expanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </span>
      </button>

      {/* Collapsible content */}
      <div
        id={`module-content-${title.replace(/\s+/g, "-")}`}
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{
          gridTemplateRows: expanded ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border">
            {lessons.map((lesson, index) => (
              <LessonItem
                key={lesson}
                label={lesson}
                isLast={index === lessons.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
