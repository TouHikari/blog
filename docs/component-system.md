# 组件体系

组件位于 `app/components/`，按用途分为 `content/`、`blog/`、`home/`、`ui/` 四个目录，另有根级公共组件。

## 1. Markdown 组件（content/）

`app/components/content/` 下的组件会被 MDC 自动映射（文件名 ↔ 组件名，`Alert.vue` ↔ `::alert`），并覆盖 Nuxt Content 的同名内置组件。

| 组件 | MDC 名称 | Props | 说明 |
| --- | --- | --- | --- |
| `Alert.vue` | `::alert` | `type: 'info' \| 'warning' \| 'danger'`（默认 `info`） | 左侧竖条 + 图标 + hover 渐变叠加层；`info` 蓝色、`warning` 黄、`danger` 红；图标使用 `mdi:*`（`@nuxt/icon`） |
| `Tabs.vue` | `::tabs` | 插槽即标签页 | 默认激活第一个 slot；标签头横向可滚动 |
| `ProsePre.vue` | 覆盖默认 `pre` | `code/language/filename/highlights/meta/class/style` | 行号逻辑见下；`mermaid` 语言拦截交给 `Mermaid.vue` |
| `ProseTable.vue` | 覆盖默认 `table` | 透传 `class/style` | 表格外层包裹横向滚动容器（`.prose-table-scroll`），防止宽表格撑开页面 |
| `Mermaid.vue` | （由 ProsePre 内部使用） | `code?: string` | 客户端渲染 Mermaid 为 SVG；渲染失败时显示错误提示并回退源码 |

### ProsePre 行号规则

- 默认**显示**行号；
- 语言为 `diff`（或类名含 `language-diff`）时**不显示**；
- 文件名或类名含 `no-lines` 时**不显示**；
- 行高亮 / 聚焦行 / 诊断色 / diff 的写作语法见 `.qoder/skills/touhikari-blog-dev/references/mdc-authoring.md`。

### Markdown 组件语法

```md
::alert{type="warning"}
内容（支持 Markdown 与行内代码）
::
```

````md
::tabs
#C++ 应用层接口

```cpp
// 第一个标签页
```

#FFRT 任务接口

```cpp
// 第二个标签页
```

::
````

- `::tabs` 的 slot 标题必须以 **ASCII 字母开头**（`#C++` 可以，`#中文` 会导致 remark-mdc 解析失败）。
- 嵌套在 `::tabs` 内的 alert 使用三冒号 `:::alert{type="warning"}`；更深层依次递增冒号数。

## 2. 公共组件（根级）

| 组件 | 职责 |
| --- | --- |
| `AppHeader.vue` | 固定顶栏：`[TouHikari@localhost ~]$` 品牌、Archives/Categories/Tags/About 导航；滚动超过 100px 后半透明（hover 恢复）；移动端汉堡菜单（`menu-expand` Transition） |
| `AppFooter.vue` | 页脚：欢迎语、版权、Powered by、站点运行时长（基于 `SITE_BIRTHDAY`，`ClientOnly` 渲染防水合不一致）、备案号；整块为 Lock Marked 容器 |
| `TypewriterSlogan.client.vue` | 打字机标语（client-only）；随机选取 `SLOGANS` 且一轮内不重复，配置见 `app/utils/constants.ts` |

## 3. blog/

| 组件 | 职责 |
| --- | --- |
| `Title.vue` | default 布局的文章页标题：打字机逐字渲染 + 光标闪烁 + 心跳图标 + 标语；消费 `usePageTitle` 的全局标题；通过临时渲染完整文本计算 `min-height` 避免布局跳动 |
| `List.vue` | 文章列表（标题 / 日期 / 摘要 / 标签）；数据来自 `useBlog`，可选 prop `articles` 传入筛选结果（标签/分类展开区复用）；摘要区两端对齐；每个条目为 Lock Marked 容器 |
| `QueryResult.vue` | 查询结果单元：终端风查询头（`label` / `term` / 条目数）+ `BlogList`，左侧荧光竖条；供 `/tags`、`/categories` 就地展开使用 |

## 4. home/

| 组件 | 职责 |
| --- | --- |
| `Title.vue` | 首页主标题（固定文案 + `bootup` 开机动画）与标语 |
| `RecentPosts.vue` | 侧边栏「最近文章」：`recentArticles`（前 5 篇），带 Lock Marked 标记 |
| `TagsCloud.vue` | 侧边栏「标签云」：`tags` 计数排序，跳转 `/tags/<编码后的名字>`（`encodeURIComponent`）；带 Lock Marked 标记 |
| `Links.vue` | 侧边栏「相关链接」：GitHub / Bilibili / 网易云音乐 / 友链；带 Lock Marked 标记 |

## 5. ui/

| 组件 | 职责 |
| --- | --- |
| `Button.vue` | 基础按钮：`type: 'navbar-brand' \| 'nav'`，仅负责外观（导航中与 `NuxtLink` 组合使用） |
| `Tag.vue` | 标签样式：`to` 可选（有则渲染为 `NuxtLink`）；`clickable` 渲染为 `<button>` 并透传 `click`；`active` 为选中点亮态；hover 青→亮黄扫描线动效 |
| `Collapse.vue` | 折叠容器：ResizeObserver 持续测量内容高度，高度过渡始终跟随实际内容（字体加载等引起的晚到高度变化也会被平滑吸收）；展开 0.3s / 收起 0.2s 不对称节奏；`contentKey` 变化时内容重建淡入；展开过渡完成时派发 `expanded` 事件（供调用方在动画结束后执行滚动等依赖最终布局的动作）；闭合时内容保留（随高度收缩）并通过 `inert` 禁用交互 |

## 6. Lock Marked 集成点

以下区域已接入鼠标跟随与吸附系统（详细机制见 `docs/lock-marked-guide.md`）：

- 文章列表条目（`blog/List.vue`）：容器 `data-lock-container`，标题/摘要/标签 `data-lock-marked`；
- 首页侧边栏（`home/*`）与页脚（`AppFooter.vue`）：各条目 `data-lock-marked`；
- 首页/关于/文章页正文容器：`data-lock-bg="#FF408020"`、`data-lock-border="1px solid #FF408040"`。

新增标记时注意：被标记元素背景应保持透明或半透明，否则吸附光标会被遮挡（见 Lock Marked 文档的层级策略）。

## 7. 组件编写约定

- 一律使用 `<style scoped lang="scss">`，通过 `@use` 复用 `variables` / `fonts` / `terminal-glow`；不硬编码色值与字体。
- Props 使用 TS 接口 + `withDefaults`（参考 `Alert.vue`、`Button.vue`）。
- 客户端副作用（事件监听、定时器）必须在 `onUnmounted` 中清理（参考 `AppHeader.vue`、`AppFooter.vue`、`blog/Title.vue`）。
- 仅客户端渲染的组件使用 `.client.vue` 后缀（`TypewriterSlogan.client.vue`）。
- 涉及 SSR 水合差异的 UI（如随机图标、时间显示）用 `onMounted` 置位（`isMounted` 模式）或 `ClientOnly` 包裹，避免水合警告。
