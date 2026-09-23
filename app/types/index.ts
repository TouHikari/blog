export interface Article {
  title: string
  path: string
  date: string
  description?: string
  category?: string
  tags?: string[]
  draft?: boolean
  meta?: {
    excerpt?: Record<string, unknown>
    tags?: string[]
    [key: string]: unknown
  }
  excerptContent?: Record<string, unknown> | null
  [key: string]: unknown
}

export interface SloganConfig {
  typingSpeed: number
  deletingSpeed: number
  delayBeforeDeleting: number
  delayBeforeTypingNew: number
}
