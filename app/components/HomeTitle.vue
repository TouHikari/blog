<template>
  <div class="home-title-container">
    <div class="title-container">
      <h1 :class="['title', { 'bootup': isMounted }]">Where shadows dance with data streams.
        <span class="blink-fast"> |</span>
      </h1>
    </div>
    <hr>
    <div class="slogan-container">
      <Icon v-if="isMounted" name="mdi:heart" class="heart-icon" />
      <TypewriterSlogan />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 确保服务端和客户端渲染一致性
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})
</script>

<style lang="scss" scoped>
@use '~/styles/variables' as *;
@use '~/styles/fonts' as *;
@use '~/styles/terminal-glow' as *;

.home-title-container {
  font-family: $font-cyber;
  margin: 50px 0 0 0;
  width: 100%;
  cursor: default;
  user-select: none;
}

.title {
  text-wrap: balance;
  opacity: 0.1;
  padding-bottom: 1px;
}

.blink-fast {
  animation: blink 1s infinite;
}

.bootup {
  animation: bootup 2s ease forwards;
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

@keyframes bootup {

  0%,
  10% {
    opacity: 0;
  }

  11%,
  30% {
    opacity: 0.1;
  }

  31%,
  35% {
    opacity: 0.6;
  }

  36%,
  45% {
    opacity: 0.1;
  }

  46%,
  50% {
    opacity: 0.2;
  }

  51%,
  60% {
    opacity: 0;
  }

  61%,
  80% {
    opacity: 0.2;
  }

  81%,
  90% {
    opacity: 0.9;
  }

  91% {
    opacity: 0.91;
  }

  92% {
    opacity: 0.92;
  }

  93% {
    opacity: 0.93;
  }

  94% {
    opacity: 0.94;
  }

  95% {
    opacity: 0.95;
  }

  96% {
    opacity: 0.96;
  }

  97% {
    opacity: 0.97;
  }

  98% {
    opacity: 0.98;
  }

  99% {
    opacity: 0.99;
  }

  100% {
    opacity: 1;
  }
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
  @include glow-text-sm-1();
  animation: heartbeat 2s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(255, 71, 87, 0.6));
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

@media (max-width: #{$breakpoint-mobile - 1px}) {
  .title-container {
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