# 内容查询与渲染 API（@nuxt/content v3）

## 1. 集合与路径

| 集合 | 源文件 | 示例路径 |
| --- | --- | --- |
| `content` | `content/*.md` | `/`（首页）、`/about` |
| `blog` | `content/blog/*.md` | `/blog/<文件名>` |
| `test` | `content/test/*.md` | `/test/<文件名>` |

集合定义在 `content.config.ts`（`defineCollection` + zod schema），修改 schema 前先阅读 `docs/content-system.md`。

## 2. 查询模式（本项目已验证）

### 列表查询（对应 `useBlog`）

```ts
const { data: articles, refresh, status } = useAsyncData('blog-articles', async () => {
  const all = await queryCollection('blog').all()
  const visible = all.filter((a: any) => import.meta.dev || a.draft !== true)
  return visible.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})
```

要点：

- `useAsyncData` 第一个参数是缓存 key；同一 key 全局共享数据与请求状态（首页列表、侧边栏、标签云共用 `'blog-articles'`）。
- 排序在 JS 层完成（按 `date` 倒序）。
- 草稿过滤：dev 环境全部可见；生产构建过滤 `draft === true`。

### 单篇查询（对应 `useArticle`）

```ts
const { data: article } = useAsyncData(route.path, async () => {
  const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
  const result = await queryCollection('blog').path(`/blog/${slug}`).first()
  if (result && !import.meta.dev && result.draft === true) return null
  return result
})
```

### 单页查询（首页 / 关于页）

```ts
const { data: home } = useAsyncData('home-content', async () => {
  return await queryCollection('content').path('/').first()
})
```

## 3. 渲染

```vue
<ContentRenderer v-if="doc" :value="doc" />
```

- 首页、关于页、文章页、测试页均通过 `ContentRenderer` 渲染查询结果。
- 文章页把 `description` 单独渲染为顶部 `ContentAlert type="warning"`。
- MDC 组件（`::alert`、`::tabs`）渲染时自动映射到 `app/components/content/` 下的同名组件。

## 4. 组合式函数约定

- 保持**同步**定义：`useAsyncData` / `useFetch` 需在 setup 期间同步注册，SSR 会自动等待其完成；不要在 composable 内 `await` 之后再调用依赖 Nuxt 上下文的 API。
- SEO 使用 getter 形式，数据更新后自动刷新：

```ts
useSeoMeta({
  title: () => article.value?.title || 'Blog Article',
  description: () => article.value?.description || 'Blog article content'
})
```

- 数据加载后的副作用用 `watch` 处理（如 `useArticle` 中 watch 标题并调用 `usePageTitle().setTitle`）。
- 反例与详细解释见 `docs/nuxt-async-composable-pitfalls.md`。

## 5. QueryBuilder 常用方法（v3）

`queryCollection(name)` 返回链式 QueryBuilder：

- `.all()` / `.first()`：取全部 / 第一条
- `.path(path)`：按文档路径精确匹配（如 `/blog/slug`）
- `.where(field, operator, value)`：条件过滤（如 `.where('draft', '=', false)`）

本项目因需要 `import.meta.dev` 判断与自定义排序，多数过滤与排序选择在 JS 层完成。

## 6. 类型

- `Article` 类型定义位于 `app/types/index.ts`；查询结果按既有写法断言为 `Article`（基础字段由 `content.config.ts` 的 schema 提供）。
