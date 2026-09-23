# TouHikari.top

> TouHikari 的数字幽灵日志。穿梭于代码与现实的边界，记录那些隐藏在防火墙之后的故事、实验和顿悟。
> 这个网站是一个正在进行的实验。谨慎访问。

> 从 2026-09-21 开始，本项目不再纯手搓了，开始引入 Agent coding。

TouHikari 的个人技术博客，采用「暗色终端 + 赛博朋克」视觉风格：黑底、霓虹发光、扫描线、等宽字体，文案大量使用终端与黑客文化梗（如 `[TouHikari@localhost ~]$`）。

线上地址：[touhikari.top](https://touhikari.top)

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 框架 | Nuxt 4 + Vue 3.5 + TypeScript |
| 内容 | `@nuxt/content` v3（Markdown + MDC 自定义组件） |
| 样式 | SCSS（sass-embedded）+ 自定义设计变量与终端特效 |
| 渲染增强 | Shiki 代码高亮、KaTeX 数学公式、Mermaid 图表 |
| 图标 | `@nuxt/icon` |
| 代码质量 | `@nuxt/eslint` |
| 包管理 | npm |
| 部署 | 腾讯云 EdgeOne（静态生成） |

## 功能特性

- 首页：文章列表 + 侧边栏（搜索 / 最近文章 / 标签云 / 相关链接）
- 文章页：描述弹窗、MDC 自定义组件（Alert / Tabs）、代码行号与聚焦行高亮、Mermaid 图表、KaTeX 公式
- 交互效果：鼠标跟随与吸附系统（Lock Marked）、打字机标语、终端启动动画、扫描线
- 性能：hover-only 预加载（50ms 防抖 + 去重；触屏设备跳过）
- SEO：Open Graph、Twitter Card、JSON-LD、sitemap、robots

## 快速开始

环境要求：Node.js 20 及以上（推荐 LTS）；包管理器使用 npm。

```bash
npm install        # 安装依赖（自动执行 nuxt prepare）
npm run dev        # 启动开发服务器 http://localhost:3000
npm run build      # 生产环境构建
npm run generate   # 静态生成（部署产物）
npm run preview    # 本地预览生产构建
```

注意事项：

- 本项目使用 npm 管理依赖（以 `package-lock.json` 为准），不要引入 pnpm 依赖树：`node_modules` 中混装两套依赖会显著拖慢 Nuxt/Vite 的启动与热更新。
- `.npmrc` 中为 native 依赖（better-sqlite3）配置了二进制下载镜像；修改镜像配置前请先阅读 [docs/build-and-deploy.md](docs/build-and-deploy.md)，只允许添加经过验证的镜像路径。

## 目录结构

```text
app/                 前端源码（Nuxt 4 目录结构）
├─ components/       content（Markdown 组件）/ blog / home / ui + 根级公共组件
├─ composables/      useArticle / useBlog / useSearch / usePageTitle / useTypewriter
├─ layouts/          default / home / clean
├─ pages/            文件式路由页面
├─ plugins/          mouse-follower（Lock Marked）/ prefetch（预加载）
├─ styles/           SCSS 变量、字体栈与终端特效
├─ types/ utils/     类型定义与工具（常量、日期、Mermaid 渲染）
content/             Markdown 内容（index.md / about.md / blog/ / test/）
docs/                项目技术文档
public/              静态资源（Git LFS 管理）
content.config.ts    内容集合与 schema 定义
nuxt.config.ts       Nuxt 配置（内容渲染、prerender、SEO、Vite）
```

## 内容写作

- 文章放在 `content/blog/`（正式）或 `content/test/`（测试页），首页与关于页为 `content/index.md`、`content/about.md`。
- 文章 frontmatter 常用字段：`title`、`date`（必填）、`description`、`tags`、`draft`、`toc`。
- 首页文章列表的摘要使用 `<!--more-->` 标记截断。
- `draft: true` 的文章只在本机开发环境渲染可见；生产环境不进入列表 / 详情 / sitemap（数据保留在客户端快照，属刻意设计，详见 [docs/content-system.md](docs/content-system.md)）。
- Markdown 组件语法（`::alert`、`::tabs`、公式、Mermaid 等）见 [docs/component-system.md](docs/component-system.md)。

## 部署

项目部署于腾讯云 EdgeOne，云端构建命令为 `npm run generate`（静态生成，prerender 开启 `crawlLinks`）。
部署与依赖安装的注意事项（`.npmrc` 镜像纪律与历史事故记录）见 [docs/build-and-deploy.md](docs/build-and-deploy.md)。

## 文档

| 文档 | 内容 |
| --- | --- |
| [AGENTS.md](AGENTS.md) | 面向 AI 智能体的协作约定与硬性约束 |
| [docs/content-system.md](docs/content-system.md) | 内容系统：集合、查询、草稿与摘要、SEO |
| [docs/style-system.md](docs/style-system.md) | 样式系统：SCSS 变量、字体栈、终端特效 |
| [docs/component-system.md](docs/component-system.md) | 组件体系：组件清单与 Markdown 组件语法 |
| [docs/pages-and-layouts.md](docs/pages-and-layouts.md) | 页面与布局：路由、布局、标题系统 |
| [docs/build-and-deploy.md](docs/build-and-deploy.md) | 构建与部署：prerender、EdgeOne、镜像纪律 |
| [docs/lock-marked-guide.md](docs/lock-marked-guide.md) | 鼠标跟随与吸附系统（Lock Marked） |
| [docs/nuxt-async-composable-pitfalls.md](docs/nuxt-async-composable-pitfalls.md) | Nuxt 异步 Composable 陷阱 |

## 许可

- 代码：[GPL-3.0](LICENSE.txt)
- 文章内容：知识共享署名-相同方式共享 4.0 国际许可协议（CC BY-SA 4.0）
