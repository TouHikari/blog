// 文章不存在（含生产环境下的草稿）时隐藏 default 布局的 CC 版权条：
// 布局渲染早于 ArticlePage 数据就绪，只能借路由 meta 在导航阶段提前判定
export default defineNuxtRouteMiddleware(async (to) => {
  const collection = to.path.startsWith('/test/') ? 'test' : 'blog'
  // 与 useArticle 相同的 slug 构造方式，保证两条查询路径一致
  const slug = Array.isArray(to.params.slug) ? to.params.slug.join('/') : to.params.slug
  if (!slug) return

  try {
    const article = await queryVisibleArticle(collection, `/${collection}/${slug}`)
    to.meta.hideLicense = !article
  } catch {
    to.meta.hideLicense = true
  }
})
