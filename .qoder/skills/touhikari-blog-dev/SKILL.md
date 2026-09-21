---
name: touhikari-blog-dev
description: TouHikari.top 博客仓库开发技能。在 TouHikari.top 项目中工作时触发，包括：(1)开发或修改页面、布局、组件、composable、插件 (2)撰写或调整 Markdown 文章与 MDC 组件语法 (3)调整 SCSS 样式、字体与终端特效 (4)内容查询与 SEO 配置 (5)排查构建、部署与依赖问题。产出符合项目规范的代码与内容。
---

# TouHikari Blog Dev - Nuxt 4 博客开发技能

专注于 TouHikari.top：Nuxt 4 + Vue 3.5 + TypeScript 构建的暗色终端风格个人博客，内容由 `@nuxt/content` v3 管理，样式为 SCSS，部署于腾讯云 EdgeOne。

## 核心技术栈

- **框架**: Nuxt 4（`app/` 目录结构，文件式路由）
- **内容**: `@nuxt/content` v3（构建时索引 `content/`，`queryCollection` API，MDC 组件）
- **样式**: SCSS（sass-embedded），设计变量集中在 `app/styles/`
- **渲染增强**: Shiki 代码高亮（houston 主题）、KaTeX 公式、Mermaid 12

## 开发前置约定

- **不要运行** `npm` / `pnpm` 命令（dev/build/generate/install 等由用户手动执行）。
- 修改文件前先读代码、描述方案并等待批准；改动使用最小范围精确补丁。
- 详细规范见 `.qoder/rules/touhikari-guidelines.md`；模块文档索引见 `AGENTS.md`。

## 常用任务

### 1. 新增 Markdown 组件（content 组件）

1. 在 `app/components/content/` 新建组件，文件名即 MDC 组件名（`Alert.vue` ↔ `::alert`）。
2. 样式使用 `@use '@/styles/variables' as *;` 复用变量；hover 渐变过渡与 `Alert.vue` 保持一致（左侧竖条发光 + 全屏叠加层 `::after` 透明度过渡）。
3. 组件内不要写死色值；Props 保持可选并有默认值。
4. 完成后在 `content/test/` 的文章中验证渲染。

### 2. 撰写新文章

1. 在 `content/blog/` 新建 `*.md`，frontmatter 至少包含 `title` 与 `date`（`date` 必填）；可选 `category`（单值分类，`/categories` 数据源）。
2. 需要在首页列表展示摘要时，在摘要结束处插入 `<!--more-->`。
3. 组件与公式语法见 [references/mdc-authoring.md](references/mdc-authoring.md)。
4. `draft: true` 的文章仅本机 dev 可见，不会进入生产构建。

### 3. 修改样式 / 主题

1. 先在 [references/style-tokens.md](references/style-tokens.md) 中查找对应设计变量，不要在组件中新增硬编码色值。
2. 响应式断点使用 `$breakpoint-mobile/tablet/desktop/desktop-lg`（768/1024/1200/1400px）。
3. 终端发光效果复用 `app/styles/terminal-glow.scss` 的 `glow-text-*` / `flicker-effect` mixin。

### 4. 内容查询（页面数据）

1. 参考 [references/nuxt-content-api.md](references/nuxt-content-api.md) 中本项目已验证的查询模式。
2. 组合式函数保持**同步**定义；不要在 `await` 之后再调用 `useSeoMeta` / `useState` / `useHead`（见 `docs/nuxt-async-composable-pitfalls.md`）。
3. 生产环境需要隐藏草稿：遵循既有 `import.meta.dev` 判断后过滤 `draft !== true` 的模式。

### 5. 添加鼠标吸附标记（Lock Marked）

- 吸附目标加 `data-lock-marked`（或 class `lock_marked`），生效容器加 `data-lock-container`；批量场景用 `data-lock-scan="选择器"`。
- 自定义反应色用 `data-lock-bg` / `data-lock-border`（此处行内色值与既有写法保持一致）。
- 完整说明见 `docs/lock-marked-guide.md`。

### 6. 新增页面

- 在 `app/pages/` 下创建文件；首页级布局需求参考 `app/layouts/home.vue` 的 `definePageMeta({ layout: 'home' })` 模式。
- 页面标题通过 `usePageTitle` 的 `titleMap` 或组件内 `setTitle` 设置（见 `docs/pages-and-layouts.md`）。

## 常见陷阱

- `::tabs` 的 slot 标题必须以 ASCII 字母开头（如 `#C++ 应用层接口`），否则 remark-mdc 无法解析。
- 行内数学公式必须用 `$...$`，不支持 `\(...\)`。
- Mermaid 主题为亮黄色赛博朋克定制（`app/utils/mermaid.ts`），不要改回默认配色；hover 过渡时间与 Alert 一致。
- npm / pnpm 混装 `node_modules` 会导致 Nuxt/Vite 启动极慢。
- `.npmrc` 只允许配置经验证的二进制镜像路径；`sharp_libvips_binary_host` 会导致 EdgeOne 云端构建崩溃。
- 代码块行号默认开启；`diff` 语言与含 `no-lines` 的标记会关闭行号（`ProsePre.vue` 逻辑）。

## 详细参考

- 文章写作语法（frontmatter / MDC / 公式 / 图表）: [references/mdc-authoring.md](references/mdc-authoring.md)
- 样式令牌与字体栈速查: [references/style-tokens.md](references/style-tokens.md)
- 内容查询与渲染 API: [references/nuxt-content-api.md](references/nuxt-content-api.md)
