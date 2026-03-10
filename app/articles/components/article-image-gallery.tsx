"use client"

import React, { useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, ZoomIn, Maximize2, Download, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface ArticleImageGalleryProps {
  images: string[]
  title: string
  externalOpenIndex?: number | null
  onClose?: () => void
  hideGrid?: boolean
}

export function ArticleImageGallery({ 
  images, 
  title, 
  externalOpenIndex = null, 
  onClose,
  hideGrid = false,
}: ArticleImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Sync with external control (hero carousel zoom)
  useEffect(() => {
    if (externalOpenIndex !== null && externalOpenIndex >= 0) {
      setSelectedIndex(externalOpenIndex)
      setZoomLevel(1)
    }
  }, [externalOpenIndex])

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose()
      } else if (e.key === "ArrowLeft") {
        handleNext()
      } else if (e.key === "ArrowRight") {
        handlePrevious()
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [selectedIndex, images.length])

  if (!images || images.length === 0) return null

  const handlePrevious = () => {
    if (selectedIndex === null) return
    setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : images.length - 1)
    setZoomLevel(1)
  }

  const handleNext = () => {
    if (selectedIndex === null) return
    setSelectedIndex(selectedIndex < images.length - 1 ? selectedIndex + 1 : 0)
    setZoomLevel(1)
  }

  const handleClose = () => {
    setSelectedIndex(null)
    setZoomLevel(1)
    onClose?.()
  }

  const toggleZoom = () => {
    setZoomLevel(prev => prev === 1 ? 2 : 1)
  }

  // Optimized grid layout
  const getGridLayout = () => {
    const count = images.length
    if (count === 1) return "grid-cols-1"
    if (count === 2) return "grid-cols-1 md:grid-cols-2"
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  }

  const getImageSpan = (index: number) => {
    const count = images.length
    if (count === 1) return "col-span-1 aspect-video lg:aspect-21/9"
    if (count === 2) return "col-span-1 aspect-4/3"
    if (count === 3 && index === 0) return "md:col-span-2 lg:col-span-2 aspect-video"
    if (count >= 4 && index === 0) return "md:col-span-2 aspect-video"
    return "col-span-1 aspect-4/3"
  }

  return (
    <>
      {/* ─── IMAGE GRID ─── */}
      {!hideGrid && (
        <div className="mt-20 lg:mt-32 pt-20 border-t border-white/5">
          <div className="mb-16 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <div className="h-px w-16 bg-linear-to-r from-transparent via-gold/50 to-transparent" />
              <div className="p-3 rounded-2xl bg-gold/10 border border-gold/20 text-gold shadow-lg shadow-gold/5">
                <Maximize2 className="h-6 w-6" />
              </div>
              <div className="h-px w-16 bg-linear-to-l from-transparent via-gold/50 to-transparent" />
            </motion.div>
            
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl font-extrabold text-gradient-gold mb-4 tracking-tight"
            >
              معرض الصور
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground mt-4 text-lg lg:text-xl max-w-lg mx-auto leading-relaxed"
            >
              استعرض أجمل اللحظات والتفاصيل من خلال مجموعتنا المختارة من الصور عالية الجودة
            </motion.p>
          </div>

          <div className={cn("grid gap-6 lg:gap-8", getGridLayout())}>
            {images.map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "relative group cursor-pointer overflow-hidden rounded-[2.5rem]",
                  "border border-white/10 hover:border-gold/40 bg-zinc-900/50",
                  "shadow-2xl hover:shadow-gold/20 transition-all duration-700",
                  getImageSpan(index)
                )}
              >
                <Image
                  src={src}
                  alt={`${title} - صورة ${index + 1}`}
                  fill
                  className="object-cover transition-all duration-[1.5s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110 group-hover:brightness-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                {/* Immersive Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gold/30 backdrop-blur-2xl rounded-full p-8 border border-white/20 text-white transform scale-50 group-hover:scale-100 transition-all duration-700 shadow-3xl">
                      <ZoomIn className="h-10 w-10 text-gold" />
                    </div>
                  </div>
                  
                  {/* Subtle info at bottom */}
                  <div className="absolute bottom-8 right-8 left-8 flex items-center justify-between text-white/90 translate-y-8 group-hover:translate-y-0 transition-all duration-700">
                    <span className="text-sm font-bold tracking-widest uppercase opacity-80">Photo {index + 1}</span>
                    <div className="h-px flex-1 mx-4 bg-white/20" />
                    <span className="text-xs px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">HD Quality</span>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-y-12 translate-x-12 group-hover:translate-y-0 group-hover:translate-x-0" />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ─── PREMIUM FULL SCREEN LIGHTBOX ─── */}
      {isMounted && createPortal(
        <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(40px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[99999] bg-black/90 flex flex-col items-center justify-center p-0 m-0 overflow-hidden cursor-zoom-out"
            onClick={handleClose}
          >
            {/* Top Navigation Bar */}
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
              className="absolute top-0 left-0 right-0 z-[100000] p-6 lg:p-8 flex items-center justify-between pointer-events-none bg-gradient-to-b from-black/80 via-black/40 to-transparent"
            >
              <div 
                className="flex items-center gap-6 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleClose}
                  className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-gold hover:border-gold/50 hover:bg-gold/10 transition-all duration-300 hover:scale-110 active:scale-95 group"
                  aria-label="إغلاق"
                >
                  <X className="h-6 w-6 transition-transform duration-500 group-hover:rotate-90" />
                </button>
                <div className="flex flex-col">
                  <h4 className="text-white font-medium text-lg lg:text-xl drop-shadow-md truncate max-w-[250px] lg:max-w-md">{title}</h4>
                  <p className="text-gold/80 text-sm font-medium tracking-wider">الصورة {selectedIndex + 1} من {images.length}</p>
                </div>
              </div>

              <div 
                className="flex items-center gap-4 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleZoom(); }}
                  className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-gold hover:border-gold/50 hover:bg-gold/10 transition-all duration-300 hover:scale-110 active:scale-95"
                  title={zoomLevel > 1 ? "تصغير" : "تكبير"}
                >
                  <ZoomIn className={cn("h-5 w-5", zoomLevel > 1 && "hidden")} />
                  <Maximize2 className={cn("h-5 w-5", zoomLevel === 1 && "hidden")} />
                </button>
              </div>
            </motion.div>

            {/* Main Interactive Image Container */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
              }}
              className="relative w-full flex-1 flex items-center justify-center pointer-events-auto px-4 sm:px-16"
              onClick={handleClose}
            >
              {/* Image Ambient Glow */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[40vh] bg-gold/5 blur-[120px] rounded-[100%] pointer-events-none" />
              
              <div 
                className={cn(
                  "relative max-w-[95vw] sm:max-w-7xl max-h-[75vh] sm:max-h-[80vh] flex items-center justify-center transition-transform duration-700 ease-[0.16,1,0.3,1] pointer-events-auto cursor-zoom-in group",
                  zoomLevel > 1 && "scale-[1.7] cursor-zoom-out"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleZoom();
                }}
              >
                <img
                  src={images[selectedIndex]}
                  alt={`${title} - صورة ${selectedIndex + 1}`}
                  className="max-w-full max-h-[75vh] sm:max-h-[80vh] w-auto h-auto object-contain rounded-xl shadow-[0_0_100px_rgba(0,0,0,0.8)] ring-1 ring-white/10 group-hover:ring-gold/30 transition-all duration-700 bg-black/40 backdrop-blur-sm"
                />
              </div>

              {/* Ultra-Premium Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 z-[100000] w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-black/40 backdrop-blur-3xl border border-white/10 text-white/70 hover:text-gold hover:border-gold/50 hover:bg-gold/10 hover:shadow-[0_0_40px_rgba(185,162,95,0.3)] transition-all duration-500 hover:scale-110 active:scale-95 flex items-center justify-center pointer-events-auto group"
                    onClick={(e) => { e.stopPropagation(); handleNext(); }} // Mirrored for RTL
                    aria-label="الصورة التالية"
                  >
                    <ChevronLeft className="h-8 w-8 lg:h-10 lg:w-10 transition-transform duration-500 group-hover:-translate-x-1" />
                  </button>
                  <button
                    className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 z-[100000] w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-black/40 backdrop-blur-3xl border border-white/10 text-white/70 hover:text-gold hover:border-gold/50 hover:bg-gold/10 hover:shadow-[0_0_40px_rgba(185,162,95,0.3)] transition-all duration-500 hover:scale-110 active:scale-95 flex items-center justify-center pointer-events-auto group"
                    onClick={(e) => { e.stopPropagation(); handlePrevious(); }} // Mirrored for RTL
                    aria-label="الصورة السابقة"
                  >
                    <ChevronRight className="h-8 w-8 lg:h-10 lg:w-10 transition-transform duration-500 group-hover:translate-x-1" />
                  </button>
                </>
              )}
            </motion.div>

            {/* Bottom Controls & Thumbnails */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute bottom-0 left-0 right-0 z-[100000] pb-6 lg:pb-10 pt-32 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center gap-6 pointer-events-none"
            >
              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-3 p-2 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 max-w-[90vw] sm:max-w-2xl overflow-x-auto no-scrollbar pointer-events-auto shadow-2xl"
                >
                  {images.map((src, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => { e.stopPropagation(); setSelectedIndex(idx); setZoomLevel(1); }}
                      className={cn(
                        "relative flex-none w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden transition-all duration-500",
                        idx === selectedIndex 
                          ? "ring-2 ring-gold ring-offset-2 ring-offset-black opacity-100 scale-100" 
                          : "opacity-40 hover:opacity-100 hover:scale-105 scale-95"
                      )}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
        document.body
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  )
}
