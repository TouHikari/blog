<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const scrollThreshold = 100 // 滚动多少像素后触发半透明效果
const isMenuOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > scrollThreshold
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
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
      <div class="mobile-nav">
        <UiButton type="nav" class="hamburger-button" @click="toggleMenu">
          <Icon :name="isMenuOpen ? 'mdi:close' : 'mdi:menu'" />
        </UiButton>
      </div>
    </div>
    <div v-if="isMenuOpen" class="mobile-nav-items">
      <NuxtLink to="/blog" @click="toggleMenu">
        <UiButton type="nav" class="nav-button">
          <Icon name="mdi:database" class="nav-icon" />
          Archives
        </UiButton>
      </NuxtLink>
      <NuxtLink to="/categories" @click="toggleMenu">
        <UiButton type="nav" class="nav-button">
          <Icon name="mdi:folder-network" class="nav-icon" />
          Categories
        </UiButton>
      </NuxtLink>
      <NuxtLink to="/tags" @click="toggleMenu">
        <UiButton type="nav" class="nav-button">
          <Icon name="mdi:tag-multiple" class="nav-icon" />
          Tags
        </UiButton>
      </NuxtLink>
      <NuxtLink to="/about" @click="toggleMenu">
        <UiButton type="nav" class="nav-button">
          <Icon name="mdi:account-circle" class="nav-icon" />
          About
        </UiButton>
      </NuxtLink>
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
  flex-direction: column;
  min-height: 1.5rem;
  max-height: 2rem;
  font-family: $font-mono;
  backdrop-filter: blur(2px);
  transition: all 0.3s ease;
  cursor: default;
  user-select: none;

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
  width: calc(100vw - 40px);
}

.nav-brand {
  font-family: $font-mono;
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

.mobile-nav {
  display: none;
}

.hamburger-button {
  display: flex;
  font-size: x-large;
  color: $gray-400;
  padding: 0;
}

.mobile-nav-items {
  display: flex;
  gap: 10px;
  flex-direction: column;
  color: $gray-400;
  background: rgba(0, 0, 0, 0.8);
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding: 10px;

  .nav-button {
    width: 100%;
    justify-content: center;
  }
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: $font-mono;
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

@media (max-width: #{$breakpoint-mobile - 1px}) {
  .navbar {
    padding: 0 20px;
    padding: 6px 0;
  }

  .nav-brand,
  .nav-button {
    font-size: medium;
  }

  .nav-items {
    display: none;
  }

  .mobile-nav {
    display: flex;
    align-items: center;
  }
}

@media (min-width: #{$breakpoint-mobile}) and (max-width: #{$breakpoint-tablet - 1px}) {
  .navbar {
    max-width: 720px;
    padding: 6px 0;
  }

  .nav-brand,
  .nav-button {
    font-size: medium;
  }
}

@media (min-width: #{$breakpoint-tablet}) and (max-width: #{$breakpoint-desktop - 1px}) {
  .navbar {
    max-width: 920px;
    padding: 6px 0;
  }

  .nav-brand,
  .nav-button {
    font-size: medium;
  }
}

@media (min-width: #{$breakpoint-desktop}) and (max-width: #{$breakpoint-desktop-lg - 1px}) {
  .navbar {
    max-width: 1000px;
  }
}

@media (min-width: #{$breakpoint-desktop-lg}) {
  .navbar {
    max-width: 1200px;
  }
}
</style>
