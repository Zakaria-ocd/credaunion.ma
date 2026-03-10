"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronRight, ChevronLeft, ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface ArticleHeroCarouselProps {
  images: string[]
  title: string
  onImageClick?: (index: number) => void
}

export function ArticleHeroCarousel({ images, title, onImageClick }: ArticleHeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "center", 
    direction: "rtl",
    duration: 40
  })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
  }, [emblaApi, onSelect])

  // Auto play
  useEffect(() => {
    if (!emblaApi) return
    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 6000)
    return () => clearInterval(interval)
  }, [emblaApi])

  if (images.length === 0) {
    return (
      <div className="relative h-full w-full bg-zinc-900 flex items-center justify-center">
        <span className="text-muted-foreground opacity-50">لا توجد صورة</span>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-black group-hero">
      <div className="w-full h-full" ref={emblaRef}>
        <div className="flex h-full w-full touch-pan-y" style={{ direction: "rtl" }}>
          {images.map((src, index) => (
            <div 
              key={index} 
              className="relative flex-[0_0_100%] min-w-0 h-full cursor-pointer overflow-hidden group/slide"
              onClick={() => onImageClick?.(index)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ 
                    scale: selectedIndex === index ? 1 : 1.1, 
                    opacity: selectedIndex === index ? 1 : 0 
                  }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={src || "/images/placeholder.jpg"}
                    alt={`${title} - ${index + 1}`}
                    className={cn(
                      "w-full h-full object-cover transition-transform duration-[10s] ease-linear",
                      selectedIndex === index && "scale-[1.15]"
                    )}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Enhanced Dark Gradient Overlays */}
              <div className="absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-black/80 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black via-black/40 to-transparent pointer-events-none" />
              
              {/* Interaction Overlay */}
              <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover/slide:opacity-100 transition-opacity duration-700 flex items-center justify-center backdrop-blur-[2px]">
                <div className="bg-gold/20 backdrop-blur-3xl rounded-full p-8 border border-gold/30 text-gold transform scale-50 group-hover/slide:scale-100 transition-all duration-700 shadow-3xl">
                  <ZoomIn className="h-10 w-10 drop-shadow-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Premium Navigation Controls */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-6 sm:px-12 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <button 
          onClick={(e) => { e.stopPropagation(); scrollPrev(); }}
          className="pointer-events-auto h-16 w-16 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-white hover:bg-gold hover:border-gold hover:text-black transition-all duration-500 transform hover:scale-110 shadow-2xl active:scale-95"
          aria-label="السابق"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); scrollNext(); }}
          className="pointer-events-auto h-16 w-16 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-white hover:bg-gold hover:border-gold hover:text-black transition-all duration-500 transform hover:scale-110 shadow-2xl active:scale-95"
          aria-label="التالي"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-64 sm:bottom-48 left-0 right-0 z-40 flex justify-center gap-3 pointer-events-none">
        {images.map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-1 rounded-full transition-all duration-1000",
              index === selectedIndex 
                ? "w-12 bg-gold shadow-[0_0_10px_rgba(185,162,95,0.5)]" 
                : "w-2 bg-white/20"
            )}
          />
        ))}
      </div>

      {/* Side Decorative Glow */}
      <div className="absolute top-1/2 -left-32 w-64 h-[50vh] -translate-y-1/2 bg-gold/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-64 h-[50vh] -translate-y-1/2 bg-gold/10 blur-[120px] rounded-full pointer-events-none" />
    </div>
  )
}


