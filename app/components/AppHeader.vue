<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const scrollThreshold = 100 // 滚动多少像素后触发半透明效果

const handleScroll = () => {
  isScrolled.value = window.scrollY > scrollThreshold
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="header-container" :class="{ 'scrolled': isScrolled }">
    <div class="navbar">
      <NuxtLink to="/">
        <UiButton type="navbar-brand" class="nav-brand">[TouHikari@localhost ~]$</UiButton>
      </NuxtLink>
      <div class="nav-items">
        <NuxtLink to="/blog">
          <UiButton type="nav" class="nav-button">
            <Icon name="mdi:database" class="nav-icon" />
            Archives
          </UiButton>
        </NuxtLink>
        <NuxtLink to="/categories">
          <UiButton type="nav" class="nav-button">
            <Icon name="mdi:folder-network" class="nav-icon" />
            Categories
          </UiButton>
        </NuxtLink>
        <NuxtLink to="/tags">
          <UiButton type="nav" class="nav-button">
            <Icon name="mdi:tag-multiple" class="nav-icon" />
            Tags
          </UiButton>
        </NuxtLink>
        <NuxtLink to="/about">
          <UiButton type="nav" class="nav-button">
            <Icon name="mdi:account-circle" class="nav-icon" />
            About
          </UiButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/styles/fonts' as *;
@use '~/styles/variables' as *;

.header-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  min-height: 1.5rem;
  max-height: 2rem;
  font-family: $font-cyber;
  backdrop-filter: blur(2px);
  transition: all 0.3s ease;

  &.scrolled {
    opacity: .5;
  }

  &:hover {
    opacity: 1;
    background: linear-gradient($black-55, $transparent);
    backdrop-filter: blur(1px);
  }
}

.navbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.nav-brand {
  font-size: large;
  font-weight: bold;
  color: $gray-400;
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    color: white;
  }
}

.nav-items {
  display: flex;
  flex-direction: row;
  height: 100%;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: large;
  font-weight: bold;
  color: $gray-400;
  height: 100%;
  transition: all 0.08s ease;

  &:hover {
    color: black;
    background-color: $gray-400;
  }
}
</style>
