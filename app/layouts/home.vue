<script setup lang="ts">

</script>

<template>
  <div class="container">
    <AppHeader />
    <main class="main-content">
      <div class="inner">
        <HomeTitle />
      </div>
      <div class="page-container">
        <div class="inner">
          <div class="page-content">
            <div class="page-home-slot">
              <slot />
            </div>
            <div class="page-blog">
              <BlogList />
            </div>
          </div>
          <div class="page-sidebar">
            <!-- <HomeSearch /> -->
            <hr>
            <HomeRecentPosts />
            <hr>
            <HomeTagsCloud />
            <hr>
            <HomeLinks />
            <hr>
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

.container {
  margin: 0 auto;
}

.main-content {
  padding-top: 1.5em;
}

.inner {
  display: flex;
  gap: 20px;
}

.page-home-slot {
  text-align: center;
  margin-top: 0;

  :deep(h1) {
    margin-top: 0 !important;
    margin-bottom: 0.3em !important;
  }

  :deep(p) {
    margin-top: 0;
  }
}

.page-blog {
  margin-top: 3em;
}

.page-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 1em;
  padding: 2em 0;
  background: linear-gradient(to bottom, $bg-tertiary, $bg-primary);

  .page-content {
    flex: 5;
    min-width: 0;
  }

  .page-sidebar {
    font-family: $font-pixel;
    flex: 2;
    min-width: 0;
  }
}

@media (max-width: #{$breakpoint-mobile - 1px}) {
  .page-home-slot {
    text-align: start;
  }
}

@media (min-width: #{$breakpoint-mobile}) and (max-width: #{$breakpoint-tablet - 1px}) {
  .page-home-slot {
    text-align: start;
  }
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
