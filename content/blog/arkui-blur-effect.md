---
title: ArkUI 中实现模糊效果的几种方法
draft: true
date: 2026-04-18
tags:
  - arkui
  - harmonyos
  - frontend
  - blur
  - effect
description: 本文介绍了 ArkUI 中实现实时模糊效果的几种方法，以及每种方法的优缺点。
toc: true
---

模糊效果是一种常用的设计元素，用于创建类似毛玻璃的视觉效果，使内容或背景看起来更加软滑和自然。

在 ArkUI 中，有几种实现实时模糊效果的方法。本文将根据我的实际项目经验，介绍这几种方法的模糊效果及其使用方法。

<!-- more -->

为什么我会深入研究 ArkUI 中模糊效果的实现？因为我在实际项目中遇到了**渐变模糊**的需求，但是 ArkUI 中各种模糊效果的实现方式和实际表现效果都不同，我需要深入研究才能找到最合适的实现方式。~~其实尝试了一圈下来，就只有 `linearGradientBlur` 能够实现这个效果（~~

## 背景

::alert{type="info"}
来源于我在华为 Developer 社区问答的问题 [如何实现渐变毛玻璃（模糊）效果？](https://developer.huawei.com/consumer/cn/forum/topic/0203211392402945670)
::

在 ArkUI 中，使用 [`backgroundBlurStyle`](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/ts-universal-attributes-background#backgroundblurstyle9) 和 [`foregroundBlurStyle`](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/ts-universal-attributes-foreground-blur-style#foregroundblurstyle) 分别可以为组件背景、前景添加毛玻璃效果，示例代码如下：

```ts
@Entry
@Component
struct BackgroundBlurStyleDemo {
  build() {
    Column() {
      Row() {
        Text("Thin Material")
      }
      .width('50%')
      .height('50%')
      .backgroundBlurStyle(
        BlurStyle.Thin,
        {
          colorMode: ThemeColorMode.LIGHT,
          adaptiveColor: AdaptiveColor.DEFAULT,
          scale: 1.0
        })
      .position({ x: '15%', y: '30%' })
    }
    .height('100%')
    .width('100%')
    .backgroundImageSize(ImageSize.Cover)
  }
}
```

这里的 `.backgroundBlurStyle()` 为这个 `Row()` 组件添加了一层预设为 `BlurStyle.Thin` 的模糊效果，看上去就好像文字 `Text("Thin Material")` 有一层毛玻璃的衬底。

举一反三，可以使用 `.backgroundBlurStyle()` 和 `.foregroundBlurStyle()` 在任何想要的位置制作模糊效果。

### 问题

然而，这两种方法默认的作用效果都是一层均匀的模糊效果，**怎么样才能做出从完全清晰到完全模糊的渐变效果？**

在 Harmony OS 系统应用的多处，都可以发现使用了该效果，并且做成了我想要在我应用内实现的渐变效果（红框处）：

![设置应用的渐变毛玻璃](https://alliance-communityfile-drcn.dbankcdn.com/FileServer/getFile/cmtybbs/022/668/620/49BA4C5377BF4031A6642402ADFA3FF1:8B459E34B0660BA28EF705B645B42C9D586B3CFB879AD82CD6D95F4CA96775F9.20260412155135.17706596840753970636551077675990:50001231000000:2800:E272A21759F8A591FFD59D06C0DB21EF346D2A86E1E9B45D1A808D25EE58FF62.jpg)

### 尝试过的方法

我先前尝试过使用 `.opacity()`，但是使用了 `.backgroundBlurStyle()` 和 `.foregroundBlurStyle()` 的组件，无法再使用 `.opacity()` 等方法调节其透明度，并且也无从下手向它传入一套线性渐变的值：

```ts
@Entry
@Component
struct BackgroundBlurStyleDemo {
  build() {
    Column() {
      Row() {
        Text("Thin Material")
      }
      .width('50%')
      .height('50%')
      .backgroundBlurStyle(
        BlurStyle.Thin,
        {
          colorMode: ThemeColorMode.LIGHT,
          adaptiveColor: AdaptiveColor.DEFAULT,
          scale: 1.0
        })
      .opacity(0.8)     // 此处的 opacity 无法与 backgroundBlurStyle 同时生效
      .position({ x: '15%', y: '30%' })
    }
    .height('100%')
    .width('100%')
    .backgroundImageSize(ImageSize.Cover)
  }
}
```

后来又尝试退而求其次，使用支持与 `.opacity()` 共存的 `.blur()`，在需要渐变透明的地方堆叠很多层不同可见程度的模糊层，来做到粗糙的伪渐变效果。然而这样做不但看起来不太自然（有稍明显的硬边缘），而且代码实现上也不优雅，并且完全不是我想要的高级毛玻璃效果：

```ts
@Component
export struct BottomBlurGradientMask {
  @Prop maskHeight: number = 80;

  build() {
    Stack({ alignContent: Alignment.Bottom }) {
      Stack({ alignContent: Alignment.Bottom }) {
        ForEach(
          [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
            10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28, 29
          ],
          (index: number) => {
            Column()
              .width("100%")
              .height(Math.round(this.maskHeight * (index + 1) / 30))
              .opacity(index * 0.05)
              .blur(index * index * 0.005)
              .backgroundColor(Color.Transparent)
          },
          (index: number) => index.toString()
        )

        Column()
          .width("100%")
          .height("100%")
          .linearGradient({
            direction: GradientDirection.Top,
            colors: [
              ['rgba(0, 0, 0, 0.6)', 0.0],
              ['rgba(0, 0, 0, 0.0)', 0.6]
            ]
          })
      }
      .width("100%")
      .height(this.maskHeight)
    }
    .width("100%")
    .height("100%")
    .hitTestBehavior(HitTestMode.Transparent)
  }
}

```

所以，最终的问题就归结在：**如何为 `.backgroundBlurStyle()` 和 `.foregroundBlurStyle()` 增加对其模糊程度关于组件位置坐标的线性渐变效果？**
