# AGENTS.md

本文档面向在此仓库工作的各类 AI 编码智能体（Qoder、Trae、Cursor、Codex 等支持 `AGENTS.md` 的工具）。
开始任何工作前，请先阅读本文档与 `README.md`。使用 Qoder 时，`.qoder/rules/` 下的规则会被自动注入；其余工具可通过本文档获取同等约束。

## 项目概览

- **项目名称**：TouHikari.top
- **项目描述**：TouHikari 的个人技术博客，采用「暗色终端 + 赛博朋克」视觉风格：黑底、霓虹发光、扫描线、等宽字体，文案大量使用终端与黑客文化梗（如 `[TouHikari@localhost ~]$`）。
- **技术栈**：Nuxt 4 + Vue 3.5 + TypeScript；`@nuxt/content` v3 管理 Markdown 内容；SCSS（sass-embedded）样式；Shiki 代码高亮；KaTeX 数学公式；Mermaid 图表；`@nuxt/icon` 图标。
- **部署**：腾讯云 EdgeOne，云端构建命令为 `npm run generate`（静态生成 + prerender `crawlLinks`）。

## 必须遵循的工作流程

1. 需求模糊时，先提出澄清问题，再动手。
2. 编写代码前，先仔细阅读相关代码，描述实现方案，并等待用户批准。
3. 修改已有文件时，使用最小范围的精确补丁（定位到函数/代码块/行段）；除非补丁连续失败且已说明原因并获得批准，不得整文件重写；避免用运行命令的方式改文件。
4. 更高质量的方案优先（可读性、可维护性、正确性）。
5. 完成代码后，如相关测试可行，列出应覆盖的边缘案例并建议测试用例。

## 硬性约束

- **永远不要主动运行 `npm` / `pnpm` 命令**（`dev`、`build`、`generate`、`install` 等），构建、启动与依赖安装一律由用户手动执行，不要启动任何 npm 进程。
- 包管理器使用 **npm**（以 `package-lock.json` 为准）；禁止在 `node_modules` 中混装 npm 与 pnpm 依赖树（会导致 Nuxt/Vite 启动极慢）。重装依赖时删除 `node_modules` 与 pnpm 残留（`.pnpm`、`pnpm-lock.yaml`），保留 `package-lock.json` 并用 npm 重新安装。
- **`.npmrc` 二进制镜像纪律**：只允许配置实测存在（HTTP 200/302）的镜像路径；严禁添加 `sharp_libvips_binary_host`（镜像 404 会导致 sharp 安装失败、ipx 子树缺失，使 EdgeOne 云端构建在 prerender 阶段崩溃）。详见 `docs/build-and-deploy.md`。
- 新增代码避免使用 `any` 类型；样式优先复用 `app/styles/` 中的 SCSS 变量与字体栈，不硬编码色值和字体。
- **注释纪律**：不要在代码中写任何不必要的注释，只保留必要的注释（解释「为什么」：非显然的机制、约束、坑与兼容性原因）；复述代码行为、变更历史或编辑说明的注释一律不写。
- `public/**` 下的静态资源由 Git LFS 管理（见 `.gitattributes`），不要绕过 LFS 直接提交二进制大文件。
- 行内数学公式必须使用 `$...$` 定界符（不支持 `\(...\)`）。

## 常用命令（由用户执行，智能体不要运行）

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动开发服务器（`http://localhost:3000`，host 模式） |
| `npm run build` | 生产环境构建 |
| `npm run generate` | 静态生成（EdgeOne 云端构建使用同一命令） |
| `npm run preview` | 本地预览生产构建 |
| `npm install` | 安装依赖（`postinstall` 自动执行 `nuxt prepare`） |

## 项目结构

```text
app/                 前端源码（Nuxt 4 目录结构）
├─ components/       content（Markdown 组件）/ blog / home / ui + 根级公共组件
├─ composables/      useArticle / useBlog / usePageTitle / useTypewriter
├─ layouts/          default / home / clean
├─ pages/            文件式路由页面
├─ plugins/          mouse-follower（Lock Marked）/ prefetch（预加载）
├─ styles/           SCSS 变量、字体栈与终端特效
├─ types/ utils/     类型定义与工具（常量、Mermaid 渲染）
content/             Markdown 内容（index.md / about.md / blog/ / test/）
docs/                项目技术文档（见下方索引）
content.config.ts    内容集合与 schema 定义
nuxt.config.ts       Nuxt 配置（内容渲染、prerender、SEO、Vite）
```

## 文档索引（修改对应区域前先阅读）

- `docs/content-system.md` — 内容系统：集合定义、查询模式、草稿与摘要、SEO
- `docs/style-system.md` — 样式系统：SCSS 变量、字体栈、终端特效、断点与排版规范
- `docs/component-system.md` — 组件体系：组件清单、Markdown 组件（`::alert`、`::tabs`）语法
- `docs/pages-and-layouts.md` — 页面与布局：路由结构、布局、页面标题系统
- `docs/build-and-deploy.md` — 构建与部署：prerender、EdgeOne、`.npmrc` 镜像纪律
- `docs/lock-marked-guide.md` — 鼠标跟随与吸附系统（Lock Marked）
- `docs/nuxt-async-composable-pitfalls.md` — Nuxt 异步 Composable 与上下文丢失陷阱

## 内容写作约定（速查）

- 文章 frontmatter：`title`、`date`（必填）、`description`、`tags`、`draft`、`toc`。
- 首页文章列表的摘要使用 `<!--more-->` 标记。
- `::tabs` 的 slot 标题必须以 ASCII 字母开头（如 `#C++ 应用层接口`）；嵌套在 `::tabs` 内的 alert 使用 `:::alert{type="warning"}` 三冒号语法。
- `draft: true` 的文章仅在本机 dev 环境渲染可见；生产环境不进入列表 / 详情 / sitemap（数据保留在客户端快照，属刻意设计）。

## Git 提交规范

使用 Conventional Commits 中文规范：

```text
<type>(<scope>): <subject>
// 空行
<body>
```

- `<type>` 与 `<scope>` 使用英文（type 仅限 `feat`、`fix`、`docs`、`style`、`refactor`、`perf`、`test`、`build`、`ci`、`chore`、`revert`）。
- `<subject>` 与 `<body>` 使用中文；`<body>` 先写概述（overview），再以 `-` 列出要点；编程名词用反引号包裹。
- 首行总长度尽量不超过 50 字符（中文按 2 字符计）；中英文之间加空格。
