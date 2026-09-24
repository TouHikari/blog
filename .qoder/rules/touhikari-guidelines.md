---
trigger: always_on
---

# TouHikari.top 开发规范

## 适用场景

在 `TouHikari.top` 仓库中进行开发、代码审查、调试或方案规划时，使用本规范。

本项目是 TouHikari 的个人技术博客，基于 Nuxt 4 + Vue 3 + TypeScript 构建，Markdown 内容由 `@nuxt/content` v3 管理，样式使用 SCSS，部署于腾讯云 EdgeOne。

## 必须遵循的工作流程

1. 如果用户的需求模糊不清，在动手修改前先提出澄清问题。
2. 编写代码前，先仔细阅读相关代码，描述实现方案，并等待批准。
3. 当更高质量的方案能提升可读性、可维护性或正确性时，应优先选择该方案。
4. 编辑已有文件时，使用最小范围的精确补丁，直接定位到相关函数、代码块或行段。
5. 除非局部补丁连续失败、已说明原因并获得批准，否则不得整文件重写。
6. 当精确补丁可行时，避免通过运行命令的方式修改文件。
7. 永远不要主动运行 `npm` / `pnpm` 命令（`dev`、`build`、`generate`、`install` 等），一律由用户手动执行。

## 项目架构

- 遵循仓库根目录的 `README.md` 与 `AGENTS.md` 了解项目整体结构。
- 项目使用 Nuxt 4 目录结构，前端代码位于 `app/`：
  - `app/components/`：`content/`（Markdown 组件）、`blog/`、`home/`、`ui/` 及根级公共组件
  - `app/composables/`：`useArticle`、`useBlog`、`usePageTitle`、`useTypewriter`
  - `app/layouts/`：`default`、`home`、`clean`
  - `app/pages/`：路由页面（文件式路由）
  - `app/plugins/`：`mouse-follower.client.ts`（Lock Marked）、`prefetch.client.ts`（预加载）
  - `app/styles/`：SCSS 变量、字体与特效
  - `app/types/`、`app/utils/`：类型定义与工具（常量、Mermaid 渲染）
- 内容（Markdown）位于 `content/`，集合定义在 `content.config.ts`：
  - `content` 集合：`content/*.md`（首页 `index.md`、`about.md`）
  - `blog` 集合：`content/blog/*.md`
  - `test` 集合：`content/test/*.md`
- 重要项目文档位于根目录 `docs/` 下。修改对应区域前，请先阅读相关指南：
  - 内容系统（集合、查询、草稿与摘要）：`docs/content-system.md`
  - 样式系统（变量、字体栈、终端特效）：`docs/style-system.md`
  - 组件体系（组件清单与 Markdown 组件语法）：`docs/component-system.md`
  - 页面与布局（路由、布局、标题系统）：`docs/pages-and-layouts.md`
  - 构建与部署（prerender、EdgeOne、.npmrc）：`docs/build-and-deploy.md`
  - 鼠标跟随与吸附系统（Lock Marked）：`docs/lock-marked-guide.md`
  - Nuxt 异步 Composable 陷阱：`docs/nuxt-async-composable-pitfalls.md`

## 实现规则

- 包管理器统一使用 npm（以 `package-lock.json` 为准）；严禁 npm/pnpm 混装 `node_modules`（会导致 Nuxt/Vite 启动极慢）。
- 不要改动 `.npmrc` 中的二进制镜像配置，除非已用 curl HEAD 验证路径真实存在（返回 200/302）；严禁添加 `sharp_libvips_binary_host`（会导致 EdgeOne 云端构建崩溃）。
- 内容是站点的一等公民：文章 frontmatter 与写作规范遵循 `docs/content-system.md`；`draft: true` 的文章只在本机 dev 环境可见。
- 自定义 Markdown 组件（`::alert`、`::tabs` 等）的语法规定见 `docs/component-system.md`；行内数学公式必须使用 `$...$` 定界符。
- 样式优先复用 `app/styles/_variables.scss` 的颜色/间距/断点变量与 `_fonts.scss` 的字体栈，不要硬编码色值与字体（例外：`data-lock-*` 属性中的行内色值，与既有写法保持一致）。
- 正文排版：文章正文两端对齐（`text-align: justify; text-justify: inter-ideograph;`）；内容容器保持 `overflow-wrap: break-word`，防止长 URL 撑开页面。
- Mermaid 图表主题为亮黄色系赛博朋克风格，hover 过渡需与 `Alert` 组件保持一致，不要改回默认配色（见 `app/utils/mermaid.ts`）。
- 异步 Composable：不要在 composable 内 `await` 之后再调用依赖 Nuxt 上下文的 API（`useSeoMeta` / `useState` / `useHead`），详见 `docs/nuxt-async-composable-pitfalls.md`。
- 新增页面时同步考虑页面标题（`usePageTitle` 的 `titleMap` 或 `customTitle` 机制，见 `docs/pages-and-layouts.md`）。
- 注释纪律：不要在代码中写任何不必要的注释，只保留必要的注释（解释「为什么」：非显然的机制、约束、坑与兼容性原因）；复述代码行为、变更历史或编辑说明的注释一律不写。

## 内容与组件语法速记（详见 docs/）

- 文章摘要截断标记：`<!--more-->`（用于首页文章列表摘要）。
- `::tabs` 的 slot 标题必须以 ASCII 字母开头（如 `#C++ 应用层接口`），否则 remark-mdc 无法解析。
- 嵌套在 `::tabs` 内的 alert 使用三冒号 `:::alert{type="warning"}` 语法；更深的嵌套依次增加冒号。
- 代码块行号：默认显示；`diff` 语言与文件名/类名含 `no-lines` 时不显示（见 `app/components/content/ProsePre.vue`）。
- Mermaid 代码块（`` ```mermaid ``）由 `ProsePre` 拦截并交给 `Mermaid` 组件渲染，渲染失败时回退显示源码。

## 测试指引

代码修改完成后，如果相关测试可行，列出应覆盖的边缘案例并建议有针对性的测试用例。

本项目暂无自动化测试框架，验证优先级：内容渲染（MDC 组件 / KaTeX 公式 / Mermaid 图表）> 交互（Lock Marked / 打字机 / 预加载）> 样式（多断点响应式、深色主题一致性）。
