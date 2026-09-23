<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const route = useRoute()

// error.vue 渲染时 app.vue 被整体替换（nuxt-root 中两者互斥），其 titleTemplate 不生效，需自带完整标题
const statusCode = computed(() => Number(props.error?.statusCode || 500))
const isNotFound = computed(() => statusCode.value === 404)
const requestPath = computed(() => route.path)

const COPY = {
  notFound: {
    headline: '页面不存在。从未上线或已从索引中删除。',
    subline: '> No such file or directory.'
  },
  serverError: {
    headline: '内部故障。服务器未能给出回应。',
    subline: '> core dumped. Even ghosts have bad days.'
  }
}

const copy = computed(() => (isNotFound.value ? COPY.notFound : COPY.serverError))

useHead({
  title: () => `${statusCode.value} | TouHikari.top`,
  meta: [{ name: 'robots', content: 'noindex' }]
})

const handleRecover = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="error-page">
    <AppHeader />
    <main class="error-main">
      <div class="error-content">
        <section
          class="error-panel"
          data-lock-container
        >
          <p class="term-line">
            <span class="term-prompt"><span class="prompt-brand">touhikari</span><span class="prompt-at">@</span><span class="prompt-host">localhost</span><span class="prompt-path">:~$</span></span>
            <span class="term-command">GET {{ requestPath }}</span>
            <span class="cursor" aria-hidden="true">_</span>
          </p>
          <h1 class="headline">
            <span class="status-code">{{ statusCode }}</span>
            <span class="headline-text">{{ copy.headline }}</span>
          </h1>
          <p class="subline">{{ copy.subline }}</p>
          <button
            type="button"
            class="recover"
            data-lock-marked
            data-lock-bg="#00FFFF20"
            data-lock-border="1px solid #00FFFF40"
            @click="handleRecover"
          >
            <span class="recover-prompt" aria-hidden="true">$</span>
            <span>返回首页</span>
          </button>
        </section>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
@use '~/styles/variables' as *;
@use '~/styles/font-stacks' as *;
@use '~/styles/terminal-glow' as *;

.error-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
}

.error-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5rem 0 2rem;
}

.error-content {
  width: 100%;
  max-width: 720px;
  padding: 0 20px;
  margin: 0 auto;
}

.error-panel {
  padding: $spacing-3xl;
  border: 1px solid rgba($cyberpunk-blue, 0.4);
  background: $bg-tertiary;
  overflow-wrap: anywhere;
}

.term-line {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5ch;
  margin: 0;
  font-family: $font-mono;
  font-size: $font-size-small;
  line-height: $line-height-tight;
  color: $gray-500;

  .term-prompt {
    .prompt-brand {
      color: $cyberpunk-cyan;
    }

    .prompt-at {
      color: $gray-500;
    }

    .prompt-host {
      color: $cyberpunk-light-yellow;
    }

    .prompt-path {
      color: $white;
    }
  }

  .term-command {
    color: $cyberpunk-pink;
  }

  .cursor {
    color: $cyberpunk-pink;
    animation: blink 1s infinite;
  }
}

.headline {
  margin: $spacing-lg 0 0;
  // 覆盖全局 h1 的发光与闪烁，仅让状态码大字发光
  text-shadow: none;
  animation: none;
  text-align: center;

  .status-code {
    display: block;
    font-size: clamp(3.5rem, 18vw, 7rem);
    line-height: 1;
    letter-spacing: $letter-spacing-wider;
    color: $cyberpunk-light-yellow;
    @include glow-text-md-1();
  }

  .headline-text {
    display: block;
    margin-top: $spacing-lg;
    font-size: $font-size-base;
    line-height: $line-height-loose;
    color: $text-primary;
    text-align: start;
  }
}

.subline {
  margin: $spacing-lg 0 0;
  font-family: $font-mono;
  font-size: $font-size-small;
  line-height: $line-height-tight;
  color: $gray-500;
}

.recover {
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  margin-top: $spacing-2xl;
  padding: $spacing-md $spacing-2xl;
  font-family: $font-mono;
  font-size: 1rem;
  color: $text-primary;
  background: transparent;
  border: 1px solid rgba($cyberpunk-blue, 0.4);
  border-radius: $border-radius-sm;
  cursor: pointer;
  transition: color $transition-fast ease, border-color $transition-fast ease;

  .recover-prompt {
    color: $gray-500;
    transition: inherit;
  }

  &:hover,
  &:focus-visible {
    color: $cyberpunk-light-yellow;
    border-color: $cyberpunk-cyan;

    .recover-prompt {
      color: $cyberpunk-cyan;
    }
  }

  &:focus-visible {
    outline: 2px solid $cyberpunk-cyan;
    outline-offset: 2px;
  }
}

@media (max-width: #{$breakpoint-mobile - 1px}) {
  .error-main {
    padding: 4.5rem 0 1rem;
  }

  .error-panel {
    padding: $spacing-xl $spacing-lg;
  }

  .headline .headline-text {
    font-size: $font-size-base;
  }
}
</style>
