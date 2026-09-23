// 标记/容器选择器常量：模块加载时构建一次，避免在事件处理中重复 join
const MARKED_SELECTOR = [".lock_marked", "#lock_marked", "[data-lock-marked]"].join(",");
const CONTAINER_SELECTOR = [".lock_wrap", ".lock_container", "[data-lock-container]", "[data-lock-scan]"].join(",");

// 跟随态方块边长（px）：同时用于样式表尺寸与坐标偏移计算
const FOLLOWER_SIZE = 20;
// 吸附目标层级提升标记：属性 + 样式表规则（首次吸附时打标并保持，避免内联样式污染与层级往返的渲染切换）
const ELEVATED_ATTR = "data-lock-elevated";

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) return;

  nuxtApp.hook("app:mounted", () => {
    // 触摸设备不启用；系统「减少动态效果」偏好命中时整体禁用（效果只提供完整形态，不做降级）
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const init = () => {
      // 重复初始化防护（dev HMR 场景）
      document.querySelector(".mouse-follower")?.remove();
      document.getElementById("mouse-follower-style")?.remove();

      const follower = document.createElement("div");
      follower.className = "mouse-follower hidden"; // 首个指针活动前保持隐藏
      follower.setAttribute("aria-hidden", "true");
      document.body.appendChild(follower);

      const style = document.createElement("style");
      style.id = "mouse-follower-style";
      style.textContent = `
        .mouse-follower {
          position: fixed;
          top: 0;
          left: 0;
          width: ${FOLLOWER_SIZE}px;
          height: ${FOLLOWER_SIZE}px;
          pointer-events: none;
          z-index: 1999; /* 跟随态：悬浮于内容之上；吸附态降为 0（见 .snapped） */
          background: var(--mf-bg, rgba(0, 255, 255, 0.1)); /* Default following color */
          border: var(--mf-border, 1px solid rgba(0, 255, 255, 1));
          border-radius: 0; /* Square by default */
          box-sizing: border-box;
          will-change: transform;
          /* 跟随态：transform 不在过渡列表（位置即时跟手）；尺寸/颜色平滑收回 */
          transition: width 0.1s, height 0.1s, border-radius 0.1s, background 0.1s, border 0.1s, opacity 0.1s;
          
          /* Center dot implementation */
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* The center dot */
        .mouse-follower::after {
          content: '';
          position: absolute;
          width: 2px;
          height: 2px;
          background-color: rgba(0, 255, 255, 0.8); /* Match border color usually */
          opacity: 1;
          transition: opacity 0.1s;
        }

        .mouse-follower.snapped {
          background: var(--mf-bg-snapped, rgba(0, 255, 255, 0.1));
          border: var(--mf-border-snapped, 1px solid rgba(0, 255, 255, 0.4));
          z-index: 0; /* Drop below elevated content when snapped */
          /* 进入吸附：位置 + 形状 0.2s（磁力滑动） */
          transition: transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1),
            width 0.2s cubic-bezier(0.25, 0.8, 0.25, 1),
            height 0.2s cubic-bezier(0.25, 0.8, 0.25, 1),
            border-radius 0.2s cubic-bezier(0.25, 0.8, 0.25, 1),
            background 0.1s, border 0.1s, opacity 0.1s;
        }

        /* 滑入完成（JS 在过渡周期后打标）：矩形更新（滚动/尺寸变化）即时贴合位置，尺寸仍平滑 */
        .mouse-follower.snapped.settled {
          transition: width 0.2s cubic-bezier(0.25, 0.8, 0.25, 1),
            height 0.2s cubic-bezier(0.25, 0.8, 0.25, 1),
            border-radius 0.2s cubic-bezier(0.25, 0.8, 0.25, 1),
            background 0.1s, border 0.1s, opacity 0.1s;
        }

        /* 离开吸附：位置与尺寸同步平滑收回（从元素处滑回鼠标，避免「大形状瞬移」） */
        .mouse-follower.releasing {
          transition: transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1),
            width 0.2s cubic-bezier(0.25, 0.8, 0.25, 1),
            height 0.2s cubic-bezier(0.25, 0.8, 0.25, 1),
            border-radius 0.2s cubic-bezier(0.25, 0.8, 0.25, 1),
            background 0.1s, border 0.1s, opacity 0.1s;
        }
        
        /* Hide dot when snapped */
        .mouse-follower.snapped::after {
          opacity: 0;
        }
        
        /* 仅切换透明度，不覆盖 transition 列表（避免取消进行中的回收/吸附过渡） */
        .mouse-follower.hidden {
          opacity: 0;
        }

        /* 吸附目标的层级提升：首次吸附时由 JS 打标并保持（属性化替代内联写入，且不覆盖组件自身 :hover 级联） */
        [data-lock-elevated="position"] { position: relative; z-index: 1; }
        [data-lock-elevated="layer"] { z-index: 1; }
      `;
      document.head.appendChild(style);

      let mouseX = 0;
      let mouseY = 0;
      let targetElement: HTMLElement | null = null;
      let isSnapped = false;
      let lastSnappedElement: HTMLElement | null = null;
      let currentActiveTarget: HTMLElement | null = null;
      // 光标可见性：初始隐藏（防 (0,0) 闪现）；首个指针进入/移动后显示，移出窗口隐藏
      let followerVisible = false;

      // 帧调度去重标志 + 矩形/样式缓存失效标记（事件驱动，替代原每帧空转）
      let frameScheduled = false;
      let rectDirty = true;
      let cachedRect = { top: 0, left: 0, width: 0, height: 0 };
      let cachedBorderRadius = "0";

      // 吸附目标尺寸观察（字体晚到、内容变化等布局更新同样失效矩形缓存）
      let resizeObserver: ResizeObserver | null = null;
      // 「滑入完成」定时器：完成后 transform 即时贴合滚动，不再有过渡滞后
      let settleTimer: ReturnType<typeof setTimeout> | null = null;

      // 扫描容器选择器校验缓存：非法选择器（如手误写成 ":not("）不应中断事件处理
      const scanSelectorCache = new WeakMap<HTMLElement, string | null>();

      const resolveScanSelector = (container: HTMLElement): string | null => {
        if (scanSelectorCache.has(container)) {
          return scanSelectorCache.get(container) ?? null;
        }

        const raw = container.getAttribute("data-lock-scan") || "a, button";
        let selector: string | null = raw;
        try {
          document.createDocumentFragment().querySelector(raw);
        } catch {
          selector = null;
        }
        scanSelectorCache.set(container, selector);
        return selector;
      };

      const getMarkedElement = (el: HTMLElement | null): HTMLElement | null => {
        if (!el) return null;

        const directMark = el.closest(MARKED_SELECTOR) as HTMLElement | null;
        if (directMark) return directMark;

        const scanContainer = el.closest(
          "[data-lock-scan]",
        ) as HTMLElement | null;
        if (scanContainer) {
          const scanSelector = resolveScanSelector(scanContainer);
          if (!scanSelector) return null;

          const candidate = el.closest(scanSelector) as HTMLElement | null;

          if (candidate && scanContainer.contains(candidate)) {
            return candidate;
          }
        }

        return null;
      };

      const getContainerElement = (
        el: HTMLElement | null,
      ): HTMLElement | null => {
        if (!el) return null;
        return el.closest(CONTAINER_SELECTOR) as HTMLElement | null;
      };

      const applyCustomStyles = (el: HTMLElement | null) => {
        if (!el) {
          follower.style.removeProperty("--mf-bg-snapped");
          follower.style.removeProperty("--mf-border-snapped");
          return;
        }

        let bg = el.getAttribute("data-lock-bg");
        let border = el.getAttribute("data-lock-border");

        if (!bg || !border) {
          const scanContainer = el.closest(
            "[data-lock-scan]",
          ) as HTMLElement | null;
          if (scanContainer) {
            if (!bg) bg = scanContainer.getAttribute("data-lock-bg");
            if (!border)
              border = scanContainer.getAttribute("data-lock-border");
          }
        }

        if (bg) {
          follower.style.setProperty("--mf-bg-snapped", bg);
        } else {
          follower.style.removeProperty("--mf-bg-snapped");
        }

        if (border) {
          follower.style.setProperty("--mf-border-snapped", border);
        } else {
          follower.style.removeProperty("--mf-border-snapped");
        }
      };

      // 层级提升：吸附时需要让目标内容浮在光标色块（z-index: 0）之上。
      // 采用属性打标 + 样式表规则：首次吸附时提升并保持——避免每次往返增删层叠上下文引起层切换闪烁，
      // 同时以属性替代内联样式（不再覆盖组件自身的 :hover 级联设计）；
      // 已高于光标层的定位元素（z-index >= 1）直接跳过，不干预既有层级。
      const elevateElement = (el: HTMLElement) => {
        if (el.hasAttribute(ELEVATED_ATTR)) return;

        const computed = window.getComputedStyle(el);
        if (computed.position === "static") {
          el.setAttribute(ELEVATED_ATTR, "position");
          return;
        }

        const z = computed.zIndex;
        if (z === "auto" || z === "0") {
          el.setAttribute(ELEVATED_ATTR, "layer");
        }
      };

      // 吸附目标的尺寸观察：内容/字体/布局的晚到变化同样失效矩形缓存（滚动 / 缩放之外的失效源）
      const observeTarget = (el: HTMLElement) => {
        if (!resizeObserver) {
          resizeObserver = new ResizeObserver(() => {
            if (isSnapped && targetElement) {
              rectDirty = true;
              scheduleUpdate();
            }
          });
        }
        resizeObserver.disconnect();
        resizeObserver.observe(el);
      };

      const unobserveTarget = () => {
        resizeObserver?.disconnect();
      };

      const clearSettleTimer = () => {
        if (settleTimer !== null) {
          clearTimeout(settleTimer);
          settleTimer = null;
        }
      };

      // 滑入完成后切换为「即时贴合」：此后矩形更新（滚动）不再走 transform 过渡
      const restartSettleTimer = () => {
        clearSettleTimer();
        follower.classList.remove("settled");
        settleTimer = setTimeout(() => {
          follower.classList.add("settled");
          settleTimer = null;
        }, 250);
      };

      const update = () => {
        // 目标被卸载的防御（SPA 导航 / DOM 替换且鼠标静止）：直接回到跟随态
        if (isSnapped && (!targetElement || !targetElement.isConnected)) {
          targetElement = null;
          isSnapped = false;
          lastSnappedElement = null;
        }

        if (isSnapped && targetElement) {
          const isTargetChanged = currentActiveTarget !== targetElement;

          if (isTargetChanged) {
            cachedBorderRadius = window.getComputedStyle(targetElement).borderRadius;
            applyCustomStyles(targetElement);
            elevateElement(targetElement);
            observeTarget(targetElement);
            restartSettleTimer();
            rectDirty = true;
          }

          // 吸附稳定态：零 style 写入（保证吸附动画不被后续鼠标事件打断）
          if (!isTargetChanged && !rectDirty) return;

          const box = targetElement.getBoundingClientRect();
          cachedRect = {
            top: box.top,
            left: box.left,
            width: box.width,
            height: box.height,
          };
          rectDirty = false;
          currentActiveTarget = targetElement;

          follower.classList.add("snapped");
          follower.style.width = `${cachedRect.width}px`;
          follower.style.height = `${cachedRect.height}px`;
          follower.style.borderRadius = cachedBorderRadius;
          follower.style.transform = `translate3d(${cachedRect.left}px, ${cachedRect.top}px, 0)`;
        } else {
          const wasSnapped = currentActiveTarget !== null;
          currentActiveTarget = null;

          if (wasSnapped) {
            // 离开吸附：切换到回收过渡（releasing）——位置与尺寸同步平滑收回，避免大形状瞬移
            applyCustomStyles(null);
            unobserveTarget();
            clearSettleTimer();
            follower.classList.remove("snapped");
            follower.classList.remove("settled");
            follower.classList.add("releasing");
            follower.style.removeProperty("width");
            follower.style.removeProperty("height");
            follower.style.removeProperty("border-radius");
          }

          follower.style.transform = `translate3d(${mouseX - FOLLOWER_SIZE / 2}px, ${mouseY - FOLLOWER_SIZE / 2}px, 0)`;
        }
      };

      // 事件驱动的帧调度：仅在状态可能变化时请求下一帧（替代原每帧空转）
      const scheduleUpdate = () => {
        if (frameScheduled) return;
        frameScheduled = true;
        requestAnimationFrame(() => {
          frameScheduled = false;
          update();
        });
      };

      const showFollower = () => {
        if (followerVisible) return;
        followerVisible = true;
        follower.classList.remove("hidden");
      };

      const hideFollower = () => {
        if (!followerVisible) return;
        followerVisible = false;
        follower.classList.add("hidden");
      };

      // mousemove：仅记录坐标与调度渲染（命中判定交由 mouseover，避免高频路径重复 DOM 查询）
      const handleMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        showFollower();
        scheduleUpdate();
      };

      // mouseover：指针进入新元素（含子元素间移动）时做一次命中判定；
      // DOM 替换 / 滚动导致鼠标下元素变化时，浏览器重算 hover 后同样会走这里
      const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const marked = getMarkedElement(target);
        const container = getContainerElement(target);

        if (marked) {
          if (targetElement !== marked || !isSnapped) {
            targetElement = marked;
            lastSnappedElement = marked;
            isSnapped = true;
            scheduleUpdate();
          }
          return;
        }

        if (
          container &&
          lastSnappedElement &&
          container.contains(lastSnappedElement)
        ) {
          if (targetElement !== lastSnappedElement || !isSnapped) {
            targetElement = lastSnappedElement;
            isSnapped = true;
            scheduleUpdate();
          }
          return;
        }

        if (isSnapped || lastSnappedElement) {
          targetElement = null;
          isSnapped = false;
          lastSnappedElement = null;
          scheduleUpdate();
        }
      };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      window.addEventListener("mouseover", handleMouseOver, { passive: true });

      // 吸附框视口坐标随滚动 / 缩放变化：显式失效缓存并按需请求一帧
      const invalidateRect = () => {
        rectDirty = true;
        if (isSnapped) scheduleUpdate();
      };

      window.addEventListener("scroll", invalidateRect, {
        passive: true,
        capture: true,
      });
      window.addEventListener("resize", invalidateRect);

      // 回收过渡（releasing）的位移结束即移除回收态，恢复跟随态的即时跟手
      follower.addEventListener("transitionend", (e: TransitionEvent) => {
        if (e.target !== follower || e.propertyName !== "transform") return;
        follower.classList.remove("releasing");
      });

      document.addEventListener("mouseleave", () => {
        hideFollower();
      });

      document.addEventListener("mouseenter", (e: MouseEvent) => {
        // 从窗口外进入：先同步坐标再显示，避免在旧坐标处闪现
        mouseX = e.clientX;
        mouseY = e.clientY;
        showFollower();
        scheduleUpdate();
      });

      // 客户端导航后 DOM 已替换：清除吸附记忆并复位光标（点击链接后鼠标静止也不残留旧框）
      nuxtApp.hook("page:finish", () => {
        targetElement = null;
        isSnapped = false;
        lastSnappedElement = null;
        scheduleUpdate();
      });
    };

    if (window.requestIdleCallback) {
      // timeout 兜底：页面持续繁忙时也保证初始化
      window.requestIdleCallback(() => {
        init();
      }, { timeout: 2000 });
    } else {
      setTimeout(() => {
        init();
      }, 1000);
    }
  });
});
