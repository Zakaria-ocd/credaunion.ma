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

  const { data: instruments } = await supabase.from('instruments').select()
  console.log(instruments);
  return (
    <main>
      <Navbar />
      <HeroSection />
      <Services />
      <About />
      <Advantages />
      <Process />
      <Testimonials />
      <Articles />
      <Contact />
      <Footer />
    </main>
  )
}
