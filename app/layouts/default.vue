<script setup lang="ts">
import ContentAlert from '~/components/content/Alert.vue'
</script>

<template>
  <div class="container">
    <AppHeader />
    <main class="main-content">
      <div class="inner">
        <BlogTitle />
      </div>
      <div class="content-container">
        <div class="inner">
          <div class="content-prose">
            <slot />
            <br>
            <ContentAlert type="info">
              本文采用 <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank">知识共享署名-相同方式共享 4.0 国际许可协议</a> 进行许可。
            </ContentAlert>
          </div>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
@use '~/styles/variables' as *;
@use '~/styles/fonts' as *;
@use 'sass:string';

.container {
  margin: 0 auto;
}

.main-content {
  padding-top: 1.5em;
}

.inner {
  flex-direction: column;
}

.content-container {
  margin-top: 1em;
  padding: 2em 0;
  background: linear-gradient(to bottom, $bg-tertiary, $bg-primary string.unquote("min(100%, 100vh)"));
  position: relative;

  &::before {
    content: "=== Content begins here ===";
    font-feature-settings: "liga" 1, "calt" 1;
    position: absolute;
    top: 1.5em;
    left: 0;
    width: 100%;
    text-align: center;
    font-family: $font-mono;
    font-size: 14px;
    color: gray;
    transition: color 0.1s;
    z-index: 10;
    cursor: default;
  }
  
  &::after {
    content: "=== Content ends here ===";
    font-feature-settings: "liga" 1, "calt" 1;
    position: absolute;
    bottom: 1.5em;
    left: 0;
    width: 100%;
    text-align: center;
    font-family: $font-mono;
    font-size: 14px;
    color: gray;
    transition: color 0.1s;
    z-index: 10;
    cursor: default;
  }
  
  &:hover::before,
  &:hover::after {
    color: $cyberpunk-light-yellow;
  }
}

.content-prose {
  padding: 1em 0 2em 0;
}

@media (max-width: #{$breakpoint-mobile - 1px}) {
  //
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
