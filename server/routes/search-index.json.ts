// 构建时（prerender）生成的搜索索引：每篇文章的正文纯文本（按标题切分的章节拼接）
// - nuxt.config 的 nitro.prerender.routes 已包含 /search-index.json：构建时请求本路由并静态化输出到产物
// - 文本来源：@nuxt/content 的 queryCollectionSearchSections（自动解压 body AST 并按章节提取文本）
// - dev 环境包含草稿（与 useBlog 列表语义一致）；生产构建过滤，草稿正文不进入公开产物
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
