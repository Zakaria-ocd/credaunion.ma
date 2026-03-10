// Database table types

export interface AdminUser {
  id: string
  email: string
  password_hash: string
  created_at: string
}

export interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image_url: string
  images: string[]
  published_at: string | null
  created_at: string
  author_id: string | null
  category: string | null
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  created_at: string
}
