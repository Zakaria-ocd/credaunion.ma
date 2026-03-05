"use client"

import { services } from "@/lib/data"
import { Motion } from "@/components/ui/motion"
import { ArrowLeft } from "lucide-react"

export function Services() {
  return (
    <section id="services" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <Motion variant="fade-up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/[0.08] px-4 py-2 text-sm text-gold mb-6">
              {'خدماتنا'}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 text-balance">
              {'حلول عقارية '}<span className="text-gradient-gold">{'متكاملة'}</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg leading-relaxed">
              {'من التطوير العقاري إلى إدارة المشاريع، نقدم مجموعة شاملة من الخدمات لمساعدتكم على تحقيق أهدافكم.'}
            </p>
          </div>
        </Motion>

        {/* Services grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Motion
                key={index}
                variant="flip-up"
                delay={index * 100}
                duration={700}
              >
                <div className="group relative h-full rounded-2xl border border-border/50 bg-card/50 p-8 transition-all duration-500 hover:border-gold/40 hover:shadow-2xl hover:shadow-gold/[0.08] hover:-translate-y-2">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gold/[0.06] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative">
                    {/* Icon */}
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gold/10 border border-gold/20 transition-all duration-500 group-hover:bg-gold/20 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg group-hover:shadow-gold/20">
                      <Icon className="h-7 w-7 text-gold" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 text-foreground transition-colors duration-300 group-hover:text-gold">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed mb-5">
                      {service.description}
                    </p>

                    {/* Link */}
                    <div className="flex items-center gap-2 text-gold text-sm font-medium opacity-0 translate-x-3 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
                      <span>{'اعرف المزيد'}</span>
                      <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                    </div>
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
