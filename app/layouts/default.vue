<script setup lang="ts">
// 布局配置
const layoutConfig = {
  showSidebar: true,
  sidebarPosition: 'right' // 'left' | 'right'
}
</script>

<template>
  <div class="app-layout cyber-bg cyber-grid cyber-scanlines">
    <!-- Header组件 -->
    <AppHeader>
      <!-- 可以通过slot传递页面特定的header内容 -->
      <template #pageHeader v-if="$slots.pageHeader">
        <slot name="pageHeader" />
      </template>
    </AppHeader>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <div class="container">
        <div class="row">
          <!-- 主内容 -->
          <div class="col-md-9">
            <div class="content">
              <slot />
            </div>
          </div>

          <!-- 侧边栏 -->
          <div class="col-md-3" id="sidebar" v-if="layoutConfig.showSidebar">
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
                <BlogCategories />
              </div>
            </div>

            <!-- 标签云 -->
            <div class="widget">
              <div class="widget-title">
                <i class="fa fa-tags"></i> Tags
              </div>
              <div class="widget-content">
                <BlogTagCloud />
              </div>
            </div>

            <!-- 最近文章 -->
            <div class="widget">
              <div class="widget-title">
                <i class="fa fa-file-text"></i> Recent Posts
              </div>
              <div class="widget-content">
                <BlogRecentPosts />
              </div>
            </div>

            <!-- 友情链接 -->
            <div class="widget">
              <div class="widget-title">
                <i class="fa fa-link"></i> Links
              </div>
              <div class="widget-content">
                <BlogSocialLinks />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer组件 -->
    <AppFooter />
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 80px; /* 为固定导航栏留出空间 */
  padding-bottom: 40px;
}

.content {
  padding: 20px 8px;
  margin: 20px 0;
  border-radius: 6px;
  min-height: 400px;
}

/* 侧边栏样式 */
#sidebar {
  font-size: 0.8em;
  padding-top: 20px;
}

.widget {
  padding-top: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 255, 170, 0.15);
  margin-bottom: 20px;
}

.widget:last-child {
  border-bottom: none;
}

.widget-title {
  font-weight: bold;
  margin-bottom: 15px;
  color: var(--cyberpunk-cyan);
  font-size: 1.1em;
  text-shadow: 0 0 8px rgba(0, 255, 213, 0.3);
}

.widget-title i {
  margin-right: 8px;
  opacity: 0.8;
}

.widget-content {
  color: #ccc;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding-top: 70px;
  }

  .content {
    padding: 15px 5px;
    margin: 10px 0;
  }

  #sidebar {
    margin-top: 30px;
    padding-top: 30px;
    border-top: 1px dashed rgba(0, 255, 170, 0.3);
  }

  .widget {
    padding: 20px 0;
  }
}

/* 无侧边栏时的样式 */
.col-md-9:only-child {
  width: 100%;
  max-width: none;
}
</style>