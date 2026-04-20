"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import dynamic from "next/dynamic"
import CyberNav from "@/components/cyber-nav"
import ScrollIndicator from "@/components/scroll-indicator"
import { sectionNav } from "@/lib/portfolio-content"

// Dynamic import for the 3D scene to avoid SSR issues
const CyberScene = dynamic(() => import("@/components/cyber-scene"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-background" />
  ),
})

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [targetProgress, setTargetProgress] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  
  // Smooth scroll interpolation
  useEffect(() => {
    if (isScrolling) return
    
    const animate = () => {
      setScrollProgress((prev) => {
        const diff = targetProgress - prev
        if (Math.abs(diff) < 0.001) return targetProgress
        return prev + diff * 0.08
      })
    }
    
    const interval = setInterval(animate, 16)
    return () => clearInterval(interval)
  }, [targetProgress, isScrolling])
  
  // Handle wheel scroll
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    
    setIsScrolling(true)
    setTargetProgress((prev) => {
      const delta = e.deltaY * 0.0005
      const newProgress = Math.max(0, Math.min(1, prev + delta))
      return newProgress
    })
    
    // Debounce scroll end
    const timeout = setTimeout(() => setIsScrolling(false), 100)
    return () => clearTimeout(timeout)
  }, [])
  
  // Handle touch scroll
  const [touchStart, setTouchStart] = useState(0)
  
  const handleTouchStart = useCallback((e: TouchEvent) => {
    setTouchStart(e.touches[0].clientY)
  }, [])
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault()
    const touchDelta = touchStart - e.touches[0].clientY
    
    setIsScrolling(true)
    setTargetProgress((prev) => {
      const delta = touchDelta * 0.002
      const newProgress = Math.max(0, Math.min(1, prev + delta))
      return newProgress
    })
    setTouchStart(e.touches[0].clientY)
    
    const timeout = setTimeout(() => setIsScrolling(false), 100)
    return () => clearTimeout(timeout)
  }, [touchStart])
  
  // Handle navigation click
  const handleNavigate = useCallback((progress: number) => {
    setTargetProgress(progress)
  }, [])
  
  // Set up event listeners
  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchmove", handleTouchMove, { passive: false })
    
    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [handleWheel, handleTouchStart, handleTouchMove])
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const step = 1 / sectionNav.length
      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault()
        setTargetProgress((prev) => Math.min(1, prev + step))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setTargetProgress((prev) => Math.max(0, prev - step))
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])
  
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background">
      <CyberNav scrollProgress={scrollProgress} onNavigate={handleNavigate} />
      
      <Suspense fallback={<div className="fixed inset-0 bg-background" />}>
        <CyberScene scrollProgress={scrollProgress} />
      </Suspense>
      
      <ScrollIndicator visible={scrollProgress < 0.1} />
      
      {/* Section indicators */}
      <div className="fixed right-8 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-3">
        {sectionNav.map((section, i) => {
          const next = sectionNav[i + 1]?.progress ?? 1
          const active =
            scrollProgress >= section.progress &&
            (i === sectionNav.length - 1 ? scrollProgress <= 1 : scrollProgress < next)
          return (
            <button
              key={section.id}
              onClick={() => handleNavigate(section.progress)}
              className={`h-3 w-3 rounded-full border-2 transition-all duration-300 ${
                active
                  ? "scale-125 border-primary bg-primary shadow-[0_0_10px_var(--primary)]"
                  : "border-foreground/30 bg-transparent hover:border-foreground/60"
              }`}
              aria-label={`Go to ${section.label}`}
            />
          )
        })}
      </div>
      
      {/* Footer */}
      <footer className="fixed bottom-4 left-1/2 z-20 -translate-x-1/2 text-center font-mono text-xs text-foreground/40">
        <span className="text-neon-cyan">{"{"}</span>
        {" built with love "}
        <span className="text-neon-magenta">{"}"}</span>
      </footer>
    </main>
  )
}
