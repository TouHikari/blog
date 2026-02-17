import type { Article } from '~/types'

export const useArticle = async () => {
  const route = useRoute()
  const { setTitle } = usePageTitle()

  const { data: article, error } = await useAsyncData(route.path, async () => {
    const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
    if (!slug) return null
    
    const result = await queryCollection('blog').path(`/blog/${slug}`).first()
    return result as Article | null
  })

  // 错误处理
  if (error.value || !article.value) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Article not found'
    })
  }

  // 设置 SEO 元数据
  useSeoMeta({
    title: article.value.title || 'Blog Article',
    description: article.value.description || 'Blog article content'
  })

  // 更新全局标题状态，供 BlogTitle 组件使用
  if (article.value.title) {
    setTitle(article.value.title)
  }

  return {
    article
  }
}
