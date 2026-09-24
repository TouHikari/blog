// 站内链接预加载（桌面 hover / 触屏 pointerdown 双策略）
// - 桌面（pointer: fine）：鼠标悬停站内链接 50ms 后预取，避免视口内批量预取抢占首屏带宽
// - 触屏（pointer: coarse）：无 hover 语义，手指按下（pointerdown）后 60ms 预取；
//   期间滚动（touchmove）或手势取消（pointercancel）则放弃，避免滑动时的误预取
// - NuxtLink 自身的预取策略由 nuxt.config.ts 的 experimental.defaults.nuxtLink.prefetchOn 控制
//   （visibility: false + interaction: true），本插件主要覆盖 NuxtLink 之外的普通 <a> 链接
export default defineNuxtPlugin(() => {
  const prefetched = new Set<string>()

  const prefetch = (href: string) => {
    if (prefetched.has(href)) {
      return
    }
    prefetched.add(href)
    preloadRouteComponents(href)
    preloadPayload(href)
  }

  const resolveInternalHref = (target: EventTarget | null): { link: HTMLAnchorElement; href: string } | null => {
    const link = target instanceof Element ? target.closest<HTMLAnchorElement>('a') : null
    const href = link?.getAttribute('href')
    if (!link || !href || !href.startsWith('/') || href.startsWith('#')) {
      return null
    }
    return { link, href }
  }

  if (window.matchMedia('(pointer: coarse)').matches) {
    // 触屏：按下后短延时预取，滚动 / 手势取消则放弃
    let touchTimer: ReturnType<typeof setTimeout> | null = null

    const cancelTouchPrefetch = () => {
      if (touchTimer) {
        clearTimeout(touchTimer)
        touchTimer = null
      }
    }

    const handlePointerDown = (event: PointerEvent) => {
      const hit = resolveInternalHref(event.target)
      cancelTouchPrefetch()
      if (!hit) {
        return
      }
      touchTimer = setTimeout(() => {
        touchTimer = null
        prefetch(hit.href)
      }, 60)
    }

    document.addEventListener('pointerdown', handlePointerDown, { passive: true })
    document.addEventListener('touchmove', cancelTouchPrefetch, { passive: true })
    document.addEventListener('pointercancel', cancelTouchPrefetch, { passive: true })
    return
  }

  // 桌面：hover 50ms 防抖预取
  let timer: ReturnType<typeof setTimeout> | null = null
  let currentLink: HTMLAnchorElement | null = null

  const cancelPending = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    currentLink = null
  }

  const handleMouseOver = (event: MouseEvent) => {
    const hit = resolveInternalHref(event.target)
    if (!hit || hit.link === currentLink) {
      return
    }

    cancelPending()
    currentLink = hit.link

    if (prefetched.has(hit.href)) {
      return
    }

    // 50ms 防抖：鼠标快速划过时不会触发预取
    timer = setTimeout(() => {
      timer = null
      prefetch(hit.href)
    }, 50)
  }

  const handleMouseOut = (event: MouseEvent) => {
    // 同一链接内部子元素之间移动时，不重置计时
    const related = resolveInternalHref(event.relatedTarget)
    if (related && related.link === currentLink) {
      return
    }
    cancelPending()
  }

  document.addEventListener('mouseover', handleMouseOver, { passive: true })
  document.addEventListener('mouseout', handleMouseOut, { passive: true })
})
