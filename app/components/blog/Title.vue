<script setup lang="ts">
// 获取当前路由
const route = useRoute()


// 博客文章标题数据
const blogArticle = ref<any | null>(null)

// 监听路由变化，若为博客文章则拉取对应标题
watch(
  () => route.path,
  async (newPath) => {
    if (newPath.startsWith('/blog/')) {
      const slug = newPath.replace(/^\/blog\//, '').replace(/\/$/, '')
      const { data } = await useAsyncData(`blog-${slug}`, async () => {
        return await queryCollection('blog').path(`/blog/${slug}`).first()
      })
      blogArticle.value = data.value
    } else {
      blogArticle.value = null
    }
  },
  { immediate: true }
)

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
    // 优先显示内容集合里的标题，其次 fallback 到路径片段
    if (blogArticle.value?.title) return blogArticle.value.title
    const slugPart = path.split('/').filter(Boolean).slice(1).join('/');
    return decodeURIComponent(slugPart || 'Blog Post')
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
