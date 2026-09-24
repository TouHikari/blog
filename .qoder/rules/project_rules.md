---
trigger: always_on
---
1. 如果我给出的需求模糊，请在实操前提出澄清问题。
2. 在编写任何代码前，先认真阅读相关代码，然后描述你的方法并等待批准。
3. 完成代码编写后，如果代码可以有相关测试用例，建议列出边缘案例并建议覆盖它们的测试用例。
4. 代码质量至上，如果对代码的可维护性、可读性等质量指标有好处的话，应毫不犹豫选择这个最优解法。
5. 修改已有文件时，必须优先采用最小范围的精确补丁，直接定位到对应函数、代码块或行段进行修改；除非局部补丁连续失败且已明确说明原因并获得批准，否则不得通过删除后整文件重写的方式完成修改。尽可能不使用运行命令的方式修改文件，那很危险！
6. **项目名称**：TouHikari.top
7. **项目描述**：TouHikari 的个人技术博客，采用「暗色终端 + 赛博朋克」视觉风格：黑底、霓虹发光、扫描线、等宽字体，文案大量使用终端与黑客文化梗（如 `[TouHikari@localhost ~]$`）。基于 Nuxt 4 + Vue 3 + TypeScript 构建，Markdown 内容由 `@nuxt/content` v3 管理。
8. 项目具有 [README 文件](README.md) 与 [AGENTS.md](AGENTS.md)，开始工作前请先阅读；面向智能体的结构化开发规范见 `.qoder/rules/touhikari-guidelines.md`。
9. **技术栈**：Nuxt 4 / Vue 3.5 / TypeScript / @nuxt/content v3 / SCSS（sass-embedded）/ Shiki 代码高亮 / KaTeX 数学公式 / Mermaid 图表 / @nuxt/icon；包管理器使用 npm（以 package-lock.json 为准）。
10. 永远不要主动运行 `npm` / `pnpm` 命令（`dev`、`build`、`generate`、`install` 等），构建、启动与依赖安装一律由我手动执行，不要启动任何 npm 进程。
11. 禁止在 `node_modules` 中混装 npm 与 pnpm 的依赖树，这会导致 Nuxt/Vite 因文件数激增而启动极慢。如需重装依赖，先彻底删除 `node_modules` 与 pnpm 残留（`.pnpm`、`pnpm-lock.yaml`），保留 `package-lock.json` 后仅用 npm 安装。
12. `.npmrc` 二进制镜像纪律：只允许配置经过实际验证（curl 返回 200/302）的镜像路径；严禁添加 `sharp_libvips_binary_host`——该镜像路径实测 404，会导致 sharp 安装失败、`@nuxt/image` 的 ipx 子树被静默跳过，最终使 EdgeOne 云端构建在 prerender 阶段崩溃（详见 `docs/build-and-deploy.md`）。
13. 项目部署于腾讯云 EdgeOne，云端构建命令为 `npm run generate`（静态生成 + prerender `crawlLinks`）。
14. 项目重要技术文档位于 `docs/` 目录下，修改对应区域前请先阅读相关文档：
    - 内容系统（集合定义、查询模式、草稿与摘要）：`docs/content-system.md`
    - 样式系统（SCSS 变量、字体栈、终端特效 mixin）：`docs/style-system.md`
    - 组件体系（content / blog / home / ui 组件与 Markdown 组件语法）：`docs/component-system.md`
    - 页面与布局（路由结构、三个布局、页面标题系统）：`docs/pages-and-layouts.md`
    - 构建与部署（prerender、EdgeOne、.npmrc 镜像纪律）：`docs/build-and-deploy.md`
    - 鼠标跟随与吸附系统（Lock Marked）：`docs/lock-marked-guide.md`
    - Nuxt 异步 Composable 与上下文丢失陷阱：`docs/nuxt-async-composable-pitfalls.md`
15. 新增代码避免使用 `any` 类型（既有代码中的宽松类型不要扩散）；样式优先复用 `app/styles/` 中的 SCSS 变量与字体栈，不要硬编码色值和字体。
16. `public/**` 下的静态资源由 Git LFS 管理（见 `.gitattributes`），不要绕过 LFS 直接提交二进制大文件。
17. Git 提交信息遵循 Conventional Commits 中文规范：`<type>(<scope>): <subject>`，type/scope 用英文、subject/body 用中文，中英文之间加空格（详见 `AGENTS.md`）。
18. 不要在代码中写任何不必要的注释，只保留必要的注释——用于解释「为什么」（非显然的机制、约束、坑与兼容性原因）；复述代码行为、变更历史或编辑过程说明的注释一律不写。
