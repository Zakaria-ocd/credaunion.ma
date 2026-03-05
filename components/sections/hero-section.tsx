"use client"

import Image from "next/image"
import { ArrowLeft, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-32 pb-20 lg:pt-44 lg:pb-32">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="مشاريع عقارية حديثة"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
            <span className="flex h-2 w-2 rounded-full bg-accent" />
            <span className="text-xs font-medium text-muted-foreground">
              {'أكثر من 2,000 عميل يثقون بنا حول العالم'}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            الإتحاد العربي
            <span className="block text-primary">للبناء والتنمية العقارية</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            نقدم حلولاً عقارية متكاملة تشمل الاستشارات العقارية، إدارة المشاريع، والتخطيط الاستراتيجي لتحقيق رؤيتكم وتأمين مستقبلكم.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
            >
              خدماتنا
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-border px-8 text-foreground hover:bg-secondary"
            >
              تواصل معنا
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mx-auto mt-20 max-w-4xl">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { value: "+25", label: "سنة خبرة" },
              { value: "+2,000", label: "عميل نشط" },
              { value: "$4.2B", label: "أصول مُدارة" },
              { value: "98%", label: "رضا العملاء" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="group rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6 text-center transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  <span className="text-2xl font-bold text-foreground lg:text-3xl">
                    {stat.value}
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
