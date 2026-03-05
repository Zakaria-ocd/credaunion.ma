"use client"

import { articles } from "@/lib/data"
import { Motion } from "@/components/ui/motion"
import { ArrowLeft, Calendar, Clock, Tag, ArrowUpLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Articles() {
  const featured = articles[0]
  const rest = articles.slice(1)

  return (
    <section id="articles" className="relative py-24 lg:py-32 bg-secondary/20 overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <Motion variant="fade-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/[0.08] px-4 py-2 text-sm text-gold mb-6">
                {'آخر الأخبار'}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
                {'أخبار '}<span className="text-gradient-gold">{'وتحليلات'}</span>
              </h2>
            </div>
            <Button
              variant="outline"
              className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold-light transition-all duration-300 hover:scale-105 hover:border-gold/50 shrink-0"
            >
              {'عرض جميع المقالات'}
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </Motion>

        {/* Featured + Grid layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Featured article - large card */}
          <Motion variant="fade-right" delay={100} duration={800}>
            <article className="group relative h-full rounded-3xl border border-border/50 bg-card/50 overflow-hidden transition-all duration-600 hover:border-gold/40 hover:shadow-2xl hover:shadow-gold/[0.08]">
              {/* Image area */}
              <div className="relative h-64 lg:h-72 overflow-hidden">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

                {/* Category badge */}
                <div className="absolute top-5 right-5 flex items-center gap-1.5 rounded-full bg-gold text-primary-foreground px-4 py-1.5 text-xs font-bold shadow-lg shadow-gold/30 transition-all duration-300 group-hover:scale-105">
                  <Tag className="h-3 w-3" />
                  {featured.category}
                </div>

                {/* Arrow icon on hover */}
                <div className="absolute top-5 left-5 flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 backdrop-blur-sm border border-foreground/10 opacity-0 scale-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100">
                  <ArrowUpLeft className="h-5 w-5 text-foreground" />
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Meta info */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {featured.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {featured.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-4 text-foreground leading-snug transition-colors duration-300 group-hover:text-gold">
                  {featured.title}
                </h3>

                {/* Excerpt */}
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {featured.excerpt}
                </p>

                {/* Read more */}
                <div className="flex items-center gap-2 text-gold font-medium transition-all duration-300 group-hover:gap-3">
                  <span>{'اقرأ المزيد'}</span>
                  <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                </div>
              </div>
            </article>
          </Motion>

          {/* Side articles */}
          <div className="flex flex-col gap-6">
            {rest.map((article, index) => (
              <Motion
                key={article.id}
                variant="fade-left"
                delay={200 + index * 150}
                duration={700}
              >
                <article className="group relative flex flex-col sm:flex-row rounded-2xl border border-border/50 bg-card/50 overflow-hidden transition-all duration-500 hover:border-gold/40 hover:shadow-2xl hover:shadow-gold/[0.08] hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                    />
                    <div className="absolute inset-0 bg-background/30 transition-opacity duration-500 group-hover:opacity-0" />
                    {/* Category */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-gold text-primary-foreground px-3 py-1 text-[10px] font-bold shadow-md">
                      <Tag className="h-2.5 w-2.5" />
                      {article.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col justify-center">
                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-2 text-foreground leading-snug transition-colors duration-300 group-hover:text-gold line-clamp-2">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-3">
                      {article.excerpt}
                    </p>

                    {/* Read more */}
                    <div className="flex items-center gap-2 text-gold text-sm font-medium opacity-0 translate-x-2 transition-all duration-400 group-hover:opacity-100 group-hover:translate-x-0">
                      <span>{'اقرأ المزيد'}</span>
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </article>
              </Motion>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
