# MDC 文章写作语法速查

TouHikari.top 的文章由 `@nuxt/content` v3 + MDC 渲染。以下为本项目已验证的写作语法。

## 1. Frontmatter

### blog 集合（`content/blog/*.md`）

```yaml
---
title: 文章标题          # 字符串，可选
date: 2026-02-19        # 必填
category: web           # 可选，单值分类（/categories 数据源）
description: 摘要描述    # 可选，会渲染为文章页顶部的 warning Alert
tags:                   # 可选，字符串数组
  - tag-a
  - tag-b
draft: true             # 可选，仅本机 dev 环境可见
toc: true               # 可选
---
```

### 其它集合

- `content/*.md`（首页 `index.md`、`about.md`）：`title`、`description` 可选。
- `content/test/*.md`：`date` / `draft` / `toc` 可选。

## 2. 摘要截断标记

`<!--more-->` 标记首页文章列表的摘要截断位置（`useBlog` 读取 `meta.excerpt` 渲染摘要）。

## 3. Alert 组件（`::alert` ↔ `Alert.vue`）

```md
::alert{type="info"}
内容（支持 Markdown 与行内代码）
::
```

- `type` 取值：`info`（默认）/ `warning` / `danger`。
- 嵌套在 `::tabs` 内时改用三冒号：`:::alert{type="warning"}`；再深一层依次增加冒号。

## 4. Tabs 组件（`::tabs` ↔ `Tabs.vue`）

````md
::tabs
#C++ 应用层接口

```cpp
// 第一个标签页的内容
```

#FFRT 任务接口

```cpp
// 第二个标签页的内容
```

::
````

- slot 标题为 `#` 开头的一行；**必须以 ASCII 字母开头**（`#C++` 可以，`#中文标题` 会导致 remark-mdc 解析失败）。
- slot 之间以空行分隔，结束处单独一行 `::`。
- 默认激活第一个标签页。

## 5. 数学公式（KaTeX）

- 行内：`$E = mc^2$`
- 块级：

```md
$$
U_{\text{RMS}} = \sum_{i=1}^{n} \frac{C_i}{T_i}
$$
```

- 必须使用 `$...$` / `$$...$$` 定界符；`\(...\)` 不会被解析。

## 6. 代码块（Shiki）

- 支持的语言以 `nuxt.config.ts` 的 `content.build.markdown.highlight.langs` 为准（含 `bash`、`c`、`cpp`、`java`、`python`、`rust`、`ts`、`vue`、`yaml`、`diff`、`mermaid` 等）。
- **行号**：默认显示；`diff` 语言、或文件名/类名 meta 含 `no-lines` 时不显示（如 `` ```js no-lines ``）。
- **行高亮**：`// [!code highlight]`、`// [!code highlight:3]`（连续 3 行），或 meta 指定行号 `` ```ts {1,3-4} ``。
- **聚焦行**：`// [!code focus]` —— 非聚焦行会模糊降透明，鼠标悬停时恢复。
- **诊断色**：`// [!code error]` 红色、`// [!code warning]` 黄色。
- **diff**：使用 `diff` 语言，`+` 行绿色 / `-` 行红色，带符号与竖条。
- **Mermaid**：`` ```mermaid `` 代码块由 `ProsePre` 拦截并交给 `Mermaid` 组件渲染为 SVG（亮黄色赛博朋克主题）；渲染失败时自动回退显示源码。

## 7. HTML 与其它

- 支持原生 HTML：`<u>` 下划线、`<mark>` 高亮、`<kbd>` 按键、`<sup>/<sub>` 上下标等。
- 宽表格由 `ProseTable` 的外层滚动容器承载，无需手动处理横向溢出。
- 正文长 URL 依赖容器的 `overflow-wrap: break-word` 保护，不要用强制不断行的写法。
