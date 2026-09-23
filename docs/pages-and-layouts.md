# 页面与布局

项目使用 Nuxt 4 文件式路由，页面在 `app/pages/`，布局在 `app/layouts/`。

## 1. 路由总览

| 路径 | 页面文件 | 布局 | 状态 |
| --- | --- | --- | --- |
| `/` | `pages/index.vue` | `home` | 已实现（内容来自 `content/index.md`） |
| `/about` | `pages/about.vue` | `default` | 已实现（内容来自 `content/about.md`） |
| `/blog` | `pages/blog/index.vue` | `default` | 已实现（归档页：统计头 + 年/月分组列表，数据来自 `useBlog`） |
| `/blog/[...slug]` | `pages/blog/[...slug].vue` | `default` | 已实现（文章页；渲染由 `ArticlePage` 承载，`useArticle('blog')`） |
| `/test/[...slug]` | `pages/test/[...slug].vue` | `default` | 已实现（渲染测试页；渲染由 `ArticlePage` 承载，`collection="test"` → `useArticle('test')`） |
| `/categories` | `pages/categories/index.vue` | `default` | 已实现（分类索引：点击就地展开结果，数据来自 `useBlog`） |
| `/tags` | `pages/tags/index.vue` | `default` | 已实现（标签云：点击就地展开结果，支持 `?tag=` 参数） |

> 标签与分类均采用「就地展开」交互（`ui/Collapse.vue` 承载高度动画），无独立详情页；首页侧栏标签云通过 `/tags?tag=<名字>` 跳转并自动展开对应标签；列表型页面（`/blog`、`/categories`、`/tags`）均设 `definePageMeta({ hideLicense: true })` 隐藏 CC 版权 Alert。

## 2. 布局

| 布局 | 适用 | 结构 |
| --- | --- | --- |
| `default.vue` | 默认（文章页、关于页等） | `AppHeader` → `BlogTitle`（页内标题）→ `.content-prose` 正文区（末尾自动附加 CC BY-SA 4.0 版权 Alert）→ `AppFooter` |
| `home.vue` | 首页（`definePageMeta({ layout: 'home' })`） | `AppHeader` → `HomeTitle` → 双栏容器（内容 5 : 侧边栏 2）：左侧正文 slot + `BlogList`，右侧 `RecentPosts` / `TagsCloud` / `Links` → `AppFooter` |
| `clean.vue` | 预留 | 空布局，当前未被任何页面使用 |

正文区约定：`.content-prose` 负责两端对齐与 `overflow-wrap: break-word`；`=== Content begins/ends here ===` 伪元素标识由 `default.vue` 提供（hover 变亮黄）。`default` 布局末尾自动附加的 CC BY-SA 4.0 版权 Alert 可通过页面 `definePageMeta({ hideLicense: true })` 隐藏；文章页（`/blog/*`、`/test/*`）由 `article-license` 中间件在导航阶段查询文章存在性并设置该 meta——文章不存在（或生产环境下的草稿）时版权条自动隐藏（布局渲染早于 `ArticlePage` 数据就绪，无法由组件内状态后置控制，只能借路由 meta 提前判定）。

页脚贴底：`default` 与 `home` 布局的根容器均为纵向 flex（`min-height: 100dvh`）且 `main` 占满剩余高度——页面内容不足一屏时页脚保持贴住视口底部。

## 3. 页面标题系统（usePageTitle）

`app/composables/usePageTitle.ts` 维护全局标题状态：

1. 优先级：`customTitle`（组件调用 `setTitle` 设置） > `titleMap` 静态映射 > 路径回退。
2. `titleMap` 映射：`/` → Home、`/about` → `[:INIT_USER/TouHikari]`、`/blog` → `[SYS_ARCHIVES]`、`/categories` → `[:METADATA_INDEX]`、`/tags` → `[TAG_CLOUD]`。
3. `/blog/` 前缀的路径回退为 slug 文本；路由变化时仅清除已不属于新路由的 `customTitle`（生产构建下静态缓存命中会使 `setTitle` 先于 `_route` 同步执行，无条件清除会误删刚设置的标题）。
4. 数据驱动页面（文章页）通过 watch 文章标题调用 `setTitle`，标题最终由 `blog/Title.vue` 以打字机方式渲染。

新增页面时的做法：在 `titleMap` 中登记路径，或由页面内调用 `setTitle`（数据加载完成后经 `watch` 同步）。

## 4. SEO

- 全局默认：`nuxt.config.ts` 的 `app.head`（html `lang="zh-CN"`、标题、描述、keywords、Open Graph、Twitter Card、JSON-LD、canonical、RSS）。
- 页面级覆盖：
  - `pages/index.vue`：`useSeoMeta`（首页 title/description）；
  - `useArticle`：getter 形式的 `useSeoMeta`（文章标题/描述随数据更新自动刷新）。

## 5. 预加载（plugins/prefetch.client.ts）

hover-only 收敛策略，只针对站内链接（`/` 开头且非 `#`）：

1. **普通 `<a>` 链接**（本插件）：`mouseover` 后 50ms 防抖触发 `preloadRouteComponents` + `preloadPayload`（`Set` 去重；`mouseout` 取消，同一链接内部子元素间移动不重置）；触屏设备（`pointer: coarse`）无 hover 语义，直接跳过。
2. **`NuxtLink`**：由 `nuxt.config.ts` 的 `experimental.defaults.nuxtLink.prefetchOn = { visibility: false, interaction: true }` 控制——关闭「进入视口即预取」，仅保留 hover / focus 交互预取。

该插件只在客户端运行（`.client.ts`）。

## 6. 新增页面指引

1. 在 `app/pages/` 下创建 `.vue` 文件（目录结构即路由）。
2. 需要特殊布局时使用 `definePageMeta({ layout: 'home' })`。
3. 内容驱动页面通过 `useAsyncData` + `queryCollection` 查询（保持同步模式，参考 `pages/index.vue`）；博客列表型页面复用 `useBlog`（参考 `pages/blog/index.vue`）。
4. 在 `usePageTitle` 的 `titleMap` 中登记标题（可选）。
5. 交互区域可添加 Lock Marked 标记（`data-lock-container` / `data-lock-marked`）。
6. 完成后验证：SSR 无上下文报错、标题正确、CSS 在全部断点下正常。

## 7. 错误页（app/error.vue）

`app/error.vue` 是 Nuxt 根级错误页（特殊页面），渲染时**完整替换 `app.vue`**（`nuxt-root` 中错误组件与 AppComponent 互斥），遵循以下约定：

- 不使用 `NuxtLayout`（布局渲染链不存在）；页面自行引用 `AppHeader` / `AppFooter`，保持全局导航与页脚信息（备案号、运行时长）完整；
- `app.vue` 的 `titleTemplate` 不生效，错误页自带完整标题（`404 | TouHikari.top`）；
- 文案与配色区分 404（页面不存在）与其它状态码（如 500 服务器故障），`statusCode` 缺省兜底为 500；
- 恢复导航使用 `clearError({ redirect: '/' })`：成功导航后错误态会被 Nuxt 自动清除（`pages/runtime/plugins/router.js` 的 `afterEach`）；当前 URL 已是 `/` 的重复导航场景（如首页运行时错误）由 `clearError` 自身兜底恢复——这也是恢复入口用 `<button>` 而非 `NuxtLink` 的原因；
- 错误页内的 `NuxtLink`（`AppHeader` / `AppFooter`）可直接使用，导航成功后自动恢复；
- 静态站行为：线上不存在的路径在 HTML 层由 EdgeOne 平台 404 兜底（不经过 `error.vue`）；`error.vue` 实际覆盖「客户端 SPA 导航到无效路径」与「运行时错误」场景。
