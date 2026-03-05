"use client"

import { useState, useEffect } from "react"
import { Menu, X} from "lucide-react"
import { navLinks } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("#hero")

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      // Track active section
      const sections = navLinks.map((l) => l.href.replace("#", ""))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(`#${sections[i]}`)
          break
        }
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-2xl shadow-black/30"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
           <Link href="#" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="الإتحاد العربي للبناء والتنمية العقارية"
            width={60}
            height={42}
            className="h-14 w-auto"
            priority
          />
        </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg",
                  activeSection === link.href
                    ? "text-gold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                {activeSection === link.href && (
                  <span className="absolute bottom-0 right-1/2 translate-x-1/2 h-0.5 w-4 rounded-full bg-gold" />
                )}
              </a>
            ))}
            <Button
              asChild
              className="mr-2 bg-gold text-primary-foreground hover:bg-gold-light transition-all duration-300 hover:shadow-lg hover:shadow-gold/25 hover:scale-105"
            >
              <a href="#contact">{'تواصل معنا'}</a>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-foreground hover:text-gold transition-colors duration-300 p-2"
            aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            <div className="relative w-6 h-6">
              <Menu
                className={cn(
                  "h-6 w-6 absolute inset-0 transition-all duration-300",
                  isOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
                )}
              />
              <X
                className={cn(
                  "h-6 w-6 absolute inset-0 transition-all duration-300",
                  isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isOpen
            ? "max-h-[500px] opacity-100 bg-background/95 backdrop-blur-xl border-b border-border/50"
            : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:bg-gold/10 hover:text-gold",
                activeSection === link.href
                  ? "bg-gold/10 text-gold"
                  : "text-muted-foreground"
              )}
              style={{
                transitionDelay: isOpen ? `${i * 50}ms` : "0ms",
                transform: isOpen ? "translateX(0)" : "translateX(20px)",
                opacity: isOpen ? 1 : 0,
              }}
            >
              {link.label}
            </a>
          ))}
          <Button
            asChild
            className="mt-3 bg-gold text-primary-foreground hover:bg-gold-light w-full"
          >
            <a href="#contact" onClick={() => setIsOpen(false)}>
              {'تواصل معنا'}
            </a>
          </Button>
        </div>
      </div>
    </nav>
  )
}
