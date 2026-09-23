import type { Article } from '~/types'
import { articleTags } from '~/composables/useBlog'

export interface SearchIndexEntry {
  path: string
  text: string
}

export interface SearchResult {
  article: Article
  metaMatched: boolean
  snippet: string | null
}

export interface HighlightSegment {
  text: string
  hit: boolean
}

const SNIPPET_BEFORE = 24
const SNIPPET_AFTER = 72

export const highlightSegments = (text: string, keyword: string): HighlightSegment[] => {
  const q = keyword.trim().toLowerCase()
  if (!q) return [{ text, hit: false }]

  const segments: HighlightSegment[] = []
  const lowerText = text.toLowerCase()
  let cursor = 0
  let position = lowerText.indexOf(q)

  while (position !== -1) {
    if (position > cursor) segments.push({ text: text.slice(cursor, position), hit: false })
    segments.push({ text: text.slice(position, position + q.length), hit: true })
    cursor = position + q.length
    position = lowerText.indexOf(q, cursor)
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), hit: false })

  return segments
}

const extractSnippet = (text: string, position: number, length: number): string => {
  const start = Math.max(0, position - SNIPPET_BEFORE)
  const end = Math.min(text.length, position + length + SNIPPET_AFTER)
  return `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`
}

export const useSearch = () => {
  const { articles } = useBlog()

  const indexEntries = useState<SearchIndexEntry[] | null>('search-index-entries', () => null)
  const indexStatus = useState<'idle' | 'loading' | 'ready' | 'failed'>('search-index-status', () => 'idle')

  const textByPath = computed(() => {
    const lookup = new Map<string, string>()
    indexEntries.value?.forEach((entry) => lookup.set(entry.path, entry.text))
    return lookup
  })

  // 懒加载构建时索引：会话内只请求一次，失败可重试
  const loadIndex = async () => {
    if (!import.meta.client) return
    // 提前持有 ref，避免 await 之后触碰依赖 Nuxt 上下文的 API（见 docs/nuxt-async-composable-pitfalls.md）
    const status = indexStatus
    const entries = indexEntries
    if (status.value === 'loading' || status.value === 'ready') return

    status.value = 'loading'
    try {
      const data = await $fetch<{ entries: SearchIndexEntry[] }>('/search-index.json')
      if (!Array.isArray(data?.entries)) throw new Error('Unexpected search index payload')
      entries.value = data.entries
      status.value = 'ready'
    } catch (error) {
      console.warn('Failed to load search index:', error)
      status.value = 'failed'
    }
  }

  const search = (keyword: string): SearchResult[] => {
    const q = keyword.trim().toLowerCase()
    if (!q) return []

    const lookup = textByPath.value
    const results: SearchResult[] = []

    for (const article of articles.value ?? []) {
      const metaMatched = [article.title, article.description, article.category, ...articleTags(article)]
        .some((field) => field?.toLowerCase().includes(q))

      const text = lookup.get(article.path)
      let snippet: string | null = null
      if (text) {
        const position = text.toLowerCase().indexOf(q)
        if (position !== -1) snippet = extractSnippet(text, position, q.length)
      }

      if (metaMatched || snippet) results.push({ article, metaMatched, snippet })
    }

    return results.sort((a, b) => Number(b.metaMatched) - Number(a.metaMatched))
  }

  return { indexStatus, loadIndex, search }
}
