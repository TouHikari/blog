---
title: "VuePress 风格的 Markdown 功能演示"
description: "展示如何在 Nuxt Content 中使用 VuePress 风格的 Markdown 扩展功能"
date: "2025-01-12"
tags: ["markdown", "vuepress", "nuxt-content"]
---

# VuePress 风格的 Markdown 功能演示

这篇文章展示了如何在 Nuxt Content 中实现 VuePress 风格的 Markdown 扩展功能。

## 代码块功能

### 1. 基础语法高亮

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`
}
```

### 2. 行高亮

```typescript {2,4-6}
function calculateSum(numbers: number[]): number {
  let sum = 0; // 这行会被高亮
  
  for (const num of numbers) { // 这行会被高亮
    sum += num; // 这行会被高亮
  } // 这行会被高亮
  
  return sum;
}
```

### 3. 代码块标题

```typescript title="utils/math.ts"
export function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

### 4. 行号显示

```javascript showLineNumbers
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];

function findUserById(id) {
  return users.find(user => user.id === id);
}
```

### 5. 差异显示

```diff
function oldFunction() {
- console.log('This is old');
+ console.log('This is new');
  return true;
}
```

## Vue 组件支持

你可以在 Markdown 中直接使用 Vue 组件：

<div class="bg-blue-100 p-4 rounded">
  这是一个自定义的提示框
</div>

## 表格

| 功能 | VuePress | Nuxt Content | 状态 |
|------|----------|--------------|------|
| 语法高亮 | ✅ | ✅ | 完全支持 |
| 行高亮 | ✅ | ✅ | 完全支持 |
| 代码标题 | ✅ | 🔄 | 部分支持 |
| 行号 | ✅ | 🔄 | 配置中 |
| Vue 组件 | ✅ | ✅ | 完全支持 |

## 数学公式

当你需要显示数学公式时：

$$
E = mc^2
$$

行内公式：$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$

## 提示框

::: tip 提示
这是一个提示信息
:::

::: warning 警告
这是一个警告信息
:::

::: danger 危险
这是一个危险信息
:::

## 总结

通过配置 Nuxt Content 和 Shiki，我们可以实现大部分 VuePress 的 Markdown 扩展功能。虽然某些功能需要额外的配置，但整体体验已经非常接近 VuePress 了。
