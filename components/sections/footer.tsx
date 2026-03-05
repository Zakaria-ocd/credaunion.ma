"use client"

import { navLinks } from "@/lib/data"
import { Motion } from "@/components/ui/motion"
import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-card/30">
      {/* Top gold line */}
      <div className="gold-line" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <Motion variant="fade-up">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Brand */}
            <div className="flex flex-col gap-5">
              <Link href="#" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="الإتحاد العربي للبناء والتنمية العقارية"
            width={60}
            height={42}
            className="h-14 w-auto"
            priority
          />
        </Link>
              <p className="text-muted-foreground leading-relaxed max-w-sm text-sm">
                {'نقدم حلولاً عقارية متكاملة تشمل الاستشارات العقارية، إدارة المشاريع، والتخطيط الاستراتيجي لتحقيق رؤيتكم وتأمين مستقبلكم.'}
              </p>
            </div>

            {/* Quick links */}
            <div className="flex flex-col   min-lg:items-center">
              <h3 className="text-base font-bold text-foreground mb-6">{'روابط سريعة'}</h3>
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground transition-all duration-300 hover:text-gold hover:translate-x-[-4px] text-sm"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Contact summary */}
            <div>
              <h3 className="text-base font-bold text-foreground mb-6">{'معلومات التواصل'}</h3>
              <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                <p>{'الحي المالي، الرياض'}</p>
                <p>{'المملكة العربية السعودية'}</p>
                <p>
                  <a
                    href="tel:+966112345678"
                    className="transition-colors duration-300 hover:text-gold"
                  >
                    {'+966 11 234 5678'}
                  </a>
                </p>
                <p>
                  <a
                    href="mailto:info@credaunion.com"
                    className="transition-colors duration-300 hover:text-gold"
                  >
                    {'info@credaunion.com'}
                  </a>
                </p>
                <p>{'الأحد - الخميس: 9 ص - 6 م'}</p>
              </div>
            </div>
          </div>
        </Motion>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {'جميع الحقوق محفوظة'} &copy; {new Date().getFullYear()} {'الإتحاد العربي للبناء والتنمية العقارية'}
          </p>
          <p className="text-sm text-muted-foreground">
            {'تصميم وتطوير بأعلى معايير الجودة'}
          </p>
        </div>
      </div>
    </footer>
  )
}
