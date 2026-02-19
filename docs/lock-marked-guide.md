# Lock Marked (鼠标跟随与吸附系统) 技术文档

`Lock Marked` 是一个基于 Nuxt 4 的鼠标交互增强插件，旨在为网页提供类似 "磁力吸附" 的鼠标跟随效果。

当用户将鼠标移动到特定标记的元素上时，一个半透明的背景块会平滑地过渡并吸附到该元素上，提供强烈的视觉反馈。

## 1. 核心功能

- **鼠标跟随**：在空白区域，显示为一个跟随鼠标的小方块，中心带有一个高亮圆点（光标）。
- **元素吸附**：当鼠标悬停在“标记元素”上时，光标会自动变形、放大并覆盖该元素，中心圆点消失。
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

### 3.3 自动扫描 (Auto Scanning)

对于动态生成的内容（如 `ContentRenderer` 渲染的 Markdown），手动为每个元素添加标记可能很麻烦。
可以使用 `data-lock-scan` 属性，让插件自动识别容器内的特定子元素。

- **Attribute**: `data-lock-scan="selector"`
- **Default**: 如果留空，默认为 `"a, button"`。

**示例：**

```html
<!-- 自动将内部所有的 <a> 和 <button> 视为标记元素 -->
<div
  class="article-content"
  data-lock-scan
>
  <p>Some text with <a href="#">link</a>.</p>
</div>

<!-- 自动将内部所有的 <code> 块视为标记元素 -->
<div
  class="code-blocks"
  data-lock-scan="code"
>
  <pre><code>...</code></pre>
</div>
```

**样式继承：**
可以直接在 `data-lock-scan` 容器上定义 `data-lock-bg` 和 `data-lock-border`，所有被扫描到的子元素都会自动继承这些样式。

```html
<!-- 容器内的所有链接都会变成红色光标 -->
<div
  data-lock-scan="a"
  data-lock-bg="rgba(255,0,0,0.2)"
  data-lock-border="1px solid red"
>
  <a href="#">Link 1</a>
  <a href="#">Link 2</a>
</div>
```

### 3.4 自定义样式配置 (Custom Styles)

可以通过 data 属性为特定标记元素配置光标吸附时的颜色和边框。

**可用属性：**

- `data-lock-bg`: 定义吸附时的背景色（CSS 值）。
- `data-lock-border`: 定义吸附时的边框（CSS 值）。

**示例：**

```html
<!-- 红色半透明光标 -->
<div
  class="lock_marked"
  data-lock-bg="rgba(255, 0, 0, 0.2)"
  data-lock-border="1px solid red"
>
  Warning Block
</div>

<!-- 无背景，仅有粗边框 -->
<button
  class="lock_marked"
  data-lock-bg="transparent"
  data-lock-border="2px solid yellow"
>
  Outline Button
</button>
```

### 3.5 元素层级与遮挡 (Z-Index Strategy)

为了确保光标背景块位于**页面背景之上**但**内容之下**，插件采用了动态层级策略：

1.  **光标跟随状态**：光标 `z-index` 为 `999`，位于页面最上层。
2.  **元素吸附状态**：
    - 光标背景块 `z-index` 设为 `0`。
    - 被吸附的标记元素（Target Element）会自动被脚本临时设置为 `position: relative` 和 `z-index: 1`（如果它原本没有更高层级）。

**注意：**
这确保了标记元素的内容（文字、图片）会浮在光标背景块之上。但如果标记元素本身有**不透明背景色**，光标背景块会被其遮挡而不可见。
因此，建议将 `.lock_marked` 元素的背景设置为透明或半透明。

## 4. 技术细节与性能优化

### 性能优化

为了确保页面核心内容的加载速度，该插件进行了以下优化：

1.  **延迟加载**：脚本会在 `app:mounted` 钩子中触发，并进一步通过 `requestIdleCallback` (或 `setTimeout` 降级) 延迟初始化，确保主线程空闲时才开始渲染光标，不影响首屏交互（TTI）。
2.  **设备检测**：插件会自动检测输入设备精度 (`pointer: coarse`)。在触摸屏设备（如手机、平板）上会自动禁用，避免无效加载。
3.  **硬件加速**：CSS 动画使用了 `will-change` 属性，提示浏览器对 `transform`, `width`, `height` 等属性进行 GPU 优化。

### DOM 结构

插件会在 `body` 下自动注入一个 `div.mouse-follower`。

```html
<div class="mouse-follower [snapped] [hidden]"></div>
```

### CSS 类名状态

- `.mouse-follower`: 基础样式（跟随鼠标的小方块，中心带点）。
- `.snapped`: 吸附状态（变为矩形，覆盖目标元素，点消失）。
- `.hidden`: 隐藏状态（当鼠标离开浏览器窗口时）。

### 样式定制

默认样式定义在插件内部的 `<style>` 标签中。核心属性如下：

- `z-index: 999`: 默认跟随状态在最上层。吸附时会自动调整。
- `pointer-events: none`: 确保不阻挡鼠标点击事件。
- `mix-blend-mode`: 可根据需求调整混合模式（目前默认样式为半透明青色）。

## 5. 开发计划 (TODO)

- [x] 基础鼠标跟随
- [x] 元素吸附逻辑
- [x] 容器锁定逻辑
- [x] 自定义样式配置

---

_文档更新日期: 2026-02-19_
