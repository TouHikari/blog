export interface Article {
  title: string
  path: string
  date: string
  description?: string
  meta?: {
    excerpt?: any
    tags?: string[]
    [key: string]: any
  }
  excerptContent?: any
  [key: string]: any
}

export interface SloganConfig {
  typingSpeed: number
  deletingSpeed: number
  delayBeforeDeleting: number
  delayBeforeTypingNew: number
}
