export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  nuxtApp.hook('app:mounted', () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const link = entry.target as HTMLAnchorElement
          const href = link.getAttribute('href')
          if (href && href.startsWith('/') && !href.startsWith('#')) {
             // 视口预加载
            preloadRouteComponents(href)
            preloadPayload(href)
            observer.unobserve(link)
          }
        }
      })
    })

    // 监听鼠标悬停预加载
    let timer: any
    const handleMouseOver = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a')
      if (link) {
        const href = link.getAttribute('href')
        if (href && href.startsWith('/') && !href.startsWith('#')) {
          timer = setTimeout(() => {
            preloadRouteComponents(href)
            preloadPayload(href)
          }, 50) // 50ms 延迟
        }
      }
    }
    
    const handleMouseOut = () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }

    // 添加全局事件监听
    document.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mouseout', handleMouseOut, { passive: true })
    
    // 移动端触摸开始时立即预加载
    const handleTouchStart = (e: TouchEvent) => {
      const link = (e.target as HTMLElement).closest('a')
      if (link) {
        const href = link.getAttribute('href')
        if (href && href.startsWith('/') && !href.startsWith('#')) {
          preloadRouteComponents(href)
          preloadPayload(href)
        }
      }
    }
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    
    // 观察所有链接
    document.querySelectorAll('a').forEach(a => observer.observe(a))

    // 监听路由变化，重新绑定
    router.afterEach(() => {
      setTimeout(() => {
        document.querySelectorAll('a').forEach(a => observer.observe(a))
      }, 500)
    })
  })
})
