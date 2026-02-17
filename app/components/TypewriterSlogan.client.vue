<template>
  <p class="slogan">
    <span style="color: cyan;">touhikari</span><span style="color: gray;">@</span><span
      style="color: yellow;">localhost</span><span style="color: white;">:~$ </span>
    <span class="slogan-text">
      {{ currentText }}<span class="cursor">_</span>
    </span>
  </p>
</template>

<script setup lang="ts">
const { currentText } = useTypewriter()
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

  .cursor {
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
