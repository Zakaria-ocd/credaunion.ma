"use client"

import { useState } from "react"
import { Motion } from "@/components/ui/motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react"

const contactInfo = [
  {
    icon: MapPin,
    title: "زوروا مقرنا",
    lines: ["الحي المالي", "الرياض، المملكة العربية السعودية"],
  },
  {
    icon: Phone,
    title: "اتصلوا بنا",
    lines: ["+966 11 234 5678", "الأحد - الخميس، 9 ص - 6 م"],
    href: "tel:+966112345678",
  },
  {
    icon: Mail,
    title: "راسلونا",
    lines: ["info@credaunion.com", "support@credaunion.com"],
    href: "mailto:info@credaunion.com",
  },
]

export function Contact() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const body = {
      name: `${formData.get("firstName")} ${formData.get("lastName")}`.trim(),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "حدث خطأ أثناء إرسال الرسالة")
        setLoading(false)
        return
      }

      setSuccess(true)
      ;(e.target as HTMLFormElement).reset()
    } catch {
      setError("حدث خطأ في الاتصال")
    }

    setLoading(false)
  }

  return (
    <section id="contact" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/3 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gold/2 rounded-full blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <Motion variant="fade-up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/8 px-4 py-2 text-sm text-gold mb-6">
              {'تواصل معنا'}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 text-balance">
              {'لنبدأ '}<span className="text-gradient-gold">{'محادثة'}</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg leading-relaxed">
              {'هل أنتم مستعدون لاتخاذ الخطوة التالية؟ تواصلوا مع فريقنا واكتشفوا كيف يمكننا مساعدتكم في تحقيق أهدافكم العقارية.'}
            </p>
          </div>
        </Motion>

        {/* Contact info cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {contactInfo.map((item, index) => {
            const Icon = item.icon
            const Wrapper = item.href ? "a" : "div"
            return (
              <Motion key={index} variant="fade-up" delay={index * 100}>
                <Wrapper
                  {...(item.href ? { href: item.href } : {})}
                  className="group flex flex-col items-center text-center rounded-2xl border border-border/50 bg-card/50 p-8 transition-all duration-500 hover:border-gold/40 hover:shadow-2xl hover:shadow-gold/8 hover:-translate-y-2"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold/10 border border-gold/20 mb-5 transition-all duration-500 group-hover:bg-gold/20 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-gold/20">
                    <Icon className="h-6 w-6 text-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3 transition-colors duration-300 group-hover:text-gold">
                    {item.title}
                  </h3>
                  {item.lines.map((line, i) => (
                    <p key={i} className="text-muted-foreground text-sm">
                      {line}
                    </p>
                  ))}
                </Wrapper>
              </Motion>
            )
          })}
        </div>

        {/* Form */}
        <Motion variant="fade-up" delay={200}>
          <div className="max-w-3xl mx-auto rounded-3xl border border-border/50 bg-card/50 p-8 md:p-12 transition-all duration-500 hover:border-border/80">
            <h3 className="text-2xl font-bold mb-2 text-foreground text-center">
              {'أرسل لنا رسالة'}
            </h3>
            <p className="text-muted-foreground text-center mb-8">
              {'الحي المالي، الرياض'}
            </p>

            {success && (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 mb-6 flex items-center gap-3 text-emerald-400">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <p className="text-sm font-medium">تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.</p>
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/30 p-4 mb-6 text-sm text-destructive text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    {'الاسم الأول'}
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="أدخل اسمك الأول"
                    required
                    className="bg-secondary/80 border-border/50 focus:border-gold focus:ring-gold/20 text-foreground placeholder:text-muted-foreground h-12 rounded-xl transition-all duration-300"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    {'اسم العائلة'}
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="أدخل اسم العائلة"
                    className="bg-secondary/80 border-border/50 focus:border-gold focus:ring-gold/20 text-foreground placeholder:text-muted-foreground h-12 rounded-xl transition-all duration-300"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  {'البريد الإلكتروني'}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                  className="bg-secondary/80 border-border/50 focus:border-gold focus:ring-gold/20 text-foreground placeholder:text-muted-foreground h-12 rounded-xl transition-all duration-300"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  {'الموضوع'}
                </label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="موضوع الرسالة"
                  className="bg-secondary/80 border-border/50 focus:border-gold focus:ring-gold/20 text-foreground placeholder:text-muted-foreground h-12 rounded-xl transition-all duration-300"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  {'الرسالة'}
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="اكتب رسالتك هنا..."
                  required
                  className="bg-secondary/80 border-border/50 focus:border-gold focus:ring-gold/20 text-foreground placeholder:text-muted-foreground rounded-xl resize-none transition-all duration-300"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="bg-gold text-primary-foreground hover:bg-gold-light transition-all duration-500 hover:shadow-xl hover:shadow-gold/25 hover:scale-[1.02] active:scale-[0.98] w-full h-14 rounded-xl text-base font-bold"
              >
                {loading ? (
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                ) : (
                  <Send className="ml-2 h-5 w-5" />
                )}
                {loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
              </Button>
            </form>
          </div>
        </Motion>
      </div>
    </section>
  )
}
