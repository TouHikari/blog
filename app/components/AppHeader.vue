<script setup lang="ts">
// 网站配置
const config = {
  title: "[TouHikari@localhost ~]$",
  subtitle: "Where shadows dance with data streams.",
  description: "TouHikari 的数字幽灵日志。穿梭于代码与现实的边界，记录那些隐藏在防火墙之后的故事、实验和顿悟。这个网站本身，就是一个正在进行的实验。谨慎访问。",
  author: "TouHikari",
  url: "http://touhikari.top"
}

// 导航菜单配置
const menu = [
  {
    title: "Archives",
    url: "/blog",
    intro: "All the articles.",
    icon: "fa fa-archive"
  },
  {
    title: "Categories", 
    url: "/categories",
    intro: "All the categories.",
    icon: "fa fa-folder"
  },
  {
    title: "Tags",
    url: "/tags", 
    intro: "All the tags.",
    icon: "fa fa-tags"
  },
  {
    title: "About",
    url: "/about",
    intro: "About me.",
    icon: "fa fa-user"
  }
]

// 移动端菜单状态
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <header class="app-header">
    <!-- 导航栏 -->
    <nav id="main-nav" class="navbar navbar-inverse navbar-fixed-top" role="navigation">
      <div class="container">
        <!-- 移动端菜单按钮 -->
        <button 
          type="button" 
          class="navbar-header navbar-toggle" 
          :class="{ active: isMobileMenuOpen }"
          @click="toggleMobileMenu"
        >
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>

        <!-- 品牌标题 -->
        <NuxtLink class="navbar-brand neon-glow cyber-hover" to="/">
          {{ config.title }}
        </NuxtLink>

        <!-- 导航菜单 -->
        <div class="collapse navbar-collapse nav-menu" :class="{ 'show': isMobileMenuOpen }">
          <ul class="nav navbar-nav">
            <li v-for="item in menu" :key="item.url" class="nav-item">
              <NuxtLink 
                :to="item.url" 
                :title="item.intro"
                class="nav-link cyber-hover"
                @click="isMobileMenuOpen = false"
              >
                <i :class="item.icon"></i>
                <span class="nav-text">{{ item.title }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- 页面标题区域（可选，用于特殊页面） -->
    <div class="page-header-section" v-if="$slots.pageHeader">
      <div class="container">
        <slot name="pageHeader" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: relative;
  z-index: 1000;
}

/* 导航栏样式 */
.navbar {
  background: rgba(0, 0, 0, 0.95);
  border-bottom: 1px solid rgba(0, 255, 170, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.navbar-brand {
  font-size: 1.4em;
  font-weight: bold;
  color: var(--cyberpunk-cyan) !important;
  text-decoration: none;
  padding: 15px 20px;
  transition: all 0.3s ease;
}

.navbar-brand:hover {
  color: var(--cyberpunk-light-yellow) !important;
  text-shadow: 0 0 15px var(--cyberpunk-cyan);
}

/* 移动端菜单按钮 */
.navbar-toggle {
  background: none;
  border: 1px solid var(--cyberpunk-cyan);
  padding: 8px 12px;
  margin: 8px 15px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.navbar-toggle:hover,
.navbar-toggle.active {
  background: var(--cyberpunk-cyan);
  box-shadow: 0 0 10px var(--cyberpunk-cyan);
}

.navbar-toggle .icon-bar {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--cyberpunk-cyan);
  margin: 4px 0;
  transition: all 0.3s ease;
}

.navbar-toggle:hover .icon-bar,
.navbar-toggle.active .icon-bar {
  background: #000;
}

/* 导航菜单 */
.nav-menu {
  transition: all 0.3s ease;
}

.nav {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
}

.nav-item {
  margin: 0 5px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: var(--cyberpunk-cyan);
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--cyberpunk-light-yellow);
  background: rgba(0, 255, 213, 0.1);
  transform: translateY(-2px);
}

.nav-link i {
  margin-right: 8px;
  font-size: 1.1em;
}

.nav-text {
  font-weight: 500;
}

/* 页面标题区域 */
.page-header-section {
  background: linear-gradient(135deg, rgba(0, 255, 213, 0.05), rgba(255, 64, 128, 0.05));
  border-bottom: 1px dashed rgba(0, 255, 170, 0.2);
  padding: 40px 0;
  margin-top: 60px; /* 为固定导航栏留出空间 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar-collapse {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.98);
    border: 1px solid rgba(0, 255, 170, 0.3);
    border-top: none;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .navbar-collapse.show {
    max-height: 300px;
  }

  .nav {
    flex-direction: column;
    padding: 10px 0;
  }

  .nav-item {
    width: 100%;
    margin: 2px 0;
  }

  .nav-link {
    justify-content: flex-start;
    padding: 15px 20px;
    border-radius: 0;
  }

  .navbar-brand {
    font-size: 1.2em;
    padding: 12px 15px;
  }
}

/* 滚动时的效果 */
.navbar.scrolled {
  background: rgba(0, 0, 0, 0.98);
  box-shadow: 0 2px 10px rgba(0, 255, 213, 0.2);
}
</style>
