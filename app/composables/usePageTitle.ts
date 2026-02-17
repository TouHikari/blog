export const usePageTitle = () => {
  const route = useRoute()
  const customTitle = useState<string | null>('page-custom-title', () => null)

  const titleMap: Record<string, string> = {
    '/': 'Home',
    '/about': '[:INIT_USER/TouHikari]',
    '/blog': '[SYS_ARCHIVES]',
    '/categories': '[:METADATA_INDEX]',
    '/tags': '[TAG_CLOUD]'
  }

  const title = computed(() => {
    // 1. If a custom title is set (e.g. by a page component), use it
    if (customTitle.value) {
      return customTitle.value
    }

    // 2. Check static map
    const path = route.path
    if (titleMap[path]) {
      return titleMap[path]
    }

    // 3. Fallback for blog posts (if customTitle hasn't been set yet) or other pages
    // This is just a temporary display until the page component sets the real title
    if (path.startsWith('/blog/')) {
      const slugPart = path.split('/').filter(Boolean).slice(1).join('/')
      return decodeURIComponent(slugPart || 'Blog Post')
    }

    return 'Page'
  })

  const setTitle = (newTitle: string) => {
    customTitle.value = newTitle
  }

  const clearTitle = () => {
    customTitle.value = null
  }

  // Automatically clear custom title on route change
  watch(() => route.path, () => {
    clearTitle()
  })

  return {
    title,
    setTitle,
    clearTitle
  }
}
