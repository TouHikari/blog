<template>
  <div class="title-container">
    <h1 class="title bootup">Where shadows dance with data streams.<span class="blink-fast"> |</span></h1>
    <hr />
    <div class="slogan-container">
      <img></img>
      <TypewriterSlogan />
    </div>
  </div>
</template>

<script setup lang="ts">
// 打字机效果由 TypewriterSlogan.client.vue 处理
</script>

<style lang="scss" scoped>
@use '~/styles/terminal-glow' as *;

.title-container {
  margin-top: 50px;
  cursor: default;
  user-select: none;
}

.blink-fast {
  animation: blink 1s infinite;
}

.bootup {
  animation: bootup 2s ease;
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
  min-height: 60px;

  @include glow-text-sm-1();
}
</style>