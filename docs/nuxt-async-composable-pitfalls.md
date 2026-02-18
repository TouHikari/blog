# Nuxt 4 异步 Composable 与上下文丢失问题总结

## 问题描述

在 Nuxt 4 开发中，如果自定义 Composable 函数被定义为 `async` 函数，并在其中使用了 `await` 等待异步操作（如 `useAsyncData`），可能会导致 Nuxt 上下文（Context）丢失。

尽管 Nuxt 4 在核心架构上进行了升级，但组合式函数（Composables）依赖于 Vue 的 `setup` 上下文和 Nuxt 的实例上下文这一基本机制依然适用。

### 典型错误场景

```typescript
// ❌ 错误示范：Async Composable
export const useArticle = async () => {
  const route = useRoute();

  // 这里的 await 会导致后续代码执行时丢失 Nuxt 实例上下文
  const { data } = await useAsyncData(route.path, async () => {
    // ...
  });

  // 💥 报错：useSeoMeta 依赖 Nuxt 上下文，此时已丢失
  useSeoMeta({
    title: "My Title",
  });

  // 💥 报错：useState 也依赖上下文
  const state = useState("my-state");
};
```

### 症状

- `npm run generate` (预渲染) 失败，报错 500 Server Error。
- 运行时报错 "Nuxt instance is unavailable"。
- `useSeoMeta`、`useState`、`useHead` 等组合式函数失效或抛出异常。
- 组件在 Layout 中无法正常渲染（因为 Top-level await 导致组件变成异步组件，需要 Suspense 支持，而 Layout 处理异步组件可能存在限制）。

## 解决方案

### 1. 将 Composable 改为同步函数

不要将 Composable 定义为 `async`。`useAsyncData` 和 `useFetch` 本身就是设计为在 `setup` 中同步调用的（它们返回 Promise，但同时也返回响应式的 `data`、`pending` 等状态）。

### 2. 利用响应式系统

利用 Vue 的响应式特性（Ref/Computed/Watch）来处理数据加载后的逻辑，而不是依赖 `await` 顺序执行。

```typescript
// ✅ 正确示范：同步 Composable
export const useArticle = () => {
  const route = useRoute();

  // 1. 同步调用 useAsyncData，不要加 await
  // useAsyncData 会在后台处理异步请求，Nuxt 服务端渲染时会自动等待它完成（只要它在 setup 期间被注册）
  const { data: article, error } = useAsyncData(route.path, async () => {
    // ... 数据获取逻辑 ...
  });

  // 2. 使用 Getter 函数传递给 useSeoMeta
  // 这样即使 data 还没回来，useSeoMeta 也能注册，并在 data 更新时自动刷新
  useSeoMeta({
    title: () => article.value?.title || "Default Title",
    description: () => article.value?.description || "Default Description",
  });

  // 3. 使用 watch 处理副作用
  // 当数据加载完成，article 更新时，执行相关逻辑
  watch(
    () => article.value?.title,
    (newTitle) => {
      if (newTitle) {
        // update state
      }
    },
  );

  return {
    article,
  };
};
```

### 3. 组件中使用

在组件中调用 Composable 时，也不需要 `await`。

```vue
<script setup lang="ts">
// ✅ 不需要 await
const { article } = useArticle();
</script>

<template>
  <div v-if="article">
    <h1>{{ article.title }}</h1>
  </div>
</template>
```

## 特别注意：组件中的 Top-level Await

如果在组件 `script setup` 中使用了 `await`（例如 `await useBlog()`），该组件会变成**异步组件**。

- 异步组件需要父级提供 `<Suspense>` 边界才能正常渲染。
- 如果在 Layout 中直接使用异步组件，可能会导致渲染问题（如空白、加载状态卡死），因为 Layout 本身可能没有被 Suspense 包裹或处理机制不同。
- **最佳实践**：尽量避免在组件顶层使用 `await`，除非你明确知道你在做什么并且有 Suspense 边界。优先使用 Nuxt 提供的 `useAsyncData`/`useFetch` 的非阻塞模式或响应式模式。
