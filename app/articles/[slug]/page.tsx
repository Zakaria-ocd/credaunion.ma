"use client"

import React, { useState, useEffect } from "react"
import { Calendar, Clock, User, ArrowRight, Images, BookOpen, Tag } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArticleHeroCarousel } from "../components/article-hero-carousel"
import { ArticleImageGallery } from "../components/article-image-gallery"
import { ArticleSocialShare } from "../components/article-social-share"
import { ReadingProgress } from "../components/reading-progress"
import { Footer } from "@/components/sections/footer"
import { createClient } from "@/utils/supabase/client"
import {motion} from "framer-motion"

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params)
  const [article, setArticle] = useState<any>(null)
  const [author, setAuthor] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [heroZoomIndex, setHeroZoomIndex] = useState<number | null>(null)

  const decodedSlug = decodeURIComponent(slug)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      
      const { data: dbArticle } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", decodedSlug)
        .single()

      if (dbArticle) {
        setArticle(dbArticle)
        
        // Fetch Author
        if (dbArticle.author_id) {
          const { data: authorData } = await supabase
            .from("admins")
            .select("email")
            .eq("id", dbArticle.author_id)
            .single()
          if (authorData) setAuthor(authorData)
        }

        // Fetch Related articles (same category first, then any)
        const { data: relatedData } = await supabase
          .from("articles")
          .select("*")
          .neq("slug", decodedSlug)
          .not("published_at", "is", null)
          .limit(3)
          .order("created_at", { ascending: false })
        if (relatedData) setRelated(relatedData)
      }
      setLoading(false)
    }
    fetchData()
  }, [decodedSlug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-2 border-gold/20"></div>
            <div className="absolute inset-0 rounded-full border-2 border-gold border-t-transparent animate-spin"></div>
          </div>
          <p className="text-muted-foreground text-lg animate-pulse">جارٍ تحميل المقال...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center" dir="rtl">
        <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center mb-8">
          <BookOpen className="w-12 h-12 text-gold" />
        </div>
        <h1 className="text-4xl font-bold text-gradient-gold mb-4">المقال غير موجود</h1>
        <p className="text-muted-foreground mb-8 text-xl max-w-md">عذراً، لم نتمكن من العثور على المقال الذي تبحث عنه.</p>
        <Link href="/#articles">
          <Button className="bg-gold text-primary-foreground hover:bg-gold-light rounded-full px-8 py-6 text-lg">
            <ArrowRight className="h-5 w-5 ml-2" />
            العودة لجميع المقالات
          </Button>
        </Link>
      </div>
    )
  }

  const publishDate = new Date(article.published_at || article.created_at).toLocaleDateString("ar", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const wordCount = (article.content || "").split(/\s+/).length
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  // Combine all images (cover + gallery) for the swiper
  const allImages = []
  if (article.cover_image_url) allImages.push(article.cover_image_url)
  if (article.images && Array.isArray(article.images)) {
    // Filter out empty strings or duplicate cover image
const galleryImages = article.images.filter((img: string) => img && img !== article.cover_image_url)
    allImages.push(...galleryImages)
  }
  
  // Ensure we have at least a placeholder if no images
  if (allImages.length === 0) allImages.push("/images/placeholder.jpg")
  
  const imageCount = allImages.length

  
  // Drop cap effect
  const contentText = article.content?.trim() || ""
  const firstChar = contentText.charAt(0)
  const remainingContent = contentText.slice(1)

  const authorName = author ? author.email.split("@")[0] : "فريق التحرير"
  const categoryName = article.category || "مقالات"

  return (
    <main className="min-h-screen bg-background relative" dir="rtl">
      <ReadingProgress />
      
      {/* ─── HERO ZOOM LIGHTBOX (invisible, only shows when heroZoomIndex is set) ─── */}
      <ArticleImageGallery 
        images={allImages} 
        title={article.title} 
        externalOpenIndex={heroZoomIndex}
        onClose={() => setHeroZoomIndex(null)}
        hideGrid={true}
      />

      {/* ════════════════════ FLOATING NAV ════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-40 p-4 sm:p-6 pointer-events-none">
        <div className="w-full flex justify-between items-center px-2 sm:px-4">
          <Link
            href="/#articles"
            className="pointer-events-auto inline-flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 hover:border-gold/30 text-white px-5 py-2.5 rounded-full transition-all duration-300 shadow-2xl hover:shadow-gold/10"
          >
            <ArrowRight className="h-4 w-4" />
            <span className="font-medium text-sm">العودة للرئيسية</span>
          </Link>
          {imageCount > 1 && (
            <div className="pointer-events-auto flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/10 text-white/80 px-4 py-2 rounded-full text-sm">
              <Images className="h-4 w-4 text-gold" />
              <span>{imageCount} صور</span>
            </div>
          )}
        </div>
      </nav>

      {/* ════════════════════ IMMERSIVE HERO ════════════════════ */}
      <section className="relative h-[80vh] min-h-[700px] w-full overflow-hidden bg-black">
        <ArticleHeroCarousel 
          images={allImages} 
          title={article.title} 
          onImageClick={(idx) => setHeroZoomIndex(idx)}
        />
        
        {/* Hero Overlay - Category & Title */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-24 sm:pb-32 bg-linear-to-t from-black via-black/60 to-transparent">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center sm:text-right">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 backdrop-blur-xl px-5 py-2 text-sm font-semibold text-gold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
                <Tag className="h-3.5 w-3.5" />
                {categoryName}
              </div>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-8 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200 fill-mode-both">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-white/70 text-sm font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
                <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
                  <User className="h-4 w-4 text-gold" />
                  <span>{authorName}</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
                  <Calendar className="h-4 w-4 text-gold" />
                  <span>{publishDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ MAIN CONTENT ════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Ambient glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold/3 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold/2 blur-[100px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 relative z-10 py-16 lg:py-24">

          {/* ─── EXCERPT ─── */}
          {article.excerpt && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-14 overflow-hidden"
            >
              <div className="relative p-10 sm:p-14 rounded-[3rem] bg-linear-to-br from-gold/15 via-gold/5 to-transparent border border-gold/30 backdrop-blur-xl shadow-3xl group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-gold/20 transition-all duration-1000" />
                <div className="absolute -right-px top-12 bottom-12 w-2 bg-linear-to-b from-transparent via-gold to-transparent rounded-full shadow-[0_0_20px_rgba(185,162,95,0.6)]" />
                <p className="text-xl sm:text-2xl lg:text-3xl text-foreground font-extrabold leading-relaxed pr-8 tracking-tight transition-transform duration-700 group-hover:translate-x-1">
                  {article.excerpt}
                </p>
              </div>
            </motion.div>
          )}

          {/* ─── ARTICLE BODY ─── */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <article className="relative">
              <div className="bg-card/30 backdrop-blur-2xl border border-white/5 rounded-[3.5rem] p-10 sm:p-16 lg:p-20 shadow-4xl ring-1 ring-white/5 overflow-hidden transition-all duration-700 hover:shadow-gold/5">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-gold/30 to-transparent" />
                
                <div className="text-lg sm:text-xl lg:text-2xl leading-[2.2] text-muted-foreground/90 whitespace-pre-wrap selection:bg-gold/30 selection:text-foreground">
                  {firstChar && (
                    <motion.span 
                      initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
                      whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.5 }}
                      className="float-right text-7xl sm:text-8xl lg:text-[9rem] font-black text-gold ml-8 mb-4 leading-[0.6] drop-shadow-[0_20px_40px_rgba(185,162,95,0.4)] select-none font-serif relative"
                    >
                      {firstChar}
                      <span className="absolute -inset-2 bg-gold/5 blur-2xl rounded-full -z-10" />
                    </motion.span>
                  )}
                  {remainingContent}
                </div>
              </div>
            </article>
          </motion.div>

          {/* ─── ALL ARTICLE IMAGES ─── */}
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500 fill-mode-both">
            <ArticleImageGallery images={allImages} title={article.title} />
          </div>

          {/* ─── SOCIAL SHARE ─── */}
  <div className="mt-20 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500 fill-mode-both">
    <ArticleSocialShare title={article.title} slug={article.slug} />
  </div>

          {/* ═══════════ RELATED ARTICLES ═══════════ */}
          {related.length > 0 && (
            <div className="mt-32 pt-16 border-t border-border/30 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-800 fill-mode-both">
              {/* Section Header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="h-px w-16 bg-linear-to-r from-transparent to-gold/60" />
                  <BookOpen className="h-6 w-6 text-gold" />
                  <div className="h-px w-16 bg-linear-to-l from-transparent to-gold/60" />
                </div>
                <h3 className="text-3xl sm:text-5xl font-bold text-gradient-gold mb-4 tracking-tight">مقالات قد تهمك</h3>
                <p className="text-muted-foreground text-lg sm:text-xl max-w-md mx-auto">اكتشف المزيد من القصص والرؤى الملهمة</p>
              </div>
              
              {/* Related Articles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                {related.map((rel, idx) => {
                  const relImage = rel.cover_image_url || rel.image || "/images/placeholder.jpg"
                  const relReadTime = Math.max(1, Math.ceil((rel.content || "").split(/\s+/).length / 200))
                  
                  return (
                    <Link 
                      key={rel.slug || idx} 
                      href={`/articles/${rel.slug}`}
                      className="group relative flex flex-col rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-gold/30 transition-all duration-700 bg-linear-to-b from-card/80 to-card/40 backdrop-blur-md hover:shadow-[0_40px_80px_-20px_rgba(185,162,95,0.2)] hover:-translate-y-3"
                      style={{ animationDelay: `${idx * 200}ms` }}
                    >
                      {/* Image Container */}
                      <div className="relative h-60 sm:h-72 overflow-hidden bg-secondary/10">
                        <img
                          src={relImage}
                          alt={rel.title}
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-[1.5s] ease-out group-hover:scale-110 group-hover:brightness-110"
                        />
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 bg-linear-to-tr from-gold/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        
                        {/* Category chip on image */}
                        <div className="absolute top-6 right-6">
                          <span className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-xl rounded-full px-4 py-2 text-xs font-bold text-gold border border-gold/20 shadow-2xl">
                            <Tag className="h-3.5 w-3.5" />
                            {rel.category || "مقالات"}
                          </span>
                        </div>
                      </div>
  
                      {/* Content Area */}
                      <div className="flex flex-col flex-1 p-8 sm:p-10 relative">
                        {/* Decorative accent */}
                        <div className="absolute top-0 right-10 w-12 h-1 bg-gold/40 rounded-full transform -translate-y-1/2 group-hover:w-20 transition-all duration-700" />
                        
                        <h4 className="text-xl sm:text-2xl font-bold leading-snug text-foreground group-hover:text-gold transition-colors duration-500 line-clamp-2 mb-4 tracking-tight">
                          {rel.title}
                        </h4>
                        
                        {rel.excerpt && (
                          <p className="text-base text-muted-foreground line-clamp-3 mb-8 leading-relaxed flex-1 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                            {rel.excerpt}
                          </p>
                        )}
  
                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground/80">
                            <span className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gold/60" />
                              {new Date(rel.published_at || rel.created_at).toLocaleDateString("ar", { month: "long", day: "numeric" })}
                            </span>
                            <span className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gold/60" />
                              {relReadTime} د قراءة
                            </span>
                          </div>
                          <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center text-gold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                            <ArrowRight className="h-5 w-5 transform rotate-180" />
                          </div>
                        </div>
                      </div>
  
                      {/* Animated bottom border glow */}
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-linear-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </Link>
                  )
                })}
              </div>

            </div>
          )}

          {/* ─── BACK BUTTON ─── */}
          <div className="mt-24 flex justify-center animate-in fade-in duration-1000 delay-900 fill-mode-both">
            <Link href="/#articles">
              <Button
                variant="outline"
                size="lg"
                className="group rounded-full border-gold/20 hover:border-gold/40 hover:bg-gold/5 px-10 py-7 text-lg transition-all duration-300 hover:shadow-xl hover:shadow-gold/10"
              >
                <ArrowRight className="h-5 w-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
                <span>العودة لجميع المقالات</span>
              </Button>
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  )
}
