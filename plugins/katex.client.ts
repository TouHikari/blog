import katex from 'katex'

export default defineNuxtPlugin(() => {
  // 确保在客户端运行
  if (process.client) {
    // 渲染数学公式的函数
    const renderMath = () => {
      // 渲染行内数学公式 $...$
      const inlineMathElements = document.querySelectorAll('code')
      inlineMathElements.forEach((element) => {
        const text = element.textContent || ''
        if (text.startsWith('$') && text.endsWith('$') && text.length > 2) {
          const mathText = text.slice(1, -1)
          try {
            const rendered = katex.renderToString(mathText, {
              throwOnError: false,
              displayMode: false
            })
            element.innerHTML = rendered
            element.classList.add('katex-inline')
          } catch (error) {
            console.warn('KaTeX inline rendering error:', error)
          }
        }
      })

      // 渲染块级数学公式 $$...$$
      const blockMathElements = document.querySelectorAll('pre code')
      blockMathElements.forEach((element) => {
        const text = element.textContent || ''
        if (text.startsWith('$$') && text.endsWith('$$') && text.length > 4) {
          const mathText = text.slice(2, -2)
          try {
            const rendered = katex.renderToString(mathText, {
              throwOnError: false,
              displayMode: true
            })
            const container = element.parentElement
            if (container) {
              container.innerHTML = rendered
              container.classList.add('katex-block')
            }
          } catch (error) {
            console.warn('KaTeX block rendering error:', error)
          }
        }
      })

      // 处理 LaTeX 风格的数学公式 \[...\] 和 \(...\)
      const processLatexMath = () => {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null
        )

        const textNodes: Text[] = []
        let node
        while (node = walker.nextNode()) {
          textNodes.push(node as Text)
        }

        textNodes.forEach((textNode) => {
          let text = textNode.textContent || ''
          let hasChanges = false

          // 处理块级数学公式 \[...\]
          text = text.replace(/\\\[([\s\S]*?)\\\]/g, (match, mathText) => {
            hasChanges = true
            try {
              return katex.renderToString(mathText, {
                throwOnError: false,
                displayMode: true
              })
            } catch (error) {
              console.warn('KaTeX LaTeX block rendering error:', error)
              return match
            }
          })

          // 处理行内数学公式 \(...\)
          text = text.replace(/\\\(([\s\S]*?)\\\)/g, (match, mathText) => {
            hasChanges = true
            try {
              return katex.renderToString(mathText, {
                throwOnError: false,
                displayMode: false
              })
            } catch (error) {
              console.warn('KaTeX LaTeX inline rendering error:', error)
              return match
            }
          })

          if (hasChanges) {
            const span = document.createElement('span')
            span.innerHTML = text
            textNode.parentNode?.replaceChild(span, textNode)
          }
        })
      }

      processLatexMath()
    }

    // 页面加载完成后渲染数学公式
    const observer = new MutationObserver((mutations) => {
      let shouldRender = false
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldRender = true
        }
      })
      if (shouldRender) {
        setTimeout(renderMath, 100)
      }
    })

    // 开始观察DOM变化
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // 初始渲染
    setTimeout(renderMath, 100)

    // 路由变化时重新渲染
    const router = useRouter()
    router.afterEach(() => {
      setTimeout(renderMath, 200)
    })
  }
})
