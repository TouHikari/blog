import type { Article } from '~/types'
import { toIsoDate } from '~/utils/date'

// 文章可见性规则（生产环境下草稿视为不存在）的唯一定义：
// useArticle 与 article-license 中间件共用，避免两处判断漂移
export const queryVisibleArticle = async (collection: 'blog' | 'test', path: string): Promise<Article | null> => {
  const result = await queryCollection(collection).path(path).first()

  if (result && !import.meta.dev && result.draft === true) {
    return null
  }

  return result as Article | null
}

export const useArticle = (collection: 'blog' | 'test' = 'blog') => {
  const route = useRoute()
  const { setTitle } = usePageTitle()
  const { public: { siteUrl } } = useRuntimeConfig()

  const { data: article, error, status } = useAsyncData(route.path, async () => {
    const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
    if (!slug) return null
    
    try {
      return await queryVisibleArticle(collection, `/${collection}/${slug}`)
    } catch (e) {
      console.error('Error in queryCollection:', e)
      throw e
    }
  })

  useSeoMeta({
    title: () => article.value?.title || 'Blog Article',
    description: () => article.value?.description || 'Blog article content'
  })

  useHead({
    script: () => {
      const value = article.value
      if (!value || collection !== 'blog') return []
      return [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: value.title,
            description: value.description,
            datePublished: toIsoDate(value.date),
            author: { '@type': 'Person', name: 'TouHikari', url: siteUrl },
            mainEntityOfPage: `${siteUrl}${route.path}`
          })
        }
      ]
    }
  })

  watch(() => article.value?.title, (newTitle) => {
    if (newTitle) {
      setTitle(newTitle)
    }
  }, { immediate: true })

  if (error.value) {
    console.error('Error fetching article:', error.value)
  }

  return {
    article,
    status,
    error
  }
}
