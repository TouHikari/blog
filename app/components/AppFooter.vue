<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const siteRuntimeDisplay = ref<string>('')
let intervalId: NodeJS.Timeout | null = null

function updateSiteRuntime() {
  const siteBirthday = new Date("2025-05-02T01:37:13")
  const now = new Date()
  let timeDiff = now.getTime() - siteBirthday.getTime()

  // Handle potential invalid date or future date
  if (isNaN(timeDiff) || timeDiff < 0) {
    siteRuntimeDisplay.value = "TouHikari [STATUS:ONLINE] System clock anomaly detected. Awaiting synchronization..."
    return
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  timeDiff -= days * (1000 * 60 * 60 * 24)

  const hours = Math.floor(timeDiff / (1000 * 60 * 60))
  timeDiff -= hours * (1000 * 60 * 60)

  const minutes = Math.floor(timeDiff / (1000 * 60))
  timeDiff -= minutes * (1000 * 60)

  const seconds = Math.floor(timeDiff / 1000)

  // Format: %dd %hh:%mm:%ss
  const runtimeString = `${days}d ${String(hours).padStart(2, '0')}h:${String(minutes).padStart(2, '0')}m:${String(seconds).padStart(2, '0')}s`

  siteRuntimeDisplay.value = `${runtimeString}`
}

onMounted(() => {
  // 立即更新一次
  updateSiteRuntime()
  // 每秒更新一次
  intervalId = setInterval(updateSiteRuntime, 1000)
})

onUnmounted(() => {
  // 清理定时器
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <div class="footer-container">
    <p class="greetings"><strong class="greetings-strong">----- W E L L C O M E -----</strong></p>
    <div class="info">
      <div class="copyright">© 2025 TouHikari's Blog</div>
      <div class="driver">Powered by <a class="nust-link" href="https://nuxt.com/" target="_blank">Nuxt 4</a>.</div>
    </div>
    <div id="site-runtime-display">
      <p class="runtime-container">
        <span class="runtime-prefix">TouHikari [STATUS:ONLINE] LOGGED_IN_FOR: </span>
        <ClientOnly>
          <span class="runtime">{{ siteRuntimeDisplay }}</span>
        </ClientOnly>
      </p>
    </div>
    <div class="beian">
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
}

.greetings {
  color: $cyberpunk-light-yellow;
  cursor: default;

  .greetings-strong {
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
}

#site-runtime-display {
  font-family: $font-mono;
  color: $cyberpunk-light-yellow;
  min-height: 30px;

  .runtime-container {
    display: inline-block;
    background: linear-gradient(to right, $bg-tertiary, black);
    padding: 2.5px 15px;
  }

  .runtime {
    white-space: nowrap;
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
