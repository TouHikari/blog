<script setup lang="ts">
// 友情链接和社交媒体
const links = [
  {
    title: "GitHub - TouHikari",
    url: "https://github.com/touhikari",
    icon: "fab fa-github",
    description: "代码仓库"
  },
  {
    title: "Bilibili - HvnZ_Null", 
    url: "https://space.bilibili.com/123365221",
    icon: "fab fa-bilibili",
    description: "视频分享"
  },
  {
    title: "NetEase Music - HvnZ_Null",
    url: "https://music.163.com/#/user/home?id=436110203",
    icon: "fas fa-music",
    description: "音乐收藏"
  }
]
</script>

<template>
  <div class="social-links-widget">
    <ul class="links-list">
      <li v-for="link in links" :key="link.url" class="link-item">
        <a 
          :href="link.url" 
          target="_blank" 
          rel="noopener noreferrer"
          class="social-link"
          :title="link.description"
        >
          <i :class="link.icon" class="link-icon"></i>
          <span class="link-text">{{ link.title }}</span>
          <i class="fas fa-external-link-alt external-icon"></i>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.links-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-item {
  margin-bottom: 12px;
}

.social-link {
  display: flex;
  align-items: center;
  padding: 8px 0;
  color: var(--cyberpunk-cyan);
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.social-link:hover {
  color: var(--cyberpunk-light-yellow);
  background: rgba(0, 255, 213, 0.05);
  padding-left: 12px;
  transform: translateX(4px);
}

.link-icon {
  margin-right: 12px;
  width: 16px;
  text-align: center;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.social-link:hover .link-icon {
  opacity: 1;
  transform: scale(1.1);
}

.link-text {
  flex: 1;
  font-size: 0.9em;
  font-weight: 500;
}

.external-icon {
  opacity: 0;
  font-size: 0.7em;
  margin-left: 8px;
  transition: all 0.3s ease;
}

.social-link:hover .external-icon {
  opacity: 0.7;
  transform: translateX(2px);
}

/* 特定平台的颜色 */
.social-link:hover .fa-github {
  color: #ffffff;
}

.social-link:hover .fa-bilibili {
  color: #00a1d6;
}

.social-link:hover .fa-music {
  color: #c20c0c;
}

/* 悬停效果 */
.social-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 213, 0.1), transparent);
  transition: left 0.5s ease;
}

.social-link:hover::before {
  left: 100%;
}
</style>
