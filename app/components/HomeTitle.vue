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

.slogan-container {
  display: flex;
  flex-direction: row;
  min-height: 60px;

  @include glow-text-sm-1();
}
</style>