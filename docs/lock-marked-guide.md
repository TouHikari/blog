# Lock Marked (鼠标跟随与吸附系统) 技术文档

`Lock Marked` 是一个基于 Nuxt 4 的鼠标交互增强插件，旨在为网页提供类似 "磁力吸附" 的鼠标跟随效果。

当用户将鼠标移动到特定标记的元素上时，一个半透明的背景块会平滑地过渡并吸附到该元素上，提供强烈的视觉反馈。

## 1. 核心功能

- **鼠标跟随**：在空白区域，显示为一个跟随鼠标的小圆点（光标）。
- **元素吸附**：当鼠标悬停在“标记元素”上时，光标会自动变形、放大并覆盖该元素。
- **容器锁定**：在指定的“父容器”内，光标会保持吸附状态，直到鼠标移出容器或移动到另一个标记元素上。

## 2. 安装与启用

该功能作为 Nuxt 插件集成，文件位于 `app/plugins/mouse-follower.client.ts`。
只要项目运行在客户端（浏览器环境）且设备支持精细指针（鼠标），插件会自动加载并生效。

## 3. 使用方法

### 3.1 标记吸附目标 (Marked Elements)

要让一个元素具有“吸附”效果，只需为其添加以下任意标识符：

- **Class**: `.lock_marked`
- **ID**: `#lock_marked`
- **Attribute**: `data-lock-marked`

**示例：**

```html
<!-- 使用 class -->
<button class="lock_marked">Hover Me</button>

<!-- 使用 data 属性 -->
<div data-lock-marked>
  <h3>Card Title</h3>
  <p>Content...</p>
</div>
```

### 3.2 定义生效容器 (Animation Container)

为了防止鼠标稍微移开元素就立即“收回”光标，可以定义一个父容器。
在父容器范围内，光标会**保持**在最后一个吸附的元素上，直到：

1. 鼠标移动到容器内的另一个标记元素。
2. 鼠标完全移出该容器。

**标识符：**

- **Class**: `.lock_wrap` 或 `.lock_container`
- **Attribute**: `data-lock-container`

**示例结构：**

```html
<!-- 容器开始 -->
<div class="lock_wrap">
  <!-- 标记元素 A -->
  <div class="lock_marked">Item 1</div>

  <!-- 标记元素 B -->
  <div class="lock_marked">Item 2</div>

  <!-- 空白区域：鼠标在此区域时，光标会停留在 Item 1 或 Item 2 上，不会收回 -->
  <div class="spacer">...</div>
</div>
<!-- 容器结束：鼠标移出此处，光标收回 -->
```

## 4. 技术细节

### DOM 结构

插件会在 `body` 下自动注入一个 `div.mouse-follower`。

```html
<div class="mouse-follower [snapped] [hidden]"></div>
```

### CSS 类名状态

- `.mouse-follower`: 基础样式（跟随鼠标的小圆点）。
- `.snapped`: 吸附状态（变为矩形，覆盖目标元素）。
- `.hidden`: 隐藏状态（当鼠标离开浏览器窗口时）。

### 样式定制

默认样式定义在插件内部的 `<style>` 标签中。核心属性如下：

- `z-index: 9999`: 确保覆盖在大部分元素之上。
- `pointer-events: none`: 确保不阻挡鼠标点击事件。
- `mix-blend-mode`: 可根据需求调整混合模式（目前默认样式为半透明青色）。

## 5. 开发计划 (TODO)

- [x] 基础鼠标跟随
- [x] 元素吸附逻辑
- [x] 容器锁定逻辑
- [ ] **自定义样式配置**：支持为不同标记元素配置不同的光标颜色/样式（如 `data-lock-style="red"`）。

---

_文档更新日期: 2026-02-19_
