"use client"

import { steps } from "@/lib/data"
import { Motion } from "@/components/ui/motion"

export function Process() {
  return (
    <section id="process" className="relative py-24 lg:py-32 bg-secondary/20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <Motion variant="fade-up">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/[0.08] px-4 py-2 text-sm text-gold mb-6">
              {'آلية العمل'}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 text-balance">
              {'طريقكم نحو '}<span className="text-gradient-gold">{'النجاح العقاري'}</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg leading-relaxed">
              {'عملية واضحة وشفافة مصممة لتحقيق أفضل النتائج.'}
            </p>
          </div>
        </Motion>

        {/* Steps */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line */}
          <div className="absolute top-0 bottom-0 right-[39px] lg:right-1/2 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-gold/40 hidden sm:block" />

          <div className="flex flex-col gap-12 lg:gap-16">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0
              return (
                <Motion
                  key={index}
                  variant={isEven ? "fade-right" : "fade-left"}
                  delay={index * 150}
                  duration={800}
                >
                  <div className={`relative flex items-center gap-6 lg:gap-12 ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                    {/* Step number node */}
                    <div className="hidden sm:flex absolute right-5 lg:right-auto lg:left-1/2 lg:-translate-x-1/2 z-10">
                      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-background border-2 border-gold/40 transition-all duration-500 hover:border-gold hover:shadow-xl hover:shadow-gold/20 hover:scale-110">
                        <span className="text-2xl font-bold text-gold">{step.number}</span>
                      </div>
                    </div>

                    {/* Content card */}
                    <div className={`flex-1 sm:pr-20 lg:pr-0 ${isEven ? "lg:text-left lg:pl-0 lg:pr-[calc(50%+48px)]" : "lg:text-right lg:pr-0 lg:pl-[calc(50%+48px)]"}`}>
                      <div className="group rounded-2xl border border-border/50 bg-card/50 p-8 transition-all duration-500 hover:border-gold/40 hover:shadow-2xl hover:shadow-gold/[0.08] hover:-translate-y-1">
                        {/* Mobile step number */}
                        <div className="sm:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 border border-gold/30 mb-4">
                          <span className="text-lg font-bold text-gold">{step.number}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-foreground transition-colors duration-300 group-hover:text-gold">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Motion>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
