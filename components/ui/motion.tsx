"use client"

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react"
import { cn } from "@/lib/utils"

type AnimationVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "zoom-out"
  | "flip-up"
  | "blur-in"

interface MotionProps {
  children: ReactNode
  variant?: AnimationVariant
  delay?: number
  duration?: number
  className?: string
  once?: boolean
  threshold?: number
  as?: keyof HTMLElementTagNameMap
}

const variantStyles: Record<AnimationVariant, { from: CSSProperties; to: CSSProperties }> = {
  "fade-up": {
    from: { opacity: 0, transform: "translateY(40px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "fade-down": {
    from: { opacity: 0, transform: "translateY(-40px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "fade-left": {
    from: { opacity: 0, transform: "translateX(40px)" },
    to: { opacity: 1, transform: "translateX(0)" },
  },
  "fade-right": {
    from: { opacity: 0, transform: "translateX(-40px)" },
    to: { opacity: 1, transform: "translateX(0)" },
  },
  "zoom-in": {
    from: { opacity: 0, transform: "scale(0.85)" },
    to: { opacity: 1, transform: "scale(1)" },
  },
  "zoom-out": {
    from: { opacity: 0, transform: "scale(1.15)" },
    to: { opacity: 1, transform: "scale(1)" },
  },
  "flip-up": {
    from: { opacity: 0, transform: "perspective(600px) rotateX(15deg) translateY(30px)" },
    to: { opacity: 1, transform: "perspective(600px) rotateX(0deg) translateY(0)" },
  },
  "blur-in": {
    from: { opacity: 0, filter: "blur(12px)" },
    to: { opacity: 1, filter: "blur(0)" },
  },
}

export function Motion({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 700,
  className,
  once = true,
  threshold = 0.15,
}: MotionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.unobserve(element)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.unobserve(element)
  }, [once, threshold])

  const { from, to } = variantStyles[variant]

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        ...(isVisible ? to : from),
        transition: `all ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: "transform, opacity, filter",
      }}
    >
      {children}
    </div>
  )
}

// Stagger container for children animations
interface StaggerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  variant?: AnimationVariant
  duration?: number
  threshold?: number
}

export function Stagger({
  children,
  className,
  staggerDelay = 100,
  variant = "fade-up",
  duration = 600,
  threshold = 0.1,
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.unobserve(element)
  }, [threshold])

  const { from, to } = variantStyles[variant]
  const items = Array.isArray(children) ? children : [children]

  return (
    <div ref={ref} className={cn(className)}>
      {items.map((child, index) => (
        <div
          key={index}
          style={{
            ...(isVisible ? to : from),
            transition: `all ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${index * staggerDelay}ms`,
            willChange: "transform, opacity, filter",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

// Number counter animation
interface CounterProps {
  target: string
  className?: string
  duration?: number
}

export function Counter({ target, className, duration = 2000 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [display, setDisplay] = useState(target.replace(/[\d.]/g, "0").replace(/,/g, ""))

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(element)
    return () => observer.unobserve(element)
  }, [hasAnimated])

  useEffect(() => {
    if (!hasAnimated) return

    // Extract numeric value
    const numericString = target.replace(/[^\d.]/g, "")
    const targetNum = parseFloat(numericString)
    if (isNaN(targetNum)) {
      setDisplay(target)
      return
    }

    const prefix = target.match(/^[^\d]*/)?.[0] || ""
    const suffix = target.match(/[^\d]*$/)?.[0] || ""
    const hasDecimal = numericString.includes(".")
    const decimalPlaces = hasDecimal ? numericString.split(".")[1]?.length || 0 : 0
    const hasComma = target.includes(",")

    const startTime = performance.now()

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      let currentVal = eased * targetNum

      let formatted: string
      if (hasDecimal) {
        formatted = currentVal.toFixed(decimalPlaces)
      } else {
        formatted = Math.round(currentVal).toString()
      }

      if (hasComma) {
        formatted = Number(formatted).toLocaleString("en-US")
      }

      setDisplay(`${prefix}${formatted}${suffix}`)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplay(target)
      }
    }

    requestAnimationFrame(animate)
  }, [hasAnimated, target, duration])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}

// Magnetic hover effect wrapper
interface MagneticProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function Magnetic({ children, className, strength = 0.3 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`
  }

  const handleMouseLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = "translate(0, 0)"
  }

  return (
    <div
      ref={ref}
      className={cn("transition-transform duration-300 ease-out", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}
