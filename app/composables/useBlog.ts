import type { Article } from '~/types'

export const useBlog = () => {
  const { data: articles, refresh, status } = useAsyncData('blog-articles', async () => {
    try {
      // 字段投影：剔除 body（渲染 AST），避免列表数据把文章全文序列化进 payload
      const allBlogArticles = await queryCollection('blog')
        .select('title', 'path', 'date', 'description', 'tags', 'draft', 'meta')
        .all()

      if (!allBlogArticles || allBlogArticles.length === 0) {
        return []
      }

      const visibleArticles = allBlogArticles.filter((article) => {
        if (import.meta.dev) return true
        return article.draft !== true
      })

      const processedArticles = visibleArticles.map((article) => {
        const excerptContent = article.meta?.excerpt ?? null
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
      // 检查 tags 字段可能存在的不同位置
      const articleTags = article.tags || article.meta?.tags || []
      
      if (Array.isArray(articleTags)) {
        articleTags.forEach((tag: string) => {
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
