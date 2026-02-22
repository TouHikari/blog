import type { Article } from '~/types'

export const useArticle = async (collection: 'blog' | 'test' = 'blog') => {
  const route = useRoute()
  const { setTitle } = usePageTitle()

  const { data: article, error, status, refresh } = useAsyncData(route.path, async () => {
    const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
    if (!slug) return null
    
    try {
      const targetPath = `/${collection}/${slug}`
      const result = await queryCollection(collection).path(targetPath).first()

      if (result && !import.meta.dev && result.draft === true) {
        return null
      }

      return result as Article | null
    } catch (e) {
      console.error('Error in queryCollection:', e)
      throw e
    }
  })

  useSeoMeta({
    title: () => article.value?.title || 'Blog Article',
    description: () => article.value?.description || 'Blog article content'
  })

  watch(() => article.value?.title, (newTitle) => {
    if (newTitle) {
      setTitle(newTitle)
    }
  }, { immediate: true })

  if (status.value === 'pending') {
    await refresh()
  }

  if (error.value) {
    console.error('Error fetching article:', error.value)
  }

  return {
    article,
    status,
    error
  }
}
