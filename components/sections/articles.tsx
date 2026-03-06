"use client"

import { useState, useEffect } from "react"
import { articles as staticArticles } from "@/lib/data"
import { Motion } from "@/components/ui/motion"
import { ArrowLeft, Calendar, Clock, Tag, ArrowUpLeft, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Article } from "@/lib/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface ArticlesProps {
  initialArticles?: Article[]
  initialTotalPages?: number
}

export function Articles({ initialArticles = [], initialTotalPages = 0 }: ArticlesProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(6)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/articles?page=${page}&limit=${limit}`)
      if (res.ok) {
        const data = await res.json()
        setArticles(data.articles || [])
        setTotalPages(data.totalPages || 0)
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error)
    } finally {
      setLoading(false)
    }
  }

  // Refetch when page or limit changes, but skip the very first render 
  // since we already have the initial data from server.
  useEffect(() => {
    if (!mounted) return
    fetchArticles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, mounted])

  const handleLimitChange = (value: string) => {
    setLimit(parseInt(value))
    setPage(1)
  }

  // Map dynamic data to the structure the user's design expects
  const articlesToDisplay = (articles.length > 0 ? articles : staticArticles).map(art => ({
    id: art.id,
    title: art.title,
    excerpt: art.excerpt,
    // Handle property name differences between dynamic/static
    image: (art as any).cover_image_url || (art as any).image,
    date: (art as any).date || new Date((art as any).published_at || (art as any).created_at).toLocaleDateString("ar", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    category: (art as any).category || "رؤى السوق",
    readTime: (art as any).readTime || "5 دقائق قراءة",
    slug: (art as any).slug
  }))

  return (
    <section id="articles" className="relative py-24 lg:py-32 bg-secondary/20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-linear-to-r from-transparent via-gold/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <Motion variant="fade-up">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/[0.08] px-4 py-2 text-sm text-gold mb-6">
                {'آخر الأخبار'}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
                {'أخبار '}<span className="text-gradient-gold">{'وتحليلات'}</span>
              </h2>
            </div>

            <div className="flex items-center gap-4 bg-card/30 p-2 rounded-2xl border border-border/50 shrink-0">
              <span className="text-sm text-muted-foreground mr-2">{'عرض:'}</span>
              <Select value={limit.toString()} onValueChange={handleLimitChange}>
                <SelectTrigger className="w-20 bg-background border-border/50 focus:ring-gold/30">
                  <SelectValue placeholder="6" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Motion>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-gold" />
            <p className="text-muted-foreground animate-pulse">{'جاري تحميل المقالات...'}</p>
          </div>
        ) : articlesToDisplay.length === 0 ? (
          <div className="text-center py-20 bg-card/20 rounded-3xl border border-dashed border-border/50">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 text-gold mb-6">
              <Tag className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{'لا توجد مقالات'}</h3>
            <p className="text-muted-foreground">{'لم يتم نشر أي مقالات في هذا القسم بعد.'}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {articlesToDisplay.map((article, index) => (
              <Motion
                key={article.id}
                variant="fade-up"
                delay={index * 100}
              >
                <Link href={`/articles/${article.slug}`}>
                  <article className="group h-full flex flex-col rounded-3xl border border-border/50 bg-card/50 overflow-hidden transition-all duration-500 hover:border-gold/40 hover:shadow-2xl hover:shadow-gold/[0.08] hover:-translate-y-2">
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image
                        src={article.image || "/images/placeholder.jpg"}
                        alt={article.title}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                      />
                      <div className="absolute top-4 right-4 rounded-full bg-gold text-primary-foreground px-4 py-1.5 text-xs font-bold shadow-lg shadow-gold/30">
                        {article.category}
                      </div>
                    </div>
                    
                    <div className="flex-1 p-8">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {article.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {article.readTime}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-4 text-foreground leading-tight transition-colors duration-300 group-hover:text-gold line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-2 text-gold font-medium transition-all duration-300 group-hover:gap-3 mt-auto">
                        <span>{'اقرأ المزيد'}</span>
                        <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                      </div>
                    </div>
                  </article>
                </Link>
              </Motion>
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <Pagination>
              <PaginationContent className="bg-card/50 border border-border/50 p-1 rounded-full px-4" dir="ltr">
                {page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setPage(page - 1)} 
                      className="cursor-pointer hover:bg-gold/10 hover:text-gold border-none" 
                    />
                  </PaginationItem>
                )}
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      onClick={() => setPage(p)}
                      isActive={page === p}
                      className={`cursor-pointer border-none rounded-full h-10 w-10 ${
                        page === p 
                          ? "bg-gold text-primary-foreground hover:bg-gold-light" 
                          : "hover:bg-gold/10 hover:text-gold"
                      }`}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {page < totalPages && (
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setPage(page + 1)} 
                      className="cursor-pointer hover:bg-gold/10 hover:text-gold border-none" 
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </section>
  )
}
