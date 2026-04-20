"use client"

import { cn } from "@/lib/utils"
import { navLogoLetter, sectionNav } from "@/lib/portfolio-content"

const sections = [...sectionNav]

export default function CyberNav({ 
  scrollProgress, 
  onNavigate 
}: { 
  scrollProgress: number
  onNavigate: (progress: number) => void 
}) {
  const getCurrentSection = () => {
    for (let i = sections.length - 1; i >= 0; i--) {
      if (scrollProgress >= sections[i].progress) {
        return sections[i].id
      }
    }
    return sections[0].id
  }
  
  const currentSection = getCurrentSection()
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
      {/* Logo */}
      <div className="font-mono text-lg font-bold tracking-wider text-primary">
        <span className="text-neon-cyan">{"<"}</span>
        {navLogoLetter}
        <span className="text-neon-magenta">/</span>
        <span className="text-neon-cyan">{">"}</span>
      </div>
      
      {/* Navigation links */}
      <div className="flex items-center gap-8">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onNavigate(section.progress)}
            className={cn(
              "relative py-2 text-sm font-medium tracking-wider uppercase transition-all duration-300",
              currentSection === section.id
                ? "text-primary"
                : "text-foreground/60 hover:text-foreground"
            )}
          >
            {section.label}
            {currentSection === section.id && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary shadow-[0_0_10px_currentColor]" />
            )}
          </button>
        ))}
      </div>
      
      {/* Progress indicator */}
      <div className="flex items-center gap-3">
        <div className="h-1 w-20 overflow-hidden rounded-full bg-foreground/10">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta transition-all duration-300"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <span className="font-mono text-xs text-foreground/40">
          {Math.round(scrollProgress * 100)}%
        </span>
      </div>
    </nav>
  )
}
