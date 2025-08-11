// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/image",
  ],

  // 在Nuxt 4中，可以通过app配置来控制加载行为
  app: {
    head: {
      htmlAttrs: {
        lang: "zh-CN",
      },
      title: "[TouHikari@localhost ~]$",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "TouHikari 的数字幽灵日志。穿梭于代码与现实的边界，记录那些隐藏在防火墙之后的故事、实验和顿悟。这个网站本身，就是一个正在进行的实验。谨慎访问。" },
        { name: "keywords", content: "TouHikari, 黑客, Hacker, 极客, Geek, 网络安全, Cybersecurity, 信息安全, InfoSec, 编程, Coding, 开发, Development, 代码, Code, Linux, 命令行, Command Line, Terminal, 像素字体, Pixel Font, 复古, Retro, Dark Theme, 技术博客, Tech Blog, 个人博客, Personal Blog, 赛博朋克, Cyberpunk, 神秘, 酷, 隐私, Privacy, 加密, Cryptography, Python, C, C++" },
        { name: "author", content: "TouHikari" },
        { name: "robots", content: "index, follow" },
        { name: "theme-color", content: "#00FFD5" },

        // Open Graph
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "TouHikari.top" },
        { property: "og:title", content: "[TouHikari@localhost ~]$" },
        { property: "og:description", content: "TouHikari 的数字幽灵日志。穿梭于代码与现实的边界，记录那些隐藏在防火墙之后的故事、实验和顿悟。" },
        { property: "og:url", content: "http://touhikari.top" },
        { property: "og:image", content: "http://touhikari.top/favicon.png" },
        { property: "og:locale", content: "zh_CN" },

        // Twitter Card
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "[TouHikari@localhost ~]$" },
        { name: "twitter:description", content: "TouHikari 的数字幽灵日志。穿梭于代码与现实的边界，记录那些隐藏在防火墙之后的故事、实验和顿悟。" },
        { name: "twitter:image", content: "http://touhikari.top/favicon.png" },

        // 其他元数据
        { name: "format-detection", content: "telephone=no" },
        { name: "msapplication-TileColor", content: "#000000" },
        { name: "msapplication-config", content: "/browserconfig.xml" },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/favicon.png" },
        { rel: "apple-touch-icon", href: "/favicon.png" },
        { rel: "canonical", href: "http://touhikari.top" },
        { rel: "alternate", type: "application/rss+xml", title: "TouHikari.top RSS Feed", href: "/rss.xml" },
      ],
      script: [
        {
          type: "application/ld+json",
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "TouHikari",
            "url": "http://touhikari.top",
            "sameAs": [
              "https://github.com/touhikari",
              "https://space.bilibili.com/123365221"
            ],
            "jobTitle": "Developer",
            "description": "TouHikari 的数字幽灵日志。穿梭于代码与现实的边界，记录那些隐藏在防火墙之后的故事、实验和顿悟。"
          })
        },
      ]
    },
  },

  // 或者通过ssr配置来优化加载
  ssr: true,

  css: [
    "katex/dist/katex.min.css",
    "~/styles/main.scss"
  ],
});
