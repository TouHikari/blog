# 样式系统

项目样式基于 SCSS（`sass-embedded` 编译），设计令牌集中在 `app/styles/`，核心风格为「暗色终端 + 赛博朋克」：黑底、霓虹发光、扫描线与等宽字体。

## 1. 加载链路

- `nuxt.config.ts`：`css: ["~/styles/main.scss"]`；KaTeX 样式已拆出，仅在 `ArticlePage` 内按需引入（其他页面不加载）。
- `main.scss` → `@use './variables'`、`'./fonts'`、`'./maple-mono-cn'`、`'./alimama-shuheiti'`、`'./content'`。其中 `'./fonts'`、`'./maple-mono-cn'` 与 `'./alimama-shuheiti'` 是字体 CSS 的**唯一注入点**，只允许出现在这里。
- `_content.scss` → `@use './font-stacks'`、`'./terminal-glow'`（发光/闪烁 mixin 随内容样式一并打包）。
- 组件内按需 `@use`（SCSS 模块系统，变量/字体栈/mixin 可在任意组件复用）：

```scss
@use '@/styles/variables' as *;
@use '@/styles/font-stacks' as *;
@use '@/styles/terminal-glow' as *; // 需要发光/闪烁效果时
```

> ⚠️ 组件**禁止** `@use '@/styles/fonts'`：该文件承载全部 `@font-face` 声明，Sass 的 `@use` 会把它复制进每个组件的 CSS 产物（曾导致每页 HTML 膨胀至 2.6 MB）。

## 2. 文件职责

| 文件 | 职责 |
| --- | --- |
| `_variables.scss` | 全部设计令牌：颜色、间距、字体尺寸/行高/字重、布局、断点、动画、网格与扫描线参数 |
| `_font-stacks.scss` | 五类组合字体栈等纯 SCSS 变量（零 CSS 输出），供组件 `@use` |
| `_sidebar.scss` | 侧边栏组件共用 mixin（`sidebar-heading` 标题样式：虚线底边 + 统一间距），零 CSS 输出 |
| `_fonts.scss` | 字体 CSS 唯一注入点：`@fontsource` 导入与本地 `@font-face`（Orbitron 自托管、FZG_CN），仅被 `main.scss` 引用 |
| `_maple-mono-cn.scss` | Maple Mono CN 的 239 条 `@font-face` 分片声明（自托管 `public/fonts/maple-mono-cn/`，Git LFS），仅被 `main.scss` 引用 |
| `_alimama-shuheiti.scss` | AlimamaShuHeiTi 的 34 条 `@font-face` 分片声明（自托管 `public/fonts/alimama-shuheiti/`，Git LFS），仅被 `main.scss` 引用 |
| `_content.scss` | Markdown 正文排版：标题辉光、代码、行内代码、链接、列表、引用、表格、图片、文本样式 |
| `terminal-glow.scss` | 发光/闪烁 mixin（`glow-text-*` / `flicker-effect`），零 CSS 输出 |
| `_scanlines.scss` | 全屏扫描线（`body::before`）与全局关键帧（`flicker`、`blink`） |
| `main.scss` | 全局基础：`html/body`、选区、链接、复选框、`.inner` 容器宽度阶梯与多断点适配 |

## 3. 设计令牌（摘要）

- **主色板**：`$cyberpunk-*` 系列（pink `#FF4080`、yellow `#FFBE0B`、light-yellow `#FFFF00`、cyan `#00FFFF`、blue `#3A86FF`、orange、purple、green、red 及透明度变体）。
- **背景**：`$bg-primary #0a0b0d` / `$bg-secondary #0a0d0e` / `$bg-tertiary #121314`。
- **文本**：`$text-primary #e7fffa`（青白）、`$text-muted #a7ffef`。
- **断点**：`$breakpoint-mobile` 768px / `tablet` 1024px / `desktop` 1200px / `desktop-lg` 1400px；`.inner` 容器宽度阶梯为 720 / 920 / 1000 / 1200px。
- **过渡**：`$transition-fast` 0.15s / `normal` 0.25s / `slow` 0.35s。

完整变量清单与复用规范见 `.qoder/skills/touhikari-blog-dev/references/style-tokens.md`。

## 4. 字体系统

组合规则：**纯西文 → 中文 → 系统回退**。

| 组合栈 | 用途 |
| --- | --- |
| `$font-sans` | 正文 |
| `$font-mono` | 代码、导航、状态栏（JetBrains Mono + Maple Mono CN 自托管） |
| `$font-cyber` | 标题、页脚、侧边栏（Orbitron 自托管 + AlimamaShuHeiTi） |
| `$font-pixel` | 侧边栏小标题（Fusion Pixel + FZG_CN） |
| `$font-serif` | 衬线场景 |

新增字体的步骤：引入字体文件（`@fontsource/*` 或 `public/fonts/`）→ 在 `_fonts.scss` 声明 `@font-face`/导入（CSS 层）→ 在 `_font-stacks.scss` 更新对应组合栈（变量层）。

## 5. 排版与交互规范（修改时必须保持）

- **正文两端对齐**：文章正文使用 `text-align: justify; text-justify: inter-ideograph;`（CJK 优化断行，最后一行不拉伸），见 `app/layouts/default.vue` 的 `.content-prose`。
- **长 URL 防撑页**：内容容器（文章正文与首页）保持 `overflow-wrap: break-word`，覆盖段落、列表、引用与表格中的长链接。
- **宽表格**：由 `ProseTable` 组件的外层滚动容器承载横向滚动，不要另加容器。
- **hover 过渡一致性**：`Alert` 使用左侧竖条 + `::after` 渐变叠加层（0.1s）；`Mermaid` 容器使用同风格竖条（0.25s）与叠加层；代码块 `ProsePre` 为粉色系叠加。新增相邻组件时请沿用同色系、同过渡时间。
- **Mermaid 主题联动**：`app/utils/mermaid.ts` 中的 `themeVariables` 与色板一一对应（主色亮黄 `#FFFF00`、连线粉 `#FF4080`、甘特图状态色等）；修改色板时需同步检查该文件。

## 6. 响应式

| 断点区间 | 主要变化 |
| --- | --- |
| `< 768px` | 顶部导航切换为汉堡菜单；文章列表头部纵向排列；`.inner` 内边距 20px |
| `768 ~ 1023px` | `.inner` 最大宽 720px；标题字号缩小 |
| `1024 ~ 1199px` | `.inner` 最大宽 920px |
| `1200 ~ 1399px` | `.inner` 最大宽 1000px |
| `>= 1400px` | `.inner` 最大宽 1200px |

媒体查询统一写作 `@media (max-width: #{$breakpoint-mobile - 1px})` 等形式，直接使用 `_variables.scss` 中的断点变量。

## 7. 约定

- 组件内**不硬编码色值与字体**，一律复用变量（例外：`data-lock-*` 属性中的行内色值，与既有写法保持一致）。
- 需要发光/闪烁时复用 `terminal-glow.scss` 的 mixin，不要在组件内重复定义关键帧。
- 全局性修改（如新增工具类或关键帧）放入 `terminal-glow.scss`；一次性的组件样式留在组件 `<style scoped>` 内。
