<template>
  <p class="slogan">
    <span class="brand">touhikari</span><span class="at">@</span><span
      class="host">localhost</span><span class="path">:~$ </span>
    <span class="slogan-text">
      {{ currentText }}<span class="cursor">_</span>
    </span>
  </p>
</template>

<script setup lang="ts">
const { currentText } = useTypewriter()
</script>

<style lang="scss" scoped>
@use '~/styles/font-stacks' as *;
@use '~/styles/variables' as *;

.slogan {
  font-family: $font-mono;
  text-align: left;
  color: $cyberpunk-pink;
  margin: 0;
  user-select: none;
}

.brand {
  color: $cyberpunk-cyan;
}

.at {
  color: $gray-500;
}

.host {
  color: $cyberpunk-light-yellow;
}

.path {
  color: $white;
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
