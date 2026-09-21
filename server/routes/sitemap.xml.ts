// 构建时（prerender）生成的 sitemap.xml
// - nuxt.config 的 nitro.prerender.routes 已包含 /sitemap.xml：构建时请求本路由并静态化输出到产物
// - dev 环境可直接访问 /sitemap.xml 调试
// - 数据源与页面查询一致（queryCollection），草稿文章不收录
const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const toDateString = (value: string | Date) =>
  (value instanceof Date ? value.toISOString() : String(value)).slice(0, 10)

export default defineEventHandler(async (event) => {
  const {
    public: { siteUrl }
  } = useRuntimeConfig(event)

  const articles = await queryCollection(event, 'blog')
    .select('path', 'date', 'draft', 'tags')
    .all()

  const published = articles.filter((article) => article.draft !== true)

  // 标签聚合：标签名 → 该标签下最新文章日期
  const tagLatestDate = new Map<string, string>()
  for (const article of published) {
    const date = toDateString(article.date)
    for (const tag of article.tags ?? []) {
      const current = tagLatestDate.get(tag)
      if (!current || date > current) {
        tagLatestDate.set(tag, date)
      }
    }
  }

  const entries: Array<{
    loc: string
    lastmod?: string
    changefreq?: string
    priority?: string
  }> = [
    { loc: `${siteUrl}/`, changefreq: 'weekly', priority: '1.0' },
    { loc: `${siteUrl}/about`, changefreq: 'monthly', priority: '0.8' },
    { loc: `${siteUrl}/blog`, changefreq: 'weekly', priority: '0.9' },
    { loc: `${siteUrl}/categories`, changefreq: 'weekly', priority: '0.7' },
    { loc: `${siteUrl}/tags`, changefreq: 'weekly', priority: '0.7' },
    ...published.map((article) => ({
      loc: `${siteUrl}${article.path}`,
      lastmod: toDateString(article.date),
      changefreq: 'monthly',
      priority: '0.8'
    })),
    ...[...tagLatestDate.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([tag, lastmod]) => ({
        loc: `${siteUrl}/tags/${encodeURIComponent(tag)}`,
        lastmod,
        changefreq: 'weekly',
        priority: '0.6'
      }))
  ]

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map((entry) => {
      const lines = [`    <loc>${escapeXml(entry.loc)}</loc>`]
      if (entry.lastmod) lines.push(`    <lastmod>${entry.lastmod}</lastmod>`)
      if (entry.changefreq) lines.push(`    <changefreq>${entry.changefreq}</changefreq>`)
      if (entry.priority) lines.push(`    <priority>${entry.priority}</priority>`)
      return `  <url>\n${lines.join('\n')}\n  </url>`
    }),
    '</urlset>',
    ''
  ].join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  return xml
})
