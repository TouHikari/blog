---
title: 在 Vue 3 项目中前端使用 Luckysheet 遇到的若干问题及解决方法
date: 2025-08-07
tags:
  - web
  - frontend
  - vue 3
  - luckysheet
  - javaScript
  - typeScript
  - css
toc: true
---

在 Vue 3 实际项目中使用 [Luckysheet](https://github.com/dream-num/Luckysheet) 预览及修改表格时遇到了一系列问题，下文将展开讲述一路上遇到的各问题及其解决方法。

如果你正在构建新项目，建议使用 [Univer](https://github.com/dream-num/univer)，**Luckysheet 已停止维护**。

本文仅作为需要使用 Luckysheet 在其 Vue 3 项目中的前端开发者的避坑提示。**尤其是那些正在氛围编程的开发者，AI 可不会告诉你这么多 \:P。**

<!--more-->

## 前言与背景

要在前端实现一个可修改的表格并不是一件难事，然而若要让其与 Excel 那样的操作逻辑相似，势必要花好一番功夫在编写样式表和 js/ts 上。

为了简化项目构建难度和降低维护成本，可以选择使用现有的 Web 表格解决方案。**Luckysheet** 就是一个被广泛使用并得到推荐的开源项目，采用 MIT 协议，因此应用在具有商业用途的项目中不会受到太多限制。

然而，在第一次使用 Luckysheet 时可能会碰到一些问题。**以下的提到的问题，若是从项目一开始就严格按照 [Luckysheet 官方示例文档](https://dream-num.github.io/LuckysheetDocs/zh/guide/)来做，几乎不可能遇到。**

但不是所有人做任何事之前都会仔细查阅相关文档，尤其是一个已经停止支持的项目。但如果你看到了这篇文章，或许能够解开一些疑惑，我将深入讲解问题缘由。

## 部署 Luckysheet 过程中踩过的坑

在构建一个 Vue 3 项目时，如果要用到一个第三方模块，一般人的思维基本都是：先使用包管理器安装这个模块，然后直接在项目中导入使用，~~再让 AI 把代码一写~~再根据官方文档来使用模块的 API 等。

我在这个项目中使用 Luckysheet 时同样做出了这个下意识的举动。

### 通过包管理器（`npm`、`pnpm`、`yarn`）直接安装 Luckysheet

在实际 Vue 3 项目中，确实可以使用包管理器安装 Luckysheet：

::: tabs#shell

@tab npm

```bash
npm install luckysheet
```

@tab pnpm

```bash
pnpm install luckysheet
```

@tab yarn

```bash
yarn install luckysheet
```

:::

通过这样安装的 Luckysheet 不会自己带上其他几个比较重要的模块，最重要的是 `luckyexcel`，以及可选的 `exceljs` 和 `file-saver`。其中：

- [luckyexcel](https://github.com/dream-num/Luckyexcel)：是一个适配 Luckysheet 的 excel 导入导出库，只支持 .xlsx 格式文件（不支持 .xls）。
- [exceljs](https://github.com/exceljs/exceljs)：用于读取、操作并写入电子表格数据和样式到 xlsx 和 json 文件。
- [file-saver](https://github.com/eligrey/FileSaver.js/)：用于在浏览器中实现文件的本地保存，支持将 Blob、File 等数据生成下载链接并触发保存操作，常用于导出数据或生成报表等前端场景。

于是又去安装这三个依赖包：

::: tabs#shell

@tab npm

```bash
npm install luckyexcel
npm install exceljs
npm install file-saver
```

@tab pnpm

```bash
pnpm install luckyexcel
pnpm install exceljs
pnpm install file-saver
```

@tab yarn

```bash
yarn install luckyexcel
yarn install exceljs
yarn install file-saver
```

:::

::: warning

具体是否使用这些模块取决于你的实际项目，上文仅为建议。正常情况下，这三个模块的使用与否不会对 Luckysheet 的可用性高低造成影响。

:::

现在模块的安装看上去已经完成了。按理来说，现在只需要在 Vue 中导入这些模块，然后使用即可。

### 直接 import Luckysheet 并在 Vue 中使用它（非官方做法，会导致问题）

这里假设将 Luckysheet 放在一个专属的文件中，按照官方提供的很简单的[示例代码](https://dream-num.github.io/LuckysheetDocs/zh/guide/#%E7%AC%AC%E4%BA%8C%E6%AD%A5)，封装成一个组件：

```vue {2,6-14} title="components/LuckySheet.vue"
<template>
  <div id="luckysheet"></div>
</template>

<script setup>
import luckysheet from "luckysheet";

$(function () {
  // 配置项
  var options = {
    container: "luckysheet", // luckysheet 为容器 id
  };
  luckysheet.create(options);
});
</script>

<style scoped>
#luckysheet {
  margin: 0px;
  padding: 0px;
  position: absolute;
  width: 100%;
  left: 0px;
  top: 30px;
  bottom: 0px;
}
</style>
```

然后在页面中使用这个组件：

```vue {2,6} title="App.vue"
<script setup>
import LuckySheet from "./components/LuckySheet.vue";
</script>

<template>
  <LuckySheet />
</template>

<style scoped></style>
```

**然而进入网页，发现全部空白，什么都渲染不出来。这个思路看似没有问题，但是这样使用其实缺少了 Luckysheet 所需的依赖。**

打开浏览器开发者工具 `F12`，查看 `控制台`/`console` 处的输出：

```console
// [!code error:3]
Uncaught ReferenceError: $ is not defined       luckysheet.js?v=24cc6d54:9624
    at luckysheet.js?v=24cc6d54:9624:1
（匿名）	@	luckysheet.js?v=24cc6d54:9624
```

`$ is not defined` 显而易见地说明此处缺少了某种依赖，导致 `$` 没有被定义。

**所以要解决这个问题，引入依赖即可。**

### 引入 Luckysheet 所需的 js 依赖

既然 `$` 没有被定义，那么我们就引入定义了这个 `$` 的依赖。

::: note **按道理，到这里就应该好好看看官方文档了**。但是如果你直接在必应上搜索 `$ is not defined`，大概率会有许多文章提到 [`jQuery`](https://api.jquery.com/)。

**如果你认为真的是因为缺少 `jQuery` 的依赖，那么你就又成功走进另一个坑了！:D**

你很可能会尝试在 `index.html` 中引入 `jquery.min.js`、`jquery.mousewheel.js` 这些依赖，并且会发现正确引入后真的可以渲染出表格了，好像还能正常使用。但是通过引入 `jQuery` 修复的 Luckysheet 有点问题，它大概率会在 console 处输出：

```
缓存操作失败                                      luckysheet.js?v=24cc6d54:13896
```

并且这还是在刚刚那个 vue 组件中 `import luckysheet from 'luckysheet'` 后才会出现的，若是把这行删除，网页会出现一连串的错误，无法正常渲染。按照官方的推荐做法，明显是不需要 import 这个模块的。说白了，这样做是为了解决由于引入了不完整的 Luckysheet 模块而导致的问题，仍然没有真的解决问题。

这里不再提 `jQuery` 那些弯弯绕绕的了，和它没关系，或者说作为使用者不需要考虑它和 Luckysheet 之间的关系。**要解决 `$ is not defined` 的问题，只需引入 Luckysheet 自己的依赖即可**。

:::

#### 通过 CDN 引入

在项目根目录的 `index.html` 中的 `<head>` 标签内添加两个 `<script>` 标签，通过网络获取这两个 js 文件。

```html title="index.html"
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    // [!code ++:2]
    <script src="https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/plugins/js/plugin.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/luckysheet.umd.js"></script>
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

想要指定 Luckysheet 版本，在所有的 CDN 依赖文件后面加上版本号，如：`https://cdn.jsdelivr.net/npm/luckysheet@2.1.12/dist/luckysheet.umd.js`。

> 如何知道最新版本是哪一版？查看最新 [release 记录](https://github.com/mengshukeji/Luckysheet/releases)或者 [package.json](https://github.com/mengshukeji/Luckysheet/blob/master/package.json) 的 `version` 字段。

如果不方便访问 jsdelivr.net，还可以采用本地方式引入：

#### 通过本地引入

运行 `npm run build` 后将生成的 `dist` 文件夹下的所有文件复制到项目目录，然后通过相对路径引入。

在项目根目录的 `index.html` 中的 `<head>` 标签内添加两个 `<script>` 标签，通过本地引入这两个 js 文件。

```html title="index.html"
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    // [!code ++:2]
    <script src="./plugins/js/plugin.js"></script>
    <script src="./luckysheet.umd.js"></script>
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

::: tip 为什么要在 `index.html` 中引入这两个 js 文件，而不是在 `main.js/ts` 中？

1. **非模块化依赖（全局暴露的 JS 库）**

   有些 JS 库（尤其是老旧的第三方库，比如 Luckysheet 这种 UMD/全局变量暴露的库）并不通过 ESM（ES Module）、CommonJS 或 UMD 以模块方式供 `import` 使用，而是通过 `<script>` 标签注入一个全局变量。这类依赖若用 `import` 无法正常加载或初始化，所以只能直接在 `index.html` 通过 `<script>` 标签引入，确保全局对象（如 `$`）的存在。

2. **明确依赖加载顺序**

   某些 JS 依赖，如 Luckysheet 必须在 Vue 应用初始化之前被加载和执行，通过 `<script>` 标签能保证它们先于 `main.js/ts` 执行，保证全局依赖已就绪再进行框架初始化。

:::

既然是在 `index.html` 中提前引入的 js 依赖，那么实际创建 Luckysheet 的 Vue 组件中就不需要再 `import luckysheet from 'luckysheet'` 了：

```vue title="components/LuckySheet.vue"
<template>
  <div id="luckysheet"></div>
</template>

<script setup>
// [!code --:2]
import luckysheet from "luckysheet";

$(function () {
  // 配置项
  var options = {
    container: "luckysheet", // luckysheet 为容器 id
  };
  luckysheet.create(options);
});
</script>

<style scoped>
#luckysheet {
  margin: 0px;
  padding: 0px;
  position: absolute;
  width: 100%;
  left: 0px;
  top: 30px;
  bottom: 0px;
}
</style>
```

### 成功出现表格了！但是没有渲染样式或者图标丢失？

这两个问题就显得简单很多了，没有样式就说明样式没有被成功应用，没有图标就说明图标没有被成功导入。

仍然在 `index.html` 中添加代码，Luckysheet 的 js 是在这里引入的，那么其 css 也一并在这里导入。

还是分为两种方式，与上文引入 js 类似：

#### 通过 CDN 引入

在项目根目录的 `index.html` 中的 `<head>` 标签内添加四个 `<link>` 标签，通过网络获取这四个 css 文件。

```html title="index.html"
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    // [!code ++:4]
    <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/plugins/css/pluginsCss.css' />
    <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/plugins/plugins.css' />
    <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/css/luckysheet.css' />
    <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/assets/iconfont/iconfont.css' />
    <script src="https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/plugins/js/plugin.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/luckysheet.umd.js"></script>
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

#### 通过本地引入

运行 `npm run build` 后将生成的 `dist` 文件夹下的所有文件复制到项目目录，然后通过相对路径引入。

在项目根目录的 `index.html` 中的 `<head>` 标签内添加四个 `<link>` 标签，通过本地引入这四个 css 文件。

```html title="index.html"
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    // [!code ++:4]
    <link rel='stylesheet' href='./plugins/css/pluginsCss.css' />
    <link rel='stylesheet' href='./plugins/plugins.css' />
    <link rel='stylesheet' href='./css/luckysheet.css' />
    <link rel='stylesheet' href='./assets/iconfont/iconfont.css' />
    <script src="https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/plugins/js/plugin.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/luckysheet.umd.js"></script>
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

**至此，项目就能成功地正常使用 Luckysheet 了。记得在 Git 或其他版本控制系统中追踪、添加并提交新增的文件和做出的修改。**

## 最终解决方案总结

**不要直接在 Vue 中 `import luckysheet from 'luckysheet'` 来导入**，Luckysheet 不支持这种用法，会带来一系列问题。请按照下方步骤操作：

> 来自 [Luckysheet 官方文档](https://dream-num.github.io/LuckysheetDocs/zh/guide/)

### 第一步：引入依赖

#### 通过 CDN 引入

在项目根目录的 `index.html` 中的 `<head>` 标签内添加四个 `<link>` 标签和两个 `<script>` 标签，通过网络获取这六个文件。

```html title="index.html"
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    // [!code ++:6]
    <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/plugins/css/pluginsCss.css' />
    <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/plugins/plugins.css' />
    <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/css/luckysheet.css' />
    <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/assets/iconfont/iconfont.css' />
    <script src="https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/plugins/js/plugin.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/luckysheet.umd.js"></script>
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

想要指定 Luckysheet 版本，在所有的 CDN 依赖文件后面加上版本号，如：`https://cdn.jsdelivr.net/npm/luckysheet@2.1.12/dist/luckysheet.umd.js`。

> 如何知道最新版本是哪一版？查看最新 [release 记录](https://github.com/mengshukeji/Luckysheet/releases)或者 [package.json](https://github.com/mengshukeji/Luckysheet/blob/master/package.json) 的 `version` 字段。

如果不方便访问 jsdelivr.net，还可以采用本地方式引入：

#### 通过本地引入

运行 `npm run build` 后将生成的 `dist` 文件夹下的所有文件复制到项目目录，然后通过相对路径引入。

在项目根目录的 `index.html` 中的 `<head>` 标签内添加四个 `<link>` 标签和两个 `<script>` 标签，通过本地引入这六个文件。

```html title="index.html"
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    // [!code ++:6]
    <link rel='stylesheet' href='./plugins/css/pluginsCss.css' />
    <link rel='stylesheet' href='./plugins/plugins.css' />
    <link rel='stylesheet' href='./css/luckysheet.css' />
    <link rel='stylesheet' href='./assets/iconfont/iconfont.css' />
    <script src="https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/plugins/js/plugin.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/luckysheet@latest/dist/luckysheet.umd.js"></script>
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

### 第二步：指定一个表格容器

```vue {2,8-16}
<template>
  <div id="luckysheet"></div>
</template>

<script setup></script>

<style scoped>
#luckysheet {
  margin: 0px;
  padding: 0px;
  position: absolute;
  width: 100%;
  left: 0px;
  top: 30px;
  bottom: 0px;
}
</style>
```

### 第三步：创建一个表格

```vue {6-12}
<template>
  <div id="luckysheet"></div>
</template>

<script setup>
$(function () {
  // 配置项
  var options = {
    container: 'luckysheet' // luckysheet 为容器 id
  }
  luckysheet.create(options)
})
</script>

<style scoped>
#luckysheet {
  margin: 0px;
  padding: 0px;
  position: absolute;
  width: 100%;
  left: 0px;
  top: 30px;
  bottom: 0px;
}
</style>
```

**现在，就成功在页面上创建一个 Luckysheet 对象了。**

::: important 如果要使用 TypeScript

**请注意 TypeScript 的类型检查**。可通过新建 `src/types/luckysheet.d.ts` 声明文件并在 `tsconfig.json` 中添加对 `"include"` 键的 `"src/**/*.d.ts"` 值，来声明 js 文件中的类型，以跳过 TypeScript 的类型检查。

:::

## 结语

总的看来，在使用 Luckysheet 的过程中遇到的这些问题本质上都不是什么难题，通过查阅官方文档就一定能解决。

可有些时候，开发者在解决实际问题时，可能并不想着去查阅文档。相反，他们很有可能会根据自己的经验去实操，想通过积攒的经验来解决问题。这种做法，若是能成功解决倒还好，但若是走错了路，就容易陷入问题接踵而至不能解决的困境。

倒不是说不建议开发者和学习者去做实验、去搞研究，我要说的是这样的冒险精神固然可贵。可当你真的感到走投无路时，或是与 AI 共同困在一条路走到黑的茧房之中时，别忘了回头去看看文档！

**往往在文档中就会有最正确、最合适的使用方法。任何时候都不要放弃查阅文档。**