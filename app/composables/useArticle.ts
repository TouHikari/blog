import type { Article } from '~/types'

export const useArticle = (collection: 'blog' | 'test' = 'blog') => {
  const route = useRoute()
  const { setTitle } = usePageTitle()

  const { data: article, error } = useAsyncData(route.path, async () => {
    const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
    if (!slug) return null
    
    try {
      const all = await queryCollection(collection).all()
      
      const targetPath = `/${collection}/${slug}`
      const result = all.find(a => a.path === targetPath || a.path === `/${slug}` || a.path.endsWith(slug))
      
      if (result && !import.meta.dev && result.draft === true) {
        return null
      }

      return result as Article | null
    } catch (e) {
      console.error('Error in queryCollection:', e)
      throw e
    }
  })

  // 错误处理
  if (error.value) {
    console.error('Error fetching article:', error.value)
  }

  // 设置 SEO 元数据
  useSeoMeta({
    title: () => article.value?.title || 'Blog Article',
    description: () => article.value?.description || 'Blog article content'
  })

  // 更新全局标题状态，供 BlogTitle 组件使用
  watch(() => article.value?.title, (newTitle) => {
    if (newTitle) {
      setTitle(newTitle)
    }
  }, { immediate: true })

  return {
    article
  }
}
