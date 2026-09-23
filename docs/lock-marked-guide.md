# Lock Marked (鼠标跟随与吸附系统) 技术文档

`Lock Marked` 是一个基于 Nuxt 4 的鼠标交互增强插件，旨在为网页提供类似 "磁力吸附" 的鼠标跟随效果。

当用户将鼠标移动到特定标记的元素上时，一个半透明的背景块会平滑地过渡并吸附到该元素上，提供强烈的视觉反馈。

## 1. 核心功能

- **鼠标跟随**：在空白区域，显示为一个即时跟随鼠标的小方块，中心带有一个高亮圆点（光标）。
- **元素吸附**：当鼠标悬停在“标记元素”上时，光标会以 0.2s 磁力滑动过渡变形、放大并覆盖该元素，中心圆点消失。
- **容器锁定**：在指定的“父容器”内，光标会保持吸附状态，直到鼠标移出容器或移动到另一个标记元素上。

## 2. 安装与启用

该功能作为 Nuxt 插件集成，文件位于 `app/plugins/mouse-follower.client.ts`。
只要项目运行在客户端（浏览器环境）、设备支持精细指针（鼠标），且用户未开启系统「减少动态效果」偏好（`prefers-reduced-motion`），插件会自动加载并生效——效果只提供完整形态；偏好命中时整体禁用（不做降级处理）。

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

**健壮性：** 扫描选择器会在首次使用时校验并缓存；若非法（如手误写成 `:not(`），该容器会被自动跳过，不会中断插件。

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

1.  **光标跟随状态**：光标 `z-index` 为 `1999`，位于页面最上层。
2.  **元素吸附状态**：
    - 光标背景块 `z-index` 设为 `0`。
    - 被吸附的标记元素会在**首次吸附时**被打上 `data-lock-elevated` 属性并保持，由样式表规则提升层级：`position: static` 的元素补 `position: relative` + `z-index: 1`；已有定位但 `z-index` 为 `auto/0` 的元素仅补 `z-index: 1`。
    - 已经是高层级（`z-index >= 1`）的定位元素会被直接跳过，插件不干预其既有层级设计。

**为什么是「首次提升并保持」而非「离开时还原」：**
层级提升会改变元素的层叠上下文与文本抗锯齿渲染路径，反复增删会产生肉眼可见的字重闪烁（详见文章《记一次前端“玄学”问题》）。首次提升后保持，使每个元素在整个会话中至多经历一次渲染路径切换；同时以属性打标替代内联样式写入，也避免了覆盖组件自身的 `:hover` 级联设计。

**注意：**
这确保了标记元素的内容（文字、图片）会浮在光标背景块之上。但如果标记元素本身有**不透明背景色**，光标背景块会被其遮挡而不可见。
因此，建议将 `.lock_marked` 元素的背景设置为透明或半透明。

## 4. 技术细节与性能优化

### 性能优化

为了确保页面核心内容的加载速度与交互流畅度，该插件进行了以下优化：

1.  **延迟加载**：脚本会在 `app:mounted` 钩子中触发，并进一步通过 `requestIdleCallback`（带 `timeout` 兜底，或 `setTimeout` 降级）延迟初始化，确保主线程空闲时才开始渲染光标，不影响首屏交互（TTI）。
2.  **设备与偏好检测**：自动检测输入设备精度（`pointer: coarse`）与系统「减少动态效果」偏好（`prefers-reduced-motion: reduce`），命中时整体禁用（效果不提供降级形态）。
3.  **事件驱动渲染**：无每帧轮询——仅在状态可能变化时通过 `scheduleUpdate` 请求帧（rAF 去重），鼠标静止时零帧执行。
4.  **事件职责分离**：`mousemove` 仅记录坐标与调度（被动监听），DOM 命中判定（`closest` 查询）交由 `mouseover` 在元素边界跨越时执行。
5.  **吸附态零冗余写入**：吸附稳定后不再写入任何样式，吸附滑动动画不会被后续鼠标事件打断（这是「磁力滑动」质感的关键）。
6.  **合成器定位**：光标位置通过 `transform: translate3d()` 写入（`will-change: transform`），避开 `top/left` 布局路径。
7.  **失效源完备**：矩形缓存由「目标切换 / 滚动 / 缩放 / `ResizeObserver`（目标尺寸变化，如字体晚到、计时器宽度变化）」驱动失效，而非每帧重读。
8.  **瞬时贴合**：滑入完成后（约 250ms）光标切换为「即时贴合」模式，滚动跟随不再有过渡滞后。
9.  **回收过渡**：离开吸附时，位置与尺寸同步 0.2s 平滑收回（从元素处滑回鼠标，避免形状瞬移）；过渡结束后自动恢复即时跟手。

### DOM 结构

插件会在 `body` 下自动注入一个 `div.mouse-follower`（初始带 `hidden` 类，首个指针活动后显示）。

```html
<div class="mouse-follower [snapped] [settled] [releasing] [hidden]" aria-hidden="true"></div>
```

定位由 `transform: translate3d(x, y, 0)` 负责：跟随态偏移 `-10px`（方块中心对齐鼠标），吸附态对齐目标元素左上角。

### CSS 类名状态

- `.mouse-follower`: 基础样式（跟随鼠标的小方块，中心带点；位置即时跟手）。
- `.snapped`: 吸附状态（磁力滑动至目标元素，点消失）。
- `.settled`: 滑入完成状态（矩形更新即时贴合，滚动跟随无滞后）。
- `.releasing`: 回收过渡状态（离开吸附时位置与尺寸同步平滑收回）。
- `.hidden`: 隐藏状态（初始未活动 / 鼠标离开浏览器窗口时）。

### 样式定制

默认样式定义在插件内部的 `<style>` 标签中（以 `textContent` 注入，元素 id 为 `mouse-follower-style`）。核心属性如下：

- `z-index: 1999 / 0`: 跟随态在最上层，吸附态降至内容之下（配合 `data-lock-elevated` 提升目标）。
- `pointer-events: none`: 确保不阻挡鼠标点击事件。
- 配色：默认半透明青色背景（`rgba(0, 255, 255, 0.1)`）+ 青色边框；吸附态经 `--mf-bg-snapped` / `--mf-border-snapped` 控制（对应 `data-lock-bg` / `data-lock-border` 逐元素覆盖），跟随态可用 `--mf-bg` / `--mf-border` 覆盖。

## 5. 开发计划 (TODO)

- [x] 基础鼠标跟随
- [x] 元素吸附逻辑
- [x] 容器锁定逻辑
- [x] 自定义样式配置
- [x] 事件驱动重构（按需帧调度 + DOM 查询瘦身 + 缓存失效完备）
- [x] 动画通道分离（吸附滑动完整播放 + 滑入后滚动即时贴合）
- [x] 健壮性与无障碍（`prefers-reduced-motion`、扫描选择器防御、导航状态复位、HMR 幂等）

---

_文档更新日期: 2026-09-23_
