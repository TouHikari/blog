<script setup lang="ts">
// 获取当前路由
const route = useRoute()

// 动态标题，根据路由直接生成
const pageTitle = computed(() => {
  const path = route.path

  // 特殊路径的标题映射
  const titleMap: Record<string, string> = {
    '/': 'Home',
    '/about': '[:INIT_USER/TouHikari]',
    '/blog': '[SYS_ARCHIVES]',
    '/categories': '[TAG_CLOUD]',
    '/tags': '[:METADATA_INDEX]'
  }

  // 如果有直接映射，使用映射的标题
  if (titleMap[path]) {
    return titleMap[path]
  }

  // 对于博客文章，尝试获取标题
  if (path.startsWith('/blog/')) {
    // 这里可以添加获取具体博客文章标题的逻辑
    return 'Blog Post'
  }

  // 默认标题
  return 'Page'
})
</script>

<template>
  <div class="title-container">
    <h1 class="title">{{ pageTitle }}<span class="blink-fast"> |</span></h1>
    <hr />
  </div>
</template>

<style lang="scss" scoped>
.title-container {
  margin-top: 50px;
}

.title {
  font-size: 2rem;
  margin-bottom: 10px;
}

.blink-fast {
  animation: blink-fast 1s ease-in-out infinite;
}

@keyframes blink-fast {
  0% {
    opacity: 1;
  }
  30% {
    opacity: 0.9;
  }
  50% {
    opacity: 0;
  }
  80% {
    opacity: 0.9;
  }
  100% {
    opacity: 1;
  }
}
</style>
