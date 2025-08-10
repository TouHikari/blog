<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* 全局字体配置 - TouHikari.top 博客专用 */

/* 定义字体变量 */
:root {
  /* 主要字体栈 - 优先使用系统字体，适合博客阅读 */
  --font-sans:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    "PingFang SC",
    "Hiragino Sans GB",
    "Noto Sans SC",
    "Microsoft YaHei",
    "WenQuanYi Micro Hei",
    "Helvetica Neue",
    Helvetica,
    Arial,
    sans-serif;

  /* 等宽字体栈 - 用于代码显示，赛博朋克风格 */
  --font-mono:
    "JetBrains Mono",
    "Fira Code",
    "SF Mono",
    "Monaco",
    "Inconsolata",
    "Roboto Mono",
    "Source Code Pro",
    "Consolas",
    "Courier New",
    monospace;

  /* 衬线字体栈 - 用于标题或特殊文本 */
  --font-serif:
    "Times New Roman",
    "Songti SC",
    "SimSun",
    serif;

  /* 赛博朋克风格的标题字体 */
  --font-cyber:
    "SF Mono",
    "Monaco",
    "Consolas",
    "Courier New",
    monospace;
}

/* 全局字体应用 */
html {
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  font-family: var(--font-sans);
  line-height: 1.7;
  font-weight: 400;
  font-size: 16px;
  letter-spacing: 0.01em;
}

/* 标题字体 - 赛博朋克风格 */
h1 {
  font-family: var(--font-cyber);
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

h2, h3, h4, h5, h6 {
  font-family: var(--font-sans);
  font-weight: 600;
  letter-spacing: 0.01em;
}

/* 代码字体 */
code, pre, kbd, samp {
  font-family: var(--font-mono);
  font-feature-settings: "liga" 1, "calt" 1;
}

/* 内联代码样式 */
code:not(pre code) {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

/* 代码块样式 */
pre {
  background: rgba(0, 0, 0, 0.8);
  color: #00ff00;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  border: 1px solid rgba(0, 255, 0, 0.3);
}

pre code {
  background: none;
  padding: 0;
  border-radius: 0;
  font-size: 0.9em;
  line-height: 1.5;
}

/* 针对中文优化 */
:lang(zh) {
  font-family:
    "PingFang SC",
    "Hiragino Sans GB",
    "Noto Sans SC",
    "Microsoft YaHei",
    "WenQuanYi Micro Hei",
    "Helvetica Neue",
    Arial,
    sans-serif;
  line-height: 1.8;
}

/* 针对英文优化 */
:lang(en) {
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    "Helvetica Neue",
    Helvetica,
    Arial,
    sans-serif;
}

/* 响应式字体大小 */
@media (max-width: 768px) {
  body {
    font-size: 14px;
    line-height: 1.6;
  }

  h1 {
    font-size: 1.8rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.3rem;
  }
}
</style>
