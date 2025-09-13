<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'

// 获取当前路由
const route = useRoute()

// 打字效果相关
const titleElement = ref<HTMLElement | null>(null)
let isTypingComplete = false
let typingTimer: NodeJS.Timeout | null = null
const typingSpeed = 40 // 打字速度 (ms)

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
    '/categories': '[:METADATA_INDEX]',
    '/tags': '[TAG_CLOUD]'
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

// 清理定时器函数
function clearTypingTimer() {
  if (typingTimer) {
    clearTimeout(typingTimer)
    typingTimer = null
  }
}

// 一次性打字效果函数
function typeWriter(text: string, charIndex: number = 0) {
  if (!titleElement.value || isTypingComplete) return

  if (charIndex < text.length) {
    // 打字状态
    const textToShow = text.substring(0, charIndex + 1)
    titleElement.value.innerHTML = textToShow + '<span class="cursor">|</span>'

    typingTimer = setTimeout(() => {
      typeWriter(text, charIndex + 1)
    }, typingSpeed)
  } else {
    // 打字完成，保持光标闪烁
    titleElement.value.innerHTML = text + '<span class="cursor"> |</span>'
    isTypingComplete = true
  }
}

// 监听标题变化，重新开始打字效果
watch(pageTitle, async (newTitle) => {
  if (!titleElement.value) return

  // 清理旧的定时器
  clearTypingTimer()

  // 重置状态
  isTypingComplete = false
  titleElement.value.innerHTML = ''

  // 等待下一个tick后开始打字
  await nextTick()
  typingTimer = setTimeout(() => {
    typeWriter(newTitle)
  }, 100)
}, { immediate: false })

// 组件挂载后开始打字效果
onMounted(async () => {
  await nextTick()

  if (titleElement.value && pageTitle.value) {
    typingTimer = setTimeout(() => {
      typeWriter(pageTitle.value)
    }, 100)
  }
})

// 组件卸载时清理定时器
onUnmounted(() => {
  clearTypingTimer()
})
</script>

<template>
  <div class="title-container">
    <h1 ref="titleElement" class="title"></h1>
    <hr />
  </div>
</template>

<style lang="scss" scoped>
.title-container {
  margin-top: 50px;
}

.title {
  font-size: 2rem;
  min-height: 54.39px;
  cursor: default;
  user-select: none;
}

:deep(.cursor) {
  animation: blink 1s infinite;
}

@keyframes blink {

  0%,
  50% {
    opacity: 1;
  }

  51%,
  100% {
    opacity: 0;
  }
}

@media (max-width: #{$breakpoint-mobile - 1px}) {
  .title-container {
    text-align: center;
  }
}

@media (min-width: #{$breakpoint-mobile}) and (max-width: #{$breakpoint-tablet - 1px}) {
  //
}

@media (min-width: #{$breakpoint-tablet}) and (max-width: #{$breakpoint-desktop - 1px}) {
  //
}

@media (min-width: #{$breakpoint-desktop}) and (max-width: #{$breakpoint-desktop-lg - 1px}) {
  //
}

@media (min-width: #{$breakpoint-desktop-lg}) {
  //
}
</style>
