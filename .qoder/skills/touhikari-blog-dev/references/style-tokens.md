# 样式令牌与字体栈速查

设计变量的唯一来源：`app/styles/_variables.scss`；字体栈变量：`app/styles/_font-stacks.scss`；发光特效 mixin：`app/styles/terminal-glow.scss`；字体 CSS 唯一注入点：`app/styles/_fonts.scss`、`app/styles/_maple-mono-cn.scss`（均仅被 `main.scss` 引用，组件禁止 `@use`）。

组件中引用方式：

```scss
@use '@/styles/variables' as *;
@use '@/styles/font-stacks' as *;
@use '@/styles/terminal-glow' as *; // 需要发光/闪烁时
```

注意：组件禁止 `@use '@/styles/fonts'`（字体 CSS 唯一注入点，组件引用会导致 `@font-face` 复制进每个 CSS chunk）。

## 1. 品牌色（`$cyberpunk-*`）

| 变量 | 值 | 用途 |
| --- | --- | --- |
| `$cyberpunk-pink` | `#FF4080` | 主强调色（链接 hover、Tag 边框、行高亮） |
| `$cyberpunk-light-pink` | `#FF69B4` | 行高亮竖条 |
| `$cyberpunk-yellow` | `#FFBE0B` | 警示黄（Alert warning） |
| `$cyberpunk-light-yellow` | `#FFFF00` | 亮黄：正文选中、Lock Marked 光标、Mermaid 主色 |
| `$cyberpunk-orange` / `$cyberpunk-light-orange` | `#FB5607` / `#FF8400` | 甘特图已完成状态等 |
| `$cyberpunk-cyan` | `#00FFFF` | 信息色（Alert info 竖条、Mermaid hover 竖条） |
| `$cyberpunk-blue` | `#3A86FF` | 复选框边框、Alert info 主题色 |
| `$cyberpunk-red` / `$cyberpunk-light-red` | `#F8001B` / `#FF2C43` | 危险色（Alert danger、diff 删除行） |
| `$cyberpunk-green` / `$cyberpunk-light-green` | `#00FF00` / `#00FF80` | diff 新增行 |
| `$cyberpunk-purple` | `#8338EC` | 备用 |

带 `40` 后缀的 `$cyberpunk-background-*` 为对应色的 25% 透明度背景变体。

## 2. 背景 / 文本 / 边框

| 变量 | 值 | 用途 |
| --- | --- | --- |
| `$bg-primary` | `#0a0b0d` | 页面背景 |
| `$bg-secondary` | `#0a0d0e` | 组件背景（Alert、Tabs） |
| `$bg-tertiary` | `#121314` | 渐变/头部背景 |
| `$text-primary` | `#e7fffa` | 主文本（青白） |
| `$text-muted` | `#a7ffef` | 次要文本 |
| `$border-primary`~`$border-strong` | `rgba(0,255,170,0.18~0.28)` | 通用边框（青绿） |
| `$neon-cyan*` / `$neon-pink*` | — | 霓虹扩展色 |
| `$gray-50`~`$gray-900` | — | 灰色阶梯（导航/日期） |
| `$black-55/80/85`、`$white-55/80/85` | — | 常用透明度黑白色 |

## 3. 间距 / 布局 / 断点

| 变量 | 值 |
| --- | --- |
| `$spacing-xs`~`$spacing-3xl` | 0.25 / 0.5 / 0.8 / 1 / 1.2 / 2 / 3 rem |
| `$container-max-width` | 900px（正文）；`$container-header-width` 1050px |
| `$border-radius-sm/md/lg/full` | 3 / 8 / 12 / 10 px |
| `$z-index-header/overlay/background` | 20 / 10 / -1 |
| `$breakpoint-mobile` | 768px |
| `$breakpoint-tablet` | 1024px |
| `$breakpoint-desktop` | 1200px |
| `$breakpoint-desktop-lg` | 1400px |
| 过渡 | `$transition-fast` 0.15s / `$transition-normal` 0.25s / `$transition-slow` 0.35s |

媒体查询写法：`@media (max-width: #{$breakpoint-mobile - 1px}) { ... }`；`.inner` 容器宽度阶梯为 720 / 920 / 1000 / 1200px（见 `main.scss`、`home.vue`、`AppHeader.vue`）。

## 4. 字体栈（`_font-stacks.scss`）

组合规则：**纯西文 → 中文 → 系统回退**。

| 组合栈 | 组成 |
| --- | --- |
| `$font-sans` | `$font-latin-sans` → `$font-cjk-sans` → 系统回退 |
| `$font-mono` | JetBrains Mono → Maple Mono CN（自托管）→ 回退（代码、导航、状态栏） |
| `$font-serif` | Times New Roman → Songti SC 回退 |
| `$font-cyber` | Orbitron → AlimamaShuHeiTi → 回退（标题、页脚、侧边栏） |
| `$font-pixel` | Fusion Pixel 10px Proportional KR → FZG_CN → 回退（侧边栏小标题） |

字体来源：`@fontsource/*`（JetBrains Mono、Noto Sans SC、Orbitron、Fusion Pixel）、本地 `public/fonts/`（FZG_CN、AlimamaShuHeiTi、Maple Mono CN 分片，均走 Git LFS）。

## 5. 终端特效 mixin（`terminal-glow.scss`）

| Mixin | 效果 |
| --- | --- |
| `flicker-effect()` | CRT 轻微闪烁动画（3s 循环） |
| `glow-text-sm-1/2/3()` | 单层 text-shadow 发光 + 闪烁 |
| `glow-text-md-1/2/3()` | 双层发光 + 闪烁 |
| `glow-text-lg-1/2/3()` | 多层大范围发光 + 闪烁 |

`body::before` 由该文件提供全屏扫描线覆盖层（`fixed`、`pointer-events: none`）。

`cyber-effects.scss` 提供 `neon-glow`、`glitching`、`flicker`、`pulse`、`cyber-hover` 等工具类与动画，经 `_content.scss` 引入。

## 6. 复合交互规范（改动时保持）

- **Alert**：左侧竖条（3px + 发光）+ `::after` 全屏渐变叠加层，hover 时 `opacity: 0 → 1`，过渡 0.1s。
- **Mermaid 容器**：左侧竖条背景色与 box-shadow 过渡 0.25s（与 Alert 同风格），hover 渐变叠加同 Alert。
- **ProsePre 代码块**：hover 渐变叠加（粉色系）；聚焦行非聚焦模糊 `blur(1.5px)`，hover 恢复。
- **Tag**：青色→亮黄 hover 扫描线动画；与 Lock Marked 光标配合（`data-lock-*` 行内色值 `#FF408020` / `1px solid #FF408040`）。
- **Lock Marked 光标**：亮黄 `#FFFF00` 主色（插件内部样式）。
