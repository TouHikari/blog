---
title: Markdown 语法全量测试指南
draft: true
date: 2026-02-19
tags:
  - markdown
  - test
  - syntax
description: 本文旨在全面测试博客系统的 Markdown 渲染能力，涵盖标准语法、GFM 扩展、代码高亮、数学公式及特殊组件。
toc: true
---

# 一级标题 H1

## 二级标题 H2

### 三级标题 H3

#### 四级标题 H4

##### 五级标题 H5

###### 六级标题 H6

---

## 文本格式 (Text Formatting)

**粗体文本 (Bold)** 或 **粗体文本**

_斜体文本 (Italic)_ 或 _斜体文本_

**_粗斜体文本 (Bold Italic)_**

~~删除线文本 (Strikethrough)~~

`行内代码 (Inline Code)`

<u>下划线 (Underline)</u> (HTML 标签)

<mark>高亮文本 (Highlight)</mark> (HTML 标签)

上标: X<sup>2</sup>

下标: H<sub>2</sub>O

按键: <kbd>Ctrl</kbd> + <kbd>C</kbd>

---

## 列表 (Lists)

### 无序列表

- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2
    - 子子项目 2.2.1

* 项目 3 (使用减号)

- 项目 4 (使用加号)

### 有序列表

1. 第一项
2. 第二项
3. 第三项
   1. 子项 3.1
   2. 子项 3.2

### 任务列表 (Task Lists)

- [ ] 待办任务 1
- [x] 已完成任务 2
- [ ] 待办任务 3
  - [x] 子任务 3.1
  - [ ] 子任务 3.2

---

## 引用 (Blockquotes)

> 这是一个块引用。
> 它可以跨越多行。
>
> > 这是一个嵌套的引用。
> > 回到第二层。
>
> 回到第一层。

引用中包含其他元素：

> - 列表项
> - **粗体**
> - `代码`

---

## 链接与图片 (Links & Images)

[普通链接 (Google)](https://www.google.com)

[带标题的链接](https://www.google.com "Google 首页")

[引用式链接][ref-link]

![图片 Alt 文本](https://placehold.co/600x200/000000/FFF?text=Markdown+Image "图片标题")

[![带链接的图片](https://placehold.co/600x200/007bff/FFF?text=Image+Link)](https://github.com)

[ref-link]: https://github.com "GitHub"

---

## 代码块 (Code Blocks)

### JavaScript

```javascript
function helloWorld() {
  console.log("Hello, World!");
  const a = 1;
  const b = 2;
  return a + b;
}
helloWorld();
```

### Python

```python
def fibonacci(n):
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
```

### CSS

```css
body {
  background-color: #f0f0f0;
  font-family: "Arial", sans-serif;
}
.container {
  display: flex;
  justify-content: center;
}
```

### HTML

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

### Diff (差异对比)

```diff
- const oldVersion = 1.0;
+ const newVersion = 2.0;
  console.log("Version updated");
```

### 无语言标记

```
This is a plain text block.
No highlighting here.
```

---

## 表格 (Tables)

| 左对齐   | 居中对齐 |    右对齐 |
| :------- | :------: | --------: |
| 单元格 1 | 单元格 2 |  单元格 3 |
| 文本     |   文本   |      文本 |
| `Code`   | **Bold** | [Link](#) |

---

## 数学公式 (Mathematics)

如果启用了 `remark-math` 和 `rehype-katex`，以下公式应能正确渲染。

行内公式: 质能方程 $E = mc^2$ 是最著名的物理公式之一。

块级公式:

$$
\sum_{i=1}^n i = \frac{n(n+1)}{2}
$$

矩阵:

$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
$$

---

## 脚注 (Footnotes)

这里有一个脚注引用[^1]。

这里有另一个脚注引用[^longnote]。

[^1]: 這是第一个脚注的定义。

[^longnote]: 这是一个较长的脚注，它可以包含多行文本。

    甚至可以包含代码块：
    `console.log("Footnote code");`

---

## HTML 元素混合

<details>
<summary>点击展开/折叠详情 (Details/Summary)</summary>

这里是隐藏的内容。

可以包含 **Markdown** 语法。

- 列表
- `代码`

</details>

<br>

Ruby 标签 (注音):

<ruby>
漢 <rp>(</rp><rt>Kan</rt><rp>)</rp>
字 <rp>(</rp><rt>ji</rt><rp>)</rp>
</ruby>

---

## Nuxt Content 组件 (MDC Syntax)

如果项目配置了相关组件，这些将被渲染为特殊组件。

### Alert / Callout (如果是标准 MDC)

::alert{type="info"}
这是一条信息提示。
::

::alert{type="warning"}
这是一条警告信息。
::

::alert{type="danger"}
这是一条危险警告。
::

### 自定义容器 (如果是 GitHub 风格)

> [!NOTE]
> 这是一个 Note 提示块。

> [!TIP]
> 这是一个 Tip 提示块。

> [!WARNING]
> 这是一个 Warning 提示块。

> [!IMPORTANT]
> 这是一个 Important 提示块。

---

## 特殊符号转义

\*星号\*

\_下划线\_

\[方括号\]

\`反引号\`

\# 井号

---

## 结尾

End of Test Suite.
