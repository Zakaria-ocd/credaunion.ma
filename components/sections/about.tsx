"use client"

import { Building, CheckCircle } from "lucide-react"
import { Motion, Counter } from "@/components/ui/motion"

const features = [
  "استراتيجيات مخصصة لكل عميل حسب احتياجاته",
  "هياكل تسعير شفافة بدون تكاليف مخفية",
  "فريق متخصص من المهندسين والاستشاريين المعتمدين",
  "شركة مرخصة ومعتمدة في مجال البناء والتنمية العقارية",
]

export function About() {
  return (
    <section id="about" className="relative py-24 lg:py-32 bg-secondary/20 overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/[0.03] rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gold/[0.02] rounded-full blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Right side - content */}
          <div>
            <Motion variant="fade-right">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/[0.08] px-4 py-2 text-sm text-gold mb-6">
                {'من نحن'}
              </div>
            </Motion>

            <Motion variant="fade-right" delay={100}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">
                {'نبني الثقة '}<span className="text-gradient-gold">{'منذ عام 2001'}</span>
              </h2>
            </Motion>

            <Motion variant="fade-right" delay={200}>
              <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                {'الإتحاد العربي للبناء والتنمية العقارية هو شركة رائدة في مجال التطوير العقاري، مكرسة لتمكين الشركات والأفراد من تحقيق طموحاتهم العقارية. مع أكثر من عقدين من الخبرة، يجمع فريقنا من المتخصصين المعتمدين بين الخبرة العميقة في السوق والاستراتيجيات المبتكرة.'}
              </p>
            </Motion>

            <Motion variant="fade-right" delay={300}>
              <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
                {'نؤمن بأن التخطيط العقاري السليم هو حجر الأساس للنجاح الدائم. نهجنا الذي يضع العميل أولاً يضمن أن كل استراتيجية مصممة خصيصاً لتناسب ظروفكم وأهدافكم الفريدة.'}
              </p>
            </Motion>

            <ul className="flex flex-col gap-4">
              {features.map((feature, index) => (
                <Motion key={index} variant="fade-right" delay={400 + index * 80}>
                  <li className="flex items-start gap-3 text-foreground group">
                    <CheckCircle className="h-5 w-5 text-gold shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-125" />
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                </Motion>
              ))}
            </ul>
          </div>

          {/* Left side - decorative visual */}
          <Motion variant="fade-left" delay={200}>
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Decorative rotating frames */}
              <div className="absolute inset-4 rounded-3xl border border-gold/15 rotate-3 transition-transform duration-700 hover:rotate-6" />
              <div className="absolute inset-4 rounded-3xl border border-gold/10 -rotate-3 transition-transform duration-700 hover:-rotate-6" />

              {/* Main content box */}
              <div className="relative rounded-3xl bg-card/80 backdrop-blur-sm border border-border/50 p-8 lg:p-12 flex flex-col items-center justify-center gap-8 h-full">
                {/* Floating icon */}
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gold/10 border border-gold/30"
                  style={{
                    animation: "float 4s ease-in-out infinite",
                  }}
                >
                  <Building className="h-12 w-12 text-gold" />
                </div>

                <div className="text-center">
                  <Motion variant="zoom-in" delay={400}>
                    <div className="text-6xl font-bold text-gold mb-2">
                      <Counter target="25" duration={2000} />
                    </div>
                  </Motion>
                  <p className="text-xl font-bold text-foreground mb-1">{'عاماً من التميز'}</p>
                  <p className="text-muted-foreground">{'منذ عام 2001'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="rounded-xl bg-secondary/80 p-5 text-center transition-all duration-500 hover:bg-gold/10 hover:scale-105 border border-transparent hover:border-gold/20">
                    <div className="text-2xl font-bold text-gold">
                      <Counter target="+2,000" duration={2000} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{'عميل نشط'}</div>
                  </div>
                  <div className="rounded-xl bg-secondary/80 p-5 text-center transition-all duration-500 hover:bg-gold/10 hover:scale-105 border border-transparent hover:border-gold/20">
                    <div className="text-2xl font-bold text-gold">
                      <Counter target="$4.2B" duration={2000} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{'أصول مُدارة'}</div>
                  </div>
                </div>
              </div>
            </div>
          </Motion>
        </div>
      </div>
    </section>
  )
}
