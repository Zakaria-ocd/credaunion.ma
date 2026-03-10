"use client"

import { useEffect, useState } from "react"

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const currentProgress = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight) {
        setProgress(Number((currentProgress / scrollHeight).toFixed(2)) * 100)
      }
    }

    window.addEventListener("scroll", updateProgress)
    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-100 h-1.5 w-full bg-white/5 pointer-events-none">
      <div 
        className="h-full bg-gold transition-all duration-150 ease-out shadow-[0_0_10px_rgba(185,162,95,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
