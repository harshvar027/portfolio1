"use client"

import { ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"

export default function ScrollIndicator({ visible }: { visible: boolean }) {
  const [show, setShow] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 2000)
    return () => clearTimeout(timer)
  }, [])
  
  if (!visible || !show) return null
  
  return (
    <div className="fixed bottom-8 left-1/2 z-20 -translate-x-1/2 animate-bounce">
      <div className="flex flex-col items-center gap-2 text-foreground/60">
        <span className="text-sm tracking-widest uppercase">Scroll to explore</span>
        <ChevronDown className="h-6 w-6 text-primary" />
      </div>
    </div>
  )
}
