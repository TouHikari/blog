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

// 友情链接
const links = [
  {
    title: "GitHub - TouHikari",
    url: "https://github.com/touhikari"
  },
  {
    title: "bilibili | 哔哩哔哩 - HvnZ_Null",
    url: "https://space.bilibili.com/123365221"
  },
  {
    title: "NetEase Music | 网易云音乐 - HvnZ_Null",
    url: "https://music.163.com/#/user/home?id=436110203"
  }
]
</script>

<template>
  <div class="cyber-layout cyber-bg cyber-grid cyber-scanlines">
    <!-- 导航栏 -->
    <nav id="main-nav" class="navbar navbar-inverse navbar-fixed-top" role="navigation">
      <div class="container">
        <button
          type="button"
          class="navbar-header navbar-toggle"
          data-toggle="collapse"
          data-target=".navbar-collapse"
        >
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <NuxtLink class="navbar-brand neon-glow cyber-hover" to="/">{{ config.title }}</NuxtLink>
        <div class="collapse navbar-collapse nav-menu">
          <ul class="nav navbar-nav">
            <li v-for="item in menu" :key="item.url">
              <NuxtLink :to="item.url" :title="item.intro">
                <i :class="item.icon"></i>{{ item.title }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="clearfix"></div>

    <!-- 主要内容区域 -->
    <div class="container">
      <div class="row">
        <!-- 主内容 -->
        <div class="col-md-9">
          <div class="content">
            <slot />
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="col-md-3" id="sidebar">
          <!-- 搜索框 -->
          <div class="widget">
            <div class="widget-title">
              <i class="fa fa-search"></i> Search
            </div>
            <div class="widget-content">
              <BlogSearch />
            </div>
          </div>

          <!-- 分类 -->
          <div class="widget">
            <div class="widget-title">
              <i class="fa fa-folder"></i> Categories
            </div>
            <div class="widget-content">
              <!-- 这里将通过组件动态加载分类 -->
              <BlogCategories />
            </div>
          </div>

          <!-- 标签云 -->
          <div class="widget">
            <div class="widget-title">
              <i class="fa fa-tags"></i> Tags
            </div>
            <div class="widget-content">
              <!-- 这里将通过组件动态加载标签 -->
              <BlogTagCloud />
            </div>
          </div>

          <!-- 最近文章 -->
          <div class="widget">
            <div class="widget-title">
              <i class="fa fa-file-text"></i> Recent Posts
            </div>
            <div class="widget-content">
              <!-- 这里将通过组件动态加载最近文章 -->
              <BlogRecentPosts />
            </div>
          </div>

          <!-- 友情链接 -->
          <div class="widget">
            <div class="widget-title">
              <i class="fa fa-link"></i> Links
            </div>
            <div class="widget-content">
              <ul class="links-list">
                <li v-for="link in links" :key="link.url">
                  <a :href="link.url" target="_blank" rel="noopener noreferrer">
                    {{ link.title }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="container-narrow">
      <footer>
        <p>
          &copy; {{ new Date().getFullYear() }} {{ config.author }}.
          Powered by <a href="https://nuxt.com" target="_blank">Nuxt</a>.
          <span class="heart">
            <i class="fa fa-heart"></i>
          </span>
        </p>
      </footer>
    </div>
  </div>
</template>