# 内容系统（@nuxt/content v3）

本项目的所有站点内容均为 `content/` 目录下的 Markdown 文件，由 `@nuxt/content` v3 在构建时建立 SQLite 索引（`.data/content/contents.sqlite`，属于构建产物，不入库），页面通过 `queryCollection` 查询并以 `ContentRenderer` 渲染。

## 1. 集合定义（content.config.ts）

| 集合 | 源文件 | schema | 说明 |
| --- | --- | --- | --- |
| `content` | `content/*.md` | `title?`、`description?` | 首页（`index.md`）与关于页（`about.md`） |
| `blog` | `content/blog/*.md` | `date`（必填）、`draft?`、`tags?`、`toc?`（passthrough） | 正式文章 |
| `test` | `content/test/*.md` | `date?`、`draft?`、`toc?`（passthrough） | 渲染测试页 |

- `blog` 与 `test` 使用 `.passthrough()`，额外的 frontmatter 字段（如 `description`）会原样保留并可被查询。
- 修改 schema 前请同步检查查询代码（`useBlog` / `useArticle`）与本文档。

## 2. Frontmatter 字段约定

| 字段 | 适用 | 说明 |
| --- | --- | --- |
| `title` | 全部 | 页面标题（SEO 与标题系统使用） |
| `date` | blog 必填 | 字符串或日期；文章列表按此字段倒序排列 |
| `description` | 全部（可选） | 文章页会渲染为顶部的 `ContentAlert type="warning"`；也用于 SEO description |
| `tags` | blog（可选） | 字符串数组；列表页标签与标签统计使用 |
| `draft` | blog / test（可选） | `true` 时仅本机 dev 环境可见；生产环境不进入渲染输出（列表过滤、详情拦截、不进 sitemap），数据保留在客户端快照（刻意设计，见第 4 节） |
| `toc` | blog / test（可选） | 内容目录开关 |

## 3. 摘要截断标记

首页文章列表的摘要由 `<!--more-->` 标记截断：

- `useBlog` 读取 `article.meta.excerpt` 并映射为 `excerptContent`；
- `BlogList` 用 `ContentRenderer` 渲染该富文本摘要；
- 未使用该标记时回退显示 `description`，再回退显示“暂无摘要”。

## 4. 草稿（draft）语义

| 场景 | 行为 |
| --- | --- |
| `useBlog` 列表 | dev 环境显示全部；生产构建过滤掉 `draft === true` |
| `useArticle` 详情 | 生产环境访问草稿文章时返回 `null`，页面显示 “Article not found!” |
| `content` 集合（首页/关于） | 不参与草稿过滤 |

> **数据层说明**：生产构建产物的 `__nuxt_content/<collection>/sql_dump.txt`（客户端 WASM SQLite 快照，Base64 + GZIP）仍包含草稿原文——渲染层隔离（见上表）不受影响；此为刻意保留的设计（可用于埋设隐藏内容），并非泄漏。

## 5. 查询与数据流

### useBlog（列表）

- `useAsyncData` key：`'blog-articles'`（全局共享缓存，列表页/侧边栏/标签云多处调用只请求一次）。
- 返回：`articles`（按 `date` 倒序）、`recentArticles`（前 5 篇）、`tags`（按文章数排序的 `{ name, count }`）、`refresh`、`status`。
- 列表查询使用 `.select()` 字段投影（`title`/`path`/`date`/`description`/`tags`/`draft`/`meta`），剔除 `body` 渲染 AST，避免文章全文序列化进 payload；`meta` 用于承载摘要 `excerpt`。
- 标签字段同时兼容 `article.tags` 与 `article.meta.tags` 两种位置。

### useArticle（详情）

- `useAsyncData` key：`route.path`。
- slug 解析：`route.params.slug` 为数组时以 `/` 拼接，查询路径为 `/${collection}/${slug}`。
- 生产环境对 `draft` 返回 `null`；同时负责页面 SEO（`useSeoMeta` getter 形式）、页面标题联动（watch 标题并调用 `usePageTitle().setTitle`）与 CC 版权条显隐（数据就绪后写入 `route.meta.hideLicense`，使用 `flush: 'sync'` 的 watch 保证 SSR 判定正确；详见 `docs/pages-and-layouts.md`）。

### 页面级查询

| 页面 | key | 查询 |
| --- | --- | --- |
| `pages/index.vue` | `'home-content'` | `queryCollection('content').path('/').first()` |
| `pages/about.vue` | `'about-content'` | `queryCollection('content').path('/about').first()` |

### 搜索索引（search-index.json）

- `server/routes/search-index.json.ts` 在构建时（prerender）生成 `search-index.json`（与 sitemap.xml 同模式）：数据源为 `queryCollectionSearchSections(event, 'blog')`（自动解压 body AST、按标题切分章节并提取纯文本），再按文章 `path` 聚合为 `{ entries: [{ path, text }] }`。
- 草稿语义与 `useBlog` 一致：dev 构建包含草稿，生产构建过滤（草稿正文不进入公开产物）。
- 客户端 `app/composables/useSearch.ts` 在搜索框聚焦时懒加载该索引（`useState` 会话缓存，失败可重试），与元数据匹配（标题 / 描述 / 分类 / 标签）合并为搜索域；结果展示见组件体系文档的 `home/Search.vue`。

## 6. SEO

- 全局默认元数据在 `nuxt.config.ts` 的 `app.head`（站名、描述、keywords、Open Graph、Twitter Card、JSON-LD Person、canonical、RSS link 等）。
- 页面级通过 `useSeoMeta` 覆盖标题与描述（首页、文章页）。

## 7. 新增内容集合的步骤

1. 在 `content.config.ts` 中 `defineCollection` 定义新集合与 schema。
2. 新建对应内容目录（如 `content/notes/`）并写入带 frontmatter 的 Markdown。
3. 新建页面或组合式函数进行查询（参考 `useBlog` / `useArticle` 的同步模式，避免异步 Composable 陷阱）。
4. 同步更新本文档与相关规则文档（`.qoder/rules/`）。
