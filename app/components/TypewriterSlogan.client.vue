<template>
  <p class="slogan">
    <span style="color: cyan;">touhikari</span><span style="color: gray;">@</span><span
      style="color: yellow;">localhost</span><span style="color: white;">:~$ </span>
    <span ref="sloganElement" class="slogan-text">_</span>
  </p>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const sloganElement = ref<HTMLElement | null>(null)

onMounted(async () => {
  // 等待下一个tick确保DOM已经完全渲染
  await nextTick()
  
  // 确保元素存在再开始动画
  if (!sloganElement.value) return

  const allSlogans: string[] = [
    "Executing life script...",
    "Penetrating the reality matrix",
    "[ Status: Online & Dangerous ]",
    "cat /dev/thoughts > /blog",
    "Loading core modules... TouHikari initialized.",
    "Echoes from the digital void.",
    "Where shadows dance with data streams.",
    "Your reality is negotiable.",
    "Beyond the firewall consciousness.",
    "A glitch in the system you call 'normal'.",
    "chmod +x my_destiny",
    "while(alive) { learn(); hack(); repeat(); }",
    "Error 404: Sleep not found.",
    "Reality is just a poorly coded simulation.",
    "sudo make me a sandwich.",
    "There is no place like ::1",
    "Seek truth in the noise.",
    "Information yearns to be free.",
    "Born to root.",
    "Beyond the event horizon.",
    "The console is my sanctuary.",
    "Weaving light through the dark web.",
    "Finding the signal, being the HIKARI.",
    "Illuminating the path less traveled.",
    "Existence is pain... for a poorly configured server.",
    "Get Schwifty. (Then debug it.)",
    "Nobody exists on purpose. Nobody belongs anywhere. We're all just code."
  ]

  let availableSlogans: string[] = [] // 当前可用的、未播放的 Slogan 列表
  let currentSloganText = '' // 当前正在处理的 Slogan 文本
  let charIndex = 0   // 当前处理到的字符索引
  let isDeleting = false // 是否正在删除
  const typingSpeed = 70 // 打字速度 (ms)
  const deletingSpeed = 35 // 删除速度 (ms)
  const delayBeforeDeleting = 1500 // 打完字后停留多久开始删除 (ms)
  const delayBeforeTypingNew = 500 // 删除完后停留多久开始打新字 (ms)

  // --- 新增：填充或重置可用 Slogan 列表 ---
  function refillAvailableSlogans() {
    // 将 allSlogans 的内容复制到 availableSlogans
    availableSlogans = [...allSlogans] // 使用扩展运算符创建副本
  }

  // --- 新增：从可用列表中随机选择并移除一个 Slogan ---
  function getNextSlogan(): string {
    if (availableSlogans.length === 0) {
      refillAvailableSlogans() // 如果列表空了，重新填满
    }
    // 随机选择一个索引
    const randomIndex = Math.floor(Math.random() * availableSlogans.length)
    // 从列表中取出该 Slogan 并从列表中移除
    const chosenSlogan = availableSlogans.splice(randomIndex, 1)[0]!
    return chosenSlogan
  }

  function typeWriter() {
    if (!sloganElement.value) return

    let textToShow = ''

    if (isDeleting) {
      // 删除状态
      textToShow = currentSloganText.substring(0, charIndex - 1)
      charIndex--
    } else {
      // 打字状态
      textToShow = currentSloganText.substring(0, charIndex + 1)
      charIndex++
    }

    // 添加光标效果
    sloganElement.value.innerHTML = textToShow + '<span class="cursor">_</span>'

    let delay = typingSpeed

    if (isDeleting) {
      delay = deletingSpeed
    }

    if (!isDeleting && charIndex === currentSloganText.length) {
      // 打字完成
      delay = delayBeforeDeleting
      isDeleting = true
    } else if (isDeleting && charIndex === 0) {
      // 删除完成
      isDeleting = false
      // --- 修改：获取下一个不重复的 Slogan ---
      currentSloganText = getNextSlogan()
      delay = delayBeforeTypingNew
    }

    setTimeout(typeWriter, delay)
  }

  // --- 启动打字机效果 ---
  // 1. 先填充列表
  refillAvailableSlogans()
  // 2. 获取第一个随机 Slogan
  currentSloganText = getNextSlogan()
  // 3. 初始延迟后开始打印第一个 Slogan
  setTimeout(typeWriter, delayBeforeTypingNew)
})
</script>

<style lang="scss" scoped>
@use '~/styles/fonts' as *;
@use '~/styles/variables' as *;

.slogan {
  font-family: $font-mono;
  text-align: left;
  color: $cyberpunk-pink;
  margin: 0;
}

.slogan-text {
  color: $cyberpunk-pink;

  :deep(.cursor) {
    animation: blink 1s infinite;
    color: $cyberpunk-pink;
  }
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
</style>
