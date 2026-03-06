import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Navbar } from "@/components/sections/navbar"
import { Footer } from "@/components/sections/footer"
import { Calendar, Clock, User, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error || !article) {
    notFound()
  }

  const publishDate = new Date(article.published_at || article.created_at).toLocaleDateString("ar", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <Image
          src={article.cover_image_url || "/images/placeholder.jpg"}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Link 
              href="/#articles" 
              className="inline-flex items-center gap-2 text-gold hover:text-gold-light mb-6 transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
              <span>العودة للمقالات</span>
            </Link>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight text-balance">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gold/60" />
                {publishDate}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold/60" />
                {"5 دقائق قراءة"}
              </span>
              {article.author_id && (
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gold/60" />
                  {"فريق التحرير"}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-invert prose-gold max-w-none">
            <div className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {article.content}
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-border/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">شارك المقال</h3>
                <p className="text-sm text-muted-foreground">أخبر الآخرين عن هذه المعلومات القيمة</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="border-gold/30 hover:bg-gold/10">
                  تويتر
                </Button>
                <Button variant="outline" size="sm" className="border-gold/30 hover:bg-gold/10">
                  لينكد إن
                </Button>
                <Button variant="outline" size="sm" className="border-gold/30 hover:bg-gold/10">
                  فيسبوك
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
