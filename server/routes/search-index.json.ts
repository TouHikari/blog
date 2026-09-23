// 构建时（prerender）生成的搜索索引：queryCollectionSearchSections 按章节提取正文纯文本并按 path 聚合
// draft 语义与 useBlog 一致（dev 含 / 生产构建过滤）；nuxt.config 的 nitro.prerender.routes 已登记本路由
export default defineEventHandler(async (event) => {
  const sections = await queryCollectionSearchSections(event, 'blog')
  const articles = await queryCollection(event, 'blog').select('path', 'draft').all()

  const visiblePaths = new Set(
    articles
      .filter((article) => import.meta.dev || article.draft !== true)
      .map((article) => article.path)
  )

  const textByPath = new Map<string, string[]>()
  for (const section of sections) {
    const path = section.id.split('#')[0]
    if (!visiblePaths.has(path)) continue
    const parts = textByPath.get(path) ?? []
    parts.push(`${section.title} ${section.content}`.trim())
    textByPath.set(path, parts)
  }

  const entries = [...textByPath.entries()].map(([path, parts]) => ({
    path,
    text: parts.join(' ').replace(/\s+/g, ' ').trim()
  }))

  setHeader(event, 'content-type', 'application/json; charset=utf-8')

  return { entries }
})
