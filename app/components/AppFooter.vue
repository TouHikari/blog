<script setup lang="ts">
// 网站信息
const siteInfo = {
  author: "TouHikari",
  startYear: 2025,
  currentYear: new Date().getFullYear()
}

// 友情链接
const links = [
  {
    title: "GitHub",
    url: "https://github.com/touhikari",
    icon: "fab fa-github"
  },
  {
    title: "Bilibili",
    url: "https://space.bilibili.com/123365221",
    icon: "fab fa-bilibili"
  },
  {
    title: "NetEase Music",
    url: "https://music.163.com/#/user/home?id=436110203",
    icon: "fas fa-music"
  }
]

// 快速导航
const quickLinks = [
  { title: "首页", url: "/" },
  { title: "博客", url: "/blog" },
  { title: "分类", url: "/categories" },
  { title: "标签", url: "/tags" },
  { title: "关于", url: "/about" }
]

// 技术栈
const techStack = [
  { name: "Nuxt 4", url: "https://nuxt.com" },
  { name: "Vue 3", url: "https://vuejs.org" },
  { name: "TypeScript", url: "https://www.typescriptlang.org" },
  { name: "SCSS", url: "https://sass-lang.com" }
]

// 计算版权年份显示
const copyrightYear = computed(() => {
  return siteInfo.startYear === siteInfo.currentYear
    ? siteInfo.currentYear
    : `${siteInfo.startYear}-${siteInfo.currentYear}`
})

// 返回顶部功能
const showBackToTop = ref(false)

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 生命周期
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="container">
        <div class="footer-grid">
          <!-- 网站信息 -->
          <div class="footer-section">
            <h3 class="footer-title">
              <i class="fas fa-terminal"></i>
              TouHikari.top
            </h3>
            <p class="footer-description">
              数字幽灵日志。穿梭于代码与现实的边界，记录那些隐藏在防火墙之后的故事、实验和顿悟。
            </p>
            <div class="footer-stats">
              <span class="stat-item">
                <i class="fas fa-code"></i>
                Powered by curiosity
              </span>
            </div>
          </div>

          <!-- 快速导航 -->
          <div class="footer-section">
            <h4 class="section-title">
              <i class="fas fa-compass"></i>
              快速导航
            </h4>
            <ul class="footer-links">
              <li v-for="link in quickLinks" :key="link.url">
                <NuxtLink :to="link.url" class="footer-link">
                  {{ link.title }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- 社交链接 -->
          <div class="footer-section">
            <h4 class="section-title">
              <i class="fas fa-link"></i>
              社交链接
            </h4>
            <ul class="footer-links">
              <li v-for="link in links" :key="link.url">
                <a 
                  :href="link.url" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="footer-link social-link"
                >
                  <i :class="link.icon"></i>
                  {{ link.title }}
                </a>
              </li>
            </ul>
          </div>

          <!-- 技术栈 -->
          <div class="footer-section">
            <h4 class="section-title">
              <i class="fas fa-tools"></i>
              技术栈
            </h4>
            <ul class="footer-links">
              <li v-for="tech in techStack" :key="tech.name">
                <a 
                  :href="tech.url" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="footer-link tech-link"
                >
                  {{ tech.name }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 版权信息 -->
    <div class="footer-bottom">
      <div class="container">
        <div class="copyright-section">
          <div class="copyright-text">
            <p>
              &copy; {{ copyrightYear }} {{ siteInfo.author }}. 
              <span class="heart-text">
                Made with <i class="fas fa-heart heart-icon"></i> and lots of ☕
              </span>
            </p>
          </div>
          <div class="footer-meta">
            <span class="build-info">
              <i class="fas fa-rocket"></i>
              Built with Nuxt 4
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 返回顶部按钮 -->
    <button
      class="back-to-top"
      @click="scrollToTop"
      v-show="showBackToTop"
    >
      <i class="fas fa-chevron-up"></i>
    </button>
  </footer>
</template>

<style scoped>
.app-footer {
  background: linear-gradient(135deg, #000000, #0a0a0a);
  border-top: 1px solid rgba(0, 255, 170, 0.3);
  margin-top: auto;
  position: relative;
}

.footer-content {
  padding: 60px 0 40px;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
}

.footer-section {
  color: #ccc;
}

.footer-title {
  color: var(--cyberpunk-cyan);
  font-size: 1.5em;
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(0, 255, 213, 0.3);
}

.footer-title i {
  margin-right: 10px;
}

.section-title {
  color: var(--cyberpunk-cyan);
  font-size: 1.1em;
  margin-bottom: 15px;
  border-bottom: 1px dashed rgba(0, 255, 170, 0.2);
  padding-bottom: 8px;
}

.section-title i {
  margin-right: 8px;
}

.footer-description {
  line-height: 1.6;
  margin-bottom: 20px;
  opacity: 0.9;
}

.footer-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  font-size: 0.9em;
  color: var(--cyberpunk-light-yellow);
}

.stat-item i {
  margin-right: 6px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-link {
  color: #ccc;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
}

.footer-link:hover {
  color: var(--cyberpunk-cyan);
  transform: translateX(5px);
}

.social-link i {
  margin-right: 8px;
  width: 16px;
}

.tech-link:hover {
  color: var(--cyberpunk-light-yellow);
}

.footer-bottom {
  background: rgba(0, 0, 0, 0.5);
  border-top: 1px dashed rgba(0, 255, 170, 0.2);
  padding: 20px 0;
}

.copyright-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.copyright-text {
  color: #999;
  font-size: 0.9em;
}

.heart-text {
  margin-left: 10px;
}

.heart-icon {
  color: var(--cyberpunk-pink);
  animation: heartbeat 2s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 50%, 100% { transform: scale(1); }
  25%, 75% { transform: scale(1.1); }
}

.footer-meta {
  color: #666;
  font-size: 0.85em;
}

.build-info i {
  margin-right: 5px;
  color: var(--cyberpunk-cyan);
}

.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: var(--cyberpunk-cyan);
  color: #000;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 0 4px 15px rgba(0, 255, 213, 0.3);
}

.back-to-top:hover {
  background: var(--cyberpunk-light-yellow);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 255, 213, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .copyright-section {
    flex-direction: column;
    text-align: center;
  }
  
  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
  }
}
</style>
