<script setup lang="ts">
import { SITE_TITLE } from '~/utils/constants'

// titleTemplate 必须在运行时注册：nuxt.config 静态 head 中的函数会在构建序列化时丢失
useHead({
  titleTemplate: (title?: string): string =>
    title && title !== SITE_TITLE ? `${title} | TouHikari.top` : title || SITE_TITLE
})
</script>

<template>
  <div>
    <NuxtLoadingIndicator color="#FFFF00" :height="2" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
