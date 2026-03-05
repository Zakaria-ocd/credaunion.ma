"use client"

import { advantages } from "@/lib/data"
import { Motion } from "@/components/ui/motion"

export function Advantages() {
  return (
    <section id="advantages" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-gold/[0.03] rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-gold/[0.03] rounded-full blur-[120px] -translate-y-1/2" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <Motion variant="fade-up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/[0.08] px-4 py-2 text-sm text-gold mb-6">
              {'لماذا نحن'}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 text-balance">
              {'ميزة '}<span className="text-gradient-gold">{'الإتحاد العربي'}</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg leading-relaxed">
              {'نجمع بين عقود من الخبرة والابتكار الحديث لتقديم حلول عقارية متميزة.'}
            </p>
          </div>
        </Motion>

        {/* Advantages grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon
            return (
              <Motion
                key={index}
                variant="zoom-in"
                delay={index * 120}
                duration={600}
              >
                <div className="group relative text-center rounded-2xl border border-border/50 bg-card/50 p-8 transition-all duration-500 hover:border-gold/40 hover:shadow-2xl hover:shadow-gold/[0.08] hover:-translate-y-3">
                  {/* Top glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gold/[0.06] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative">
                    {/* Icon */}
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 border border-gold/20 transition-all duration-500 group-hover:bg-gold/20 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-gold/20">
                      <Icon className="h-8 w-8 text-gold" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-3 text-foreground transition-colors duration-300 group-hover:text-gold">
                      {advantage.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {advantage.description}
                    </p>

                    {/* Bottom accent line */}
                    <div className="mt-6 mx-auto w-10 h-0.5 rounded-full bg-gold/30 transition-all duration-500 group-hover:w-16 group-hover:bg-gold group-hover:shadow-sm group-hover:shadow-gold/50" />
                  </div>
                </div>
              </Motion>
            )
          })}
        </div>
      </div>
    </section>
  )
}
