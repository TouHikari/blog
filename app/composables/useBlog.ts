import type { Article } from '~/types'

export const useBlog = async () => {
  const { data: articles, refresh, status } = await useAsyncData('blog-articles', async () => {
    try {
      const allBlogArticles = await queryCollection('blog').all()

      if (!allBlogArticles || allBlogArticles.length === 0) {
        return []
      }

      const processedArticles = allBlogArticles.map((article: any) => {
        let excerptContent = null
        if (article.meta && article.meta.excerpt) {
          excerptContent = article.meta.excerpt
        }
        return {
          ...article,
          excerptContent
        } as Article
      })

      return processedArticles.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    } catch (error) {
      console.error('Failed to fetch blog articles:', error)
      return []
    }
  })

  const recentArticles = computed(() => {
    return articles.value ? articles.value.slice(0, 5) : []
  })

  const tags = computed(() => {
    if (!articles.value) return []
    const tagCounts: Record<string, number> = {}
    articles.value.forEach((article) => {
      if (article.meta?.tags) {
        article.meta.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        })
      }
    })
    return Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  })

  return {
    articles,
    recentArticles,
    tags,
    refresh,
    status
  }
}
