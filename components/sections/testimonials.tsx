"use client"

import { testimonials } from "@/lib/data"
import { Motion } from "@/components/ui/motion"
import { Quote } from "lucide-react"

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/[0.03] rounded-full blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <Motion variant="fade-up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/[0.08] px-4 py-2 text-sm text-gold mb-6">
              {'آراء العملاء'}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 text-balance">
              {'موثوق من '}<span className="text-gradient-gold">{'قادة القطاعات المختلفة'}</span>
            </h2>
          </div>
        </Motion>

        {/* Testimonial */}
        <div className="max-w-3xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Motion key={index} variant="zoom-in" delay={200} duration={800}>
              <div className="group relative rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 md:p-12 transition-all duration-500 hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/[0.06]">
                {/* Quote icon */}
                <div className="absolute top-8 left-8 md:top-10 md:left-10">
                  <Quote className="h-10 w-10 text-gold/20 transition-colors duration-500 group-hover:text-gold/40" />
                </div>

                {/* Content */}
                <div className="relative pt-8">
                  <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-8 text-pretty">
                    {`"${testimonial.content}"`}
                  </blockquote>

                  {/* Divider */}
                  <div className="w-16 h-0.5 rounded-full bg-gold/30 mb-6 transition-all duration-500 group-hover:w-24 group-hover:bg-gold" />

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold/10 border border-gold/20 text-gold font-bold text-lg transition-all duration-300 group-hover:bg-gold/20 group-hover:scale-105">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-lg">{testimonial.name}</p>
                      <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Motion>
          ))}
        </div>
      </div>
    </section>
  )
}
