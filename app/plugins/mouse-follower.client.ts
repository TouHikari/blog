// 标记/容器选择器常量：模块加载时构建一次，避免在事件处理中重复 join
const MARKED_SELECTOR = [".lock_marked", "#lock_marked", "[data-lock-marked]"].join(",");
const CONTAINER_SELECTOR = [".lock_wrap", ".lock_container", "[data-lock-container]", "[data-lock-scan]"].join(",");

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) return;

  nuxtApp.hook("app:mounted", () => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const init = () => {
      const follower = document.createElement("div");
      follower.className = "mouse-follower";
      document.body.appendChild(follower);

      const style = document.createElement("style");
      style.innerHTML = `
        .mouse-follower {
          position: fixed;
          pointer-events: none;
          z-index: 1999; /* Higher than content, unless element is elevated */
          background: var(--mf-bg, rgba(0, 255, 255, 0.1)); /* Default following color */
          border: var(--mf-border, 1px solid rgba(0, 255, 255, 1));
          border-radius: 0; /* Square by default */
          transform: translate(-50%, -50%); /* Center on coordinate */
          /* Transition is handled dynamically in JS */
          box-sizing: border-box;
          will-change: top, left, width, height, transform, border-radius;
          
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
          transform: translate(0, 0); /* Reset centering to match element rect */
          z-index: 0; /* Drop below elevated content when snapped */
        }
        
        /* Hide dot when snapped */
        .mouse-follower.snapped::after {
          opacity: 0;
        }
        
        .mouse-follower.hidden {
          opacity: 0;
          transition: opacity 0.1s;
        }
      `;
      document.head.appendChild(style);

      let mouseX = 0;
      let mouseY = 0;
      let targetElement: HTMLElement | null = null;
      let isSnapped = false;
      let lastSnappedElement: HTMLElement | null = null;
      let currentActiveTarget: HTMLElement | null = null;

      // 帧调度去重标志 + 矩形/样式缓存失效标记（事件驱动，替代原每帧空转）
      let frameScheduled = false;
      let rectDirty = true;
      let cachedRect = { top: 0, left: 0, width: 0, height: 0 };
      let cachedBorderRadius = "0";

      const getMarkedElement = (el: HTMLElement | null): HTMLElement | null => {
        if (!el) return null;

        const directMark = el.closest(MARKED_SELECTOR) as HTMLElement | null;
        if (directMark) return directMark;

        const scanContainer = el.closest(
          "[data-lock-scan]",
        ) as HTMLElement | null;
        if (scanContainer) {
          const scanSelector =
            scanContainer.getAttribute("data-lock-scan") || "a, button";

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

      const elevateElement = (el: HTMLElement | null) => {
        if (lastSnappedElement && lastSnappedElement !== el) {
          lastSnappedElement.style.removeProperty("z-index");

          if (lastSnappedElement.style.position === "relative") {
            lastSnappedElement.style.removeProperty("position");
          }
        }

        if (el) {
          if (
            el.style.position !== "absolute" &&
            el.style.position !== "fixed" &&
            el.style.position !== "relative"
          ) {
            const computed = window.getComputedStyle(el);
            if (computed.position === "static") {
              el.style.position = "relative";
            }
          }
          el.style.zIndex = "1";
        }
      };

      const update = () => {
        if (isSnapped && targetElement) {
          const isTargetChanged = currentActiveTarget !== targetElement;

          // 读取阶段：仅在目标切换或缓存失效（scroll / resize）时触碰布局/样式（原实现每帧读取）
          if (isTargetChanged) {
            cachedBorderRadius = window.getComputedStyle(targetElement).borderRadius;
            rectDirty = true;
          }

          if (rectDirty) {
            const box = targetElement.getBoundingClientRect();
            cachedRect = {
              top: box.top,
              left: box.left,
              width: box.width,
              height: box.height,
            };
            rectDirty = false;
          }

          if (isTargetChanged || !follower.classList.contains("snapped")) {
            follower.style.transition =
              "all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)";
            applyCustomStyles(targetElement);
            elevateElement(targetElement);
          } else {
            follower.style.transition =
              "width 0.1s, height 0.1s, border-radius 0.1s, top 0s, left 0s, background 0.1s, border 0.1s";
          }

          currentActiveTarget = targetElement;

          follower.style.width = `${cachedRect.width}px`;
          follower.style.height = `${cachedRect.height}px`;
          follower.style.top = `${cachedRect.top}px`;
          follower.style.left = `${cachedRect.left}px`;
          follower.style.borderRadius = cachedBorderRadius;

          if (!follower.classList.contains("snapped")) {
            follower.classList.add("snapped");
          }
        } else {
          if (currentActiveTarget !== null) {
            applyCustomStyles(null);
            elevateElement(null);
          }
          currentActiveTarget = null;
          follower.style.transition =
            "width 0.1s, height 0.1s, border-radius 0.1s, transform 0.1s, top 0s, left 0s, background 0.1s, border 0.1s";

          follower.style.width = "20px";
          follower.style.height = "20px";
          follower.style.top = `${mouseY}px`;
          follower.style.left = `${mouseX}px`;
          follower.style.borderRadius = "0";

          if (follower.classList.contains("snapped")) {
            follower.classList.remove("snapped");
          }
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

      // mousemove 与 mouseover 共用：后者覆盖「鼠标静止时鼠标下元素变化」的场景
      // （DOM 替换、动画推动、目标被移除）；重复触发由 scheduleUpdate 去重
      const handlePointerActivity = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        const target = e.target as HTMLElement;
        const marked = getMarkedElement(target);
        const container = getContainerElement(target);

        if (marked) {
          targetElement = marked;
          lastSnappedElement = marked;
          isSnapped = true;
        } else if (
          container &&
          lastSnappedElement &&
          container.contains(lastSnappedElement)
        ) {
          targetElement = lastSnappedElement;
          isSnapped = true;
        } else {
          targetElement = null;
          isSnapped = false;
          lastSnappedElement = null;
        }

        scheduleUpdate();
      };

      window.addEventListener("mousemove", handlePointerActivity);
      window.addEventListener("mouseover", handlePointerActivity);

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

      document.addEventListener("mouseleave", () => {
        follower.classList.add("hidden");
      });

      document.addEventListener("mouseenter", () => {
        follower.classList.remove("hidden");
      });

      scheduleUpdate();
    };

    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        init();
      });
    } else {
      setTimeout(() => {
        init();
      }, 1000);
    }
  });
});
