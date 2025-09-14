<script setup lang="ts">

</script>

<template>
  <div class="container">
    <AppHeader />
    <main class="main-content">
      <HomeTitle />
      <div class="page-container">
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
          <hr />
          <HomeRecentPosts />
          <hr />
          <HomeTagsCloud />
          <hr />
          <HomeLinks />
          <hr />
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
@use '~/styles/variables' as *;

.container {
  margin: 0 auto;
}

.main-content {
  padding-top: 1.5em;
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

  .page-content {
    flex: 5;
    min-width: 0;
    padding: 0 10px;
  }

  .page-sidebar {
    flex: 2;
    min-width: 0;
    padding: 0 10px;
  }
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

  .page-home-slot {
    text-align: start;
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

  .page-home-slot {
    text-align: start;
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
