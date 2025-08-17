<template>
  <div class="title-container">
    <h1 class="title">Where shadows dance with data streams.<span class="blink-fast"> |</span></h1>
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

.slogan-container {
  display: flex;
  flex-direction: row;
  min-height: 60px;

  @include glow-text-sm-1();
}
</style>