<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

// 使用全局标题状态
const { title: pageTitle } = usePageTitle()

// 打字效果相关
const titleElement = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)
const cursorRef = ref<HTMLElement | null>(null)
let isTypingComplete = false
let typingTimer: ReturnType<typeof setTimeout> | null = null
const typingSpeed = 40 // 打字速度 (ms)

// 清理定时器函数
function clearTypingTimer() {
  if (typingTimer) {
    clearTimeout(typingTimer)
    typingTimer = null
  }
}

// 一次性打字效果函数
function typeWriter(text: string, charIndex: number = 0) {
  if (!textRef.value || isTypingComplete) return

  if (charIndex < text.length) {
    textRef.value.textContent = text.substring(0, charIndex + 1)

    typingTimer = setTimeout(() => {
      typeWriter(text, charIndex + 1)
    }, typingSpeed)
  } else {
    textRef.value.textContent = text
    isTypingComplete = true
  }
}

// 用完整文本的实测高度设置 min-height，预留空间防止打字过程布局跳动（测量时隐藏光标避免临界换行）
async function setupAndStartTypewriter(title: string) {
  if (!titleElement.value || !textRef.value) return

  const el = titleElement.value

  el.style.visibility = 'hidden'
  el.style.minHeight = '0'
  if (cursorRef.value) cursorRef.value.style.display = 'none'
  textRef.value.textContent = title

  await nextTick()

  const finalHeight = el.scrollHeight
  el.style.minHeight = `${finalHeight + 1}px`

  if (cursorRef.value) cursorRef.value.style.display = ''
  el.style.visibility = 'visible'
  textRef.value.textContent = ''

  clearTypingTimer()
  isTypingComplete = false

  typingTimer = setTimeout(() => {
    typeWriter(title)
  }, 100)
}

// 监听标题变化，重新开始打字效果
watch(pageTitle, (newTitle) => {
  if (newTitle) {
    setupAndStartTypewriter(newTitle)
  }
}, { immediate: false })

// 组件挂载后开始打字效果
onMounted(async () => {
  await nextTick()
  if (pageTitle.value) {
    setupAndStartTypewriter(pageTitle.value)
  }
})

// 组件卸载时清理定时器
onUnmounted(() => {
  clearTypingTimer()
})

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <div class="blog-title-container">
    <h1 ref="titleElement" class="title">
      <span ref="textRef" class="title-text" /><span ref="cursorRef" class="cursor">|</span>
    </h1>
    <hr>
    <div class="slogan-container">
      <Icon v-if="isMounted" name="mdi:heart" class="heart-icon" />
      <TypewriterSlogan />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/styles/variables' as *;
@use '~/styles/font-stacks' as *;
@use '~/styles/terminal-glow' as *;

.blog-title-container {
  margin-top: 50px;
  width: 100%;
}

.title {
  font-family: $font-cyber;
  font-size: 2rem;
  min-height: 54.39px;
  cursor: default;
  user-select: none;
}

.slogan-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  min-height: 60px;
  gap: 8px;
  margin-top: 10px;

  @include glow-text-sm-1();
}

.heart-icon {
  color: #ff0000;
  font-size: 1.2em;
  min-width: 1.2em;
  margin-top: 6px;
  animation: heartbeat 2s ease-in-out infinite;
  filter: drop-shadow(0 0 5px #ff0000);
  transition: all 0.3s ease;
}

@keyframes heartbeat {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.cursor {
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
  .blog-title-container {
    text-align: center;
  }

  .slogan-container {
    min-height: 60px;
  }

  @media (max-width: 540px) {
    .slogan-container {
      min-height: 85px;
    }
  }

  @media (max-width: 380px) {
    .slogan-container {
      min-height: 110px;
    }
  }
}
</style>
