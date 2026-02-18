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
        <UiButton type="navbar-brand" class="nav-brand">
          [<span class="navbar-brand-name">TouHikari</span><span class="navbar-brand-at">@</span><span class="navbar-brand-host">localhost</span> ~]$
        </UiButton>
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
          <svg
            class="hamburger-icon"
            :class="{ 'is-active': isMenuOpen }"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" class="line-top" />
            <line x1="4" y1="12" x2="20" y2="12" class="line-middle" />
            <line x1="4" y1="18" x2="20" y2="18" class="line-bottom" />
          </svg>
        </UiButton>
      </div>
      <Transition name="menu-expand">
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
      </Transition>
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
  width: 100vw;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  min-height: 1.5rem;
  max-height: 2rem;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
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
    -webkit-backdrop-filter: blur(1px);
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
  position: relative;
  z-index: 10;
}

.nav-brand {
  font-family: $font-mono;
  font-size: 18px;
  font-weight: bold;
  color: $gray-400;
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    color: white;
  }
  
  .navbar-brand-name,
  .navbar-brand-at,
  .navbar-brand-host {
    transition: inherit;
  }

  .navbar-brand-name {
    &:hover {
      color: $cyberpunk-cyan;
    }
  }

  .navbar-brand-at {
    &:hover {
      color: gray;
    }
  }

  .navbar-brand-host {
    &:hover {
      color: $cyberpunk-light-yellow;
    }
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
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding: 10px;
  z-index: 1;

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
  font-size: 18px;
  font-weight: bold;
  color: $gray-400;
  height: 100%;
  transition: all 0.08s ease;

  &:hover {
    color: black;
    background-color: $gray-400;
  }
}

.hamburger-icon {
  display: block;
  cursor: pointer;

  line {
    transition: all 0.1s ease-in-out;
    transform-origin: center;
    transform-box: fill-box;
  }

  &.is-active {
    .line-top {
      transform: translateY(6px) rotate(45deg);
    }
    .line-middle {
      opacity: 0;
      transform: scaleX(0);
    }
    .line-bottom {
      transform: translateY(-6px) rotate(-45deg);
    }
  }
}

.menu-expand-enter-active,
.menu-expand-leave-active {
  transition: all 0.1s ease-in-out;
}

.menu-expand-enter-from,
.menu-expand-leave-to {
  opacity: 0;
  transform: translateY(-20px);
  clip-path: inset(0 0 100% 0);
}

.menu-expand-enter-to,
.menu-expand-leave-from {
  opacity: 1;
  transform: translateY(0);
  clip-path: inset(0 0 0 0);
}

@media (max-width: #{$breakpoint-mobile - 1px}) {
  .navbar {
    padding: 6px 20px;
    margin: 0;
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
