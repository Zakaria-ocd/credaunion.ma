import {
  Building,
  ShieldCheck,
  Landmark,
  ClipboardList,
  HardHat,
  Target,
  Award,
  TrendingUp,
  Users,
  Cpu,
  type LucideIcon,
} from "lucide-react"

export interface Service {
  icon: LucideIcon
  title: string
  description: string
}

export interface Advantage {
  icon: LucideIcon
  title: string
  description: string
}

export interface Step {
  number: string
  title: string
  description: string
}

export interface Article {
  id: string
  image: string
  title: string
  excerpt: string
  date: string
  category: string
  readTime: string
  slug: string
}

export interface Testimonial {
  name: string
  role: string
  initials: string
  content: string
}

export interface NavLink {
  label: string
  href: string
}

export const navLinks: NavLink[] = [
  { label: "الرئيسية", href: "#hero" },
  { label: "خدماتنا", href: "#services" },
  { label: "من نحن", href: "#about" },
  { label: "لماذا نحن", href: "#advantages" },
  { label: "آلية العمل", href: "#process" },
  { label: "آراء العملاء", href: "#testimonials" },
  { label: "الأخبار", href: "#articles" },
  { label: "تواصل معنا", href: "#contact" },
]

export const services: Service[] = [
  {
    icon: Building,
    title: "التطوير العقاري",
    description:
      "تطوير مشاريع عقارية متكاملة تشمل المجمعات السكنية والتجارية بأعلى معايير الجودة والتصميم العصري.",
  },
  {
    icon: ShieldCheck,
    title: "إدارة المخاطر",
    description:
      "تقييم شامل للمخاطر ووضع استراتيجيات التخفيف لحماية أصولكم وضمان الاستقرار المالي على المدى الطويل.",
  },
  {
    icon: Landmark,
    title: "الاستشارات العقارية",
    description:
      "تقديم استشارات عقارية متخصصة تشمل تحليل السوق، تقييم العقارات، واستراتيجيات الاستثمار المثلى.",
  },
  {
    icon: ClipboardList,
    title: "إدارة المشاريع",
    description:
      "إدارة شاملة للمشاريع العقارية من التخطيط والتصميم حتى التنفيذ والتسليم مع الالتزام بالجداول الزمنية.",
  },
  {
    icon: HardHat,
    title: "المقاولات والبناء",
    description:
      "تنفيذ أعمال البناء والمقاولات بأحدث التقنيات والمعدات مع فريق هندسي متخصص وذو خبرة واسعة.",
  },
  {
    icon: Target,
    title: "التخطيط الاستراتيجي",
    description:
      "وضع خطط استراتيجية شاملة للمشاريع العقارية تضمن تحقيق أقصى عائد على الاستثمار.",
  },
]

export const advantages: Advantage[] = [
  {
    icon: Award,
    title: "خبرة متخصصة في القطاع",
    description:
      "يتمتع مستشارونا المعتمدون بمعرفة عميقة في مجالات البناء والعقارات والتطوير العمراني والاستثمار العقاري.",
  },
  {
    icon: TrendingUp,
    title: "سجل حافل بالإنجازات",
    description:
      "أكثر من 25 عاماً من تحقيق نتائج ملموسة في القطاع العقاري مع معدل احتفاظ بالعملاء يصل إلى 98%.",
  },
  {
    icon: Users,
    title: "نهج يركز على العميل",
    description:
      "كل استراتيجية مصممة خصيصاً حول أهدافكم الفريدة. نستمع أولاً، ثم نصمم حلولاً تناسبكم حقاً.",
  },
  {
    icon: Cpu,
    title: "تقنيات مبتكرة",
    description:
      "نستخدم أحدث التقنيات في البناء والتحليلات العقارية لتقديم نتائج أسرع وأذكى وأكثر شفافية.",
  },
]

export const steps: Step[] = [
  {
    number: "01",
    title: "الاستشارة الأولية",
    description:
      "نبدأ بمناقشة شاملة لفهم أهدافكم العقارية ومتطلباتكم ووضعكم الحالي.",
  },
  {
    number: "02",
    title: "التحليل المعمق",
    description:
      "يجري فريقنا بحثاً شاملاً في السوق وتحليلاً عقارياً لتحديد أفضل الفرص المتاحة.",
  },
  {
    number: "03",
    title: "استراتيجية مخصصة",
    description:
      "نضع خطة عقارية مفصلة بمراحل واضحة وخطوات عملية وأسعار شفافة.",
  },
  {
    number: "04",
    title: "التنفيذ والمتابعة",
    description:
      "ننفذ الاستراتيجية ونقدم متابعة مستمرة مع مراجعات دورية للأداء والتعديلات اللازمة.",
  },
]

export const testimonials: Testimonial[] = [
  {
    name: "أحمد المنصوري",
    role: "رئيس مجلس إدارة، مجموعة المنصوري",
    initials: "أم",
    content:
      "غيّر الإتحاد العربي للبناء استراتيجيتنا العقارية بالكامل. ساعدنا فريقهم المتخصص في الاستشارات على إتمام صفقة ضاعفت قيمة محفظتنا العقارية خلال 18 شهراً فقط.",
  },
]

export const articles: Article[] = [
  {
    id: "1",
    image: "/images/article-1.jpg",
    title: "كيف تؤثر أسعار الفائدة المرتفعة على محفظتك العقارية",
    excerpt:
      "فهم العلاقة بين أسعار الفائدة وتوزيع الأصول أمر بالغ الأهمية للحفاظ على أداء المحفظة العقارية في 2026.",
    date: "28 فبراير 2026",
    category: "رؤى السوق",
    readTime: "5 دقائق قراءة",
    slug: "interest-rates-impact"
  },
  {
    id: "2",
    image: "/images/article-2.jpg",
    title: "5 استراتيجيات فعالة ضريبياً للمستثمرين العقاريين",
    excerpt:
      "اكتشف أساليب مجربة لتقليل التزاماتك الضريبية مع تعظيم نمو الثروة من خلال التخطيط العقاري الاستراتيجي.",
    date: "20 فبراير 2026",
    category: "التخطيط العقاري",
    readTime: "7 دقائق قراءة",
    slug: "tax-strategies"
  },
  {
    id: "3",
    image: "/images/article-3.jpg",
    title: "التنقل في سوق العقارات المتقلب: دليل المستثمر",
    excerpt:
      "اعتبارات رئيسية لقادة الأعمال الذين يقيّمون فرص الاستثمار العقاري في البيئة الاقتصادية الحالية.",
    date: "14 فبراير 2026",
    category: "التطوير العقاري",
    readTime: "6 دقائق قراءة",
    slug: "market-volatility"
  },
]

export const stats = [
  { value: "+25", label: "سنة خبرة" },
  { value: "+2,000", label: "عميل نشط" },
  { value: "$4.2B", label: "أصول مُدارة" },
  { value: "98%", label: "رضا العملاء" },
]
