# 构建与部署

## 1. 常用命令（由开发者手动执行）

| 命令 | 作用 |
| --- | --- |
| `npm install` | 安装依赖；`postinstall` 自动执行 `nuxt prepare` |
| `npm run dev` | 启动开发服务器（`http://localhost:3000`，`--host` 模式） |
| `npm run build` | 生产环境构建 |
| `npm run generate` | 静态生成（部署产物；EdgeOne 云端构建使用同一命令） |
| `npm run preview` | 本地预览生产构建 |

> 仓库托管于 GitHub（`origin`）与 CNB（`cnb`，`cnb.cool/TouHikari/blog`）。`.cnb.yml` 定义了云端 VSCode 工作区（启动命令 `npm install && npm run dev`）；本地开发请保持 npm 单包管理器（以 `package-lock.json` 为准）。

## 2. nuxt.config.ts 要点

| 配置 | 说明 |
| --- | --- |
| `modules` | `@nuxt/content`、`@nuxt/eslint`、`@nuxt/icon` |
| `content.build.markdown` | TOC 深度 3；Shiki 高亮主题 `houston` + 语言白名单；`remark-math` + `rehype-katex`（数学公式） |
| `nitro.prerender` | `crawlLinks: true`；额外路由 `/sitemap.xml`；忽略 `/preview`、`/secret` |
| `app.head` | 全站 SEO：标题、描述、keywords、Open Graph、Twitter Card、JSON-LD、canonical、RSS link |
| `ssr` | `true`（服务端渲染 + 静态生成） |
| `vite.optimizeDeps.include` | `["mermaid"]`：mermaid 为客户端动态加载，预构建避免首次渲染的编译延迟 |
| `css` | `katex/dist/katex.min.css` + `~/styles/main.scss` |

## 3. 静态生成与 prerender

- `npm run generate` 会基于 `crawlLinks` 爬取站内链接并预渲染所有页面；`sitemap.xml` 由 `server/routes/sitemap.xml.ts` 在构建时生成（prerender 静态化输出，数据与页面查询一致、自动排除草稿），`robots.txt` 为 `public/` 下的静态文件直接提供。
- 内容（`content/`）在构建期固化：修改文章后需要重新构建部署才会生效。
- 文章页 `description` 等渲染细节见 `docs/content-system.md`。

## 4. 包管理器与 node_modules 卫生

- 全项目统一使用 **npm**（`package-lock.json` 为唯一 lock 文件），不要引入 pnpm。
- 混装症状：`node_modules` 中同时存在 npm 扁平依赖树与 pnpm `.pnpm` 残留，文件数可达 8 万+，Vite/Nuxt 启动时的文件扫描、`realpath` 解析与 HMR 监听因 NTFS 小文件 I/O 与安全软件实时扫描而变得极慢。
- 恢复方法：彻底删除 `node_modules` 与 pnpm 残留（`.pnpm`、`pnpm-lock.yaml`），保留 `package-lock.json`，只用 npm 重新安装。

## 5. .npmrc 二进制镜像纪律（重要）

项目中存在 native 模块（`better-sqlite3`，`@nuxt/content` 构建依赖），其预编译二进制默认从 GitHub Releases 下载，网络受限时需要二进制镜像。当前 `.npmrc` 只配置了**一个经过验证的镜像**：

```ini
better_sqlite3_binary_host=https://registry.npmmirror.com/-/binary/better-sqlite3
```

### 规则

1. 只允许添加**实际验证过存在**（`curl -I` 返回 200/302）的镜像路径。
2. 依赖树引入任何带原生二进制的包（如 sharp）前，先验证镜像路径；**严禁**配置未验证的路径——历史上 npmmirror 的 libvips 路径实测 404，导致过完整构建事故（见下方根因链）。

### 历史事故根因链（2026-09 实测案例，已闭环）

1. `@nuxt/image` 曾被注册在 `modules` 中（现已移除），其运行时依赖会打进 server bundle；
2. `ipx` 是 `@nuxt/image` 的 `optionalDependency`，其传递依赖 `sharp` 需要下载 libvips 原生二进制；
3. `.npmrc` 中错误的 `sharp_libvips_binary_host`（404）把 sharp 的下载改道至死路 → sharp 安装失败 → npm 按 optional 语义**静默跳过** ipx 子树（安装阶段无报错）；
4. 依赖 lock 变化导致 EdgeOne 依赖缓存失效、触发全新安装后，prerender 阶段加载 server 运行时即报 `Cannot find package 'ipx'`。

**闭环处理（2026-09-23）**：`@nuxt/image` 全站零使用，已从 `modules`、依赖与 `.npmrc` 中完整移除，`sharp → libvips` 风险链从源头消除。

结论保留：**错误的镜像比没有镜像更危险**。镜像配置变更后应验证本地安装，并关注云端首次全量构建。

## 6. EdgeOne 部署

- 平台：腾讯云 EdgeOne；构建命令 `npm run generate`（输出静态产物）。
- 依赖缓存与 lock 文件绑定：lock 变化会触发全新安装，是上述依赖问题最容易暴露的窗口。
- 排查顺序（构建失败时）：构建日志定位阶段（install / build / prerender）→ 检查 `.npmrc` 每个镜像路径是否有效（curl HEAD）→ 检查 lock 文件变化 → 本地复现安装。

## 7. 静态资源与 LFS

- `.gitattributes` 将 `public/**` 交给 Git LFS 管理，不要绕过 LFS 直接提交二进制大文件。
- 字体文件：`public/fonts/`（FZG_CN、AlimamaShuHeiTi、`maple-mono-cn/` 的 239 个 woff2 分片）均由 LFS 管理；EdgeOne 云端构建可正常拉取（已实测验证）。
- 新增图片建议放入 `public/images/<文章名>/` 目录（现有文章已按此组织）。

## 8. 变更检查清单

- 修改依赖或 `.npmrc` 后：
  1. 本地 `npm install` 验证安装无缺失；
  2. 本地 `npm run generate` 验证 prerender 通过；
  3. 推送后观察 EdgeOne 首次全量构建日志。
- 修改 `nuxt.config.ts` 的 prerender / modules 配置时：同步检查本文档第 2、5 节与 `.qoder/rules/` 中的相关约束。
