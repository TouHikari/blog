<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { SITE_BIRTHDAY } from '#imports';

const siteRuntimeDisplay = ref<string>('');
const isPulse = ref(false);
let intervalId: NodeJS.Timeout | null = null;

async function updateSiteRuntime() {
  const siteBirthday = new Date(SITE_BIRTHDAY);
  const now = new Date();
  let timeDiff = now.getTime() - siteBirthday.getTime();

  // 重置并触发动画
  isPulse.value = false;
  setTimeout(() => {
    isPulse.value = true;
  }, 50);

  if (isNaN(timeDiff) || timeDiff < 0) {
    siteRuntimeDisplay.value = "TouHikari [STATUS:ONLINE] System clock anomaly detected. Awaiting synchronization...";
    return;
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  timeDiff -= days * (1000 * 60 * 60 * 24);

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  timeDiff -= hours * (1000 * 60 * 60);

  const minutes = Math.floor(timeDiff / (1000 * 60));
  timeDiff -= minutes * (1000 * 60);

  const seconds = Math.floor(timeDiff / 1000);

  // Format: %dd %hh:%mm:%ss
  const runtimeString = `${days}d ${String(hours).padStart(2, '0')}h:${String(minutes).padStart(2, '0')}m:${String(seconds).padStart(2, '0')}s`;

  siteRuntimeDisplay.value = `${runtimeString}`;
}

onMounted(() => {
  // 立即更新一次
  updateSiteRuntime();
  // 每秒更新一次
  intervalId = setInterval(updateSiteRuntime, 1000);
});

onUnmounted(() => {
  // 清理定时器
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <div class="footer-container">
    <p class="greetings">
      <strong class="greetings-strong">----- W E L L C O M E -----</strong>
    </p>
    <div class="info" data-lock-container>
      <div class="copyright" data-lock-marked>© 2026 TouHikari's Blog</div>
      <div class="driver" data-lock-marked>Powered by <a class="nust-link" href="https://nuxt.com/" target="_blank">Nuxt 4</a>.</div>
    </div>
    <div id="site-runtime-display" :class="{ 'runtime-pulse': isPulse }">
      <p class="runtime-container">
        <span class="runtime-prefix">TouHikari [STATUS:ONLINE] LOGGED_IN_FOR: </span>
        <ClientOnly>
          <span class="runtime">{{ siteRuntimeDisplay }}</span>
        </ClientOnly>
      </p>
    </div>
    <div class="beian" data-lock-marked>
      <a class="beian-link" href="https://beian.miit.gov.cn/" target="_blank">陕ICP备2025068002号</a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/styles/fonts' as *;
@use '~/styles/variables' as *;
@use '~/styles/terminal-glow' as *;

.footer-container {
  display: flex;
  flex-direction: column;
  text-align: center;
  font-family: $font-cyber;
  margin: 30px 0 30px 0;
  user-select: none;
}

.greetings {
  color: $cyberpunk-light-yellow;
  cursor: default;
  position: relative;
  z-index: 0;
  padding: 5px 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    animation: yellow-breathing 2s infinite ease-in-out;
    opacity: 0;
    transition: opacity 0.5s ease;
    z-index: -1;
  }

  &:hover::before {
    opacity: 1;
  }

  .greetings-strong {
    position: relative;
    z-index: 1;
    transition: all 0.1s ease-in-out;

    &:hover {
      text-shadow:
        0 0 5px currentcolor,
        0 0 21px currentcolor;
      @include flicker-effect();
    }
  }
}

.info {
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-bottom: 20px;
}

#site-runtime-display {
  font-family: $font-mono;
  color: $cyberpunk-light-yellow;
  position: relative;
  background: transparent;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, $cyberpunk-background-pink, transparent);
    opacity: 0;
    pointer-events: none;
    z-index: 0;
  }

  &.runtime-pulse::before {
    content: '';
    animation: flash-fade 1s ease-out forwards;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -50%;
    width: 50%;
    height: 100%;
    background: linear-gradient(to right, transparent, $cyberpunk-pink, transparent);
    opacity: 0.3;
    transform: skewX(-20deg);
    pointer-events: none;
    z-index: 1;
    // opacity: 0;
  }

  &.runtime-pulse::after {
    animation: scan-slide 0.1s ease-out forwards;
  }

  .runtime-container {
    position: relative;
    z-index: 2;
    display: inline-block;
    margin: 0;
    padding: 2.5px 15px;
  }

  .runtime {
    white-space: nowrap;
  }
}

@keyframes flash-fade {
  0% {
    opacity: 1;
    box-shadow: 0 0 15px rgba($cyberpunk-background-pink, 0.1);
  }

  100% {
    opacity: 0;
    box-shadow: none;
  }
}

@keyframes scan-slide {
  0% {
    left: -50%;
    opacity: 0;
  }

  20% {
    opacity: 0.5;
  }

  100% {
    left: 100%;
    opacity: 0;
  }
}

.beian {
  margin-top: 20px;
}

@keyframes yellow-breathing {

  0%,
  100% {
    background-color: rgba($cyberpunk-yellow, 0);
    box-shadow: 0 0 5px rgba($cyberpunk-yellow, 0);
  }

  50% {
    background-color: rgba($cyberpunk-yellow, 0.1);
    box-shadow: 0 0 15px rgba($cyberpunk-yellow, 0.1);
  }
}

@media (max-width: #{$breakpoint-mobile - 1px}) {
  #site-runtime-display {
    display: flex;
    flex-direction: column;
    align-items: center;
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
