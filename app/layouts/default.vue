<script setup lang="ts">

</script>

<template>
  <div class="container">
    <AppHeader />
    <main class="main-content">
      <BlogTitle />
      <div class="content-prose">
        <slot />
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
@use '~/styles/variables' as *;

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.main-content {
  padding-top: 1.5em;
}

@media (max-width: #{$breakpoint-mobile - 1px}) {
  .container {
    padding: 0 20px;
  }

  .page-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}

@media (min-width: #{$breakpoint-mobile}) and (max-width: #{$breakpoint-tablet - 1px}) {
  .container {
    max-width: 680px;
  }

  .page-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}

@media (min-width: #{$breakpoint-tablet}) and (max-width: #{$breakpoint-desktop - 1px}) {
  .container {
    max-width: 920px;
  }
}

@media (min-width: #{$breakpoint-desktop}) and (max-width: #{$breakpoint-desktop-lg - 1px}) {
  .container {
    max-width: 1000px;
  }
}

@media (min-width: #{$breakpoint-desktop-lg}) {
  .container {
    max-width: 1200px;
  }
}
</style>
