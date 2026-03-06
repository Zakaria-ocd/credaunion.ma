import { Navbar } from "@/components/sections/navbar"
import { HeroSection } from "@/components/sections/hero-section"
import { Services } from "@/components/sections/services"
import { About } from "@/components/sections/about"
import { Advantages } from "@/components/sections/advantages"
import { Process } from "@/components/sections/process"
import { Testimonials } from "@/components/sections/testimonials"
import { Articles } from "@/components/sections/articles"
import { Contact } from "@/components/sections/contact"
import { Footer } from "@/components/sections/footer"
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Fetch published articles for the public site initial load
  const { data: articles, count } = await supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .range(0, 5) // Fetch the first 6 articles for the default limit

  const totalPages = Math.ceil((count || 0) / 6)

  return (
    <main>
      <Navbar />
      <HeroSection />
      <Services />
      <About />
      <Advantages />
      <Process />
      <Testimonials />
      <Articles initialArticles={articles || []} initialTotalPages={totalPages} />
      <Contact />
      <Footer />
    </main>
  )
}
