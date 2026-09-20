import type { Mermaid } from "mermaid";

/**
 * Mermaid 渲染工具。
 *
 * 在模块作用域内维护单例的 mermaid 实例、唯一图表 ID 与串行渲染队列，
 * 保证页面中存在多个图表的并发渲染不会互相干扰。
 */

/* ---------------------------------------------------------------------------
 * 主题：暗色赛博朋克
 * 主色：亮黄 #FFFF00（$cyberpunk-light-yellow）
 * 辅色：粉 #FF4080 / 黄 #FFBE0B
 * ------------------------------------------------------------------------ */
const THEME_VARIABLES = {
  darkMode: true,
  background: "transparent",

  // 通用文本与标题
  fontFamily: '"JetBrains Mono", "Noto Sans SC", "Microsoft YaHei", monospace',
  fontSize: "15px",
  textColor: "#e7fffa",
  titleColor: "#FFFF00",

  // 节点（流程/状态图）
  primaryColor: "rgba(255, 255, 0, 0.1)",
  primaryTextColor: "#e7fffa",
  primaryBorderColor: "#FFFF00",
  secondaryColor: "rgba(255, 64, 128, 0.1)",
  secondaryTextColor: "#e7fffa",
  secondaryBorderColor: "#FF4080",
  tertiaryColor: "rgba(255, 132, 0, 0.1)",
  tertiaryTextColor: "#e7fffa",
  tertiaryBorderColor: "#FFBE0B",
  mainBkg: "rgba(255, 255, 0, 0.1)",
  nodeBorder: "#FFFF00",
  nodeTextColor: "#e7fffa",

  // 连线
  lineColor: "#FF4080",
  defaultLinkColor: "#FF4080",
  arrowheadColor: "#FF4080",
  edgeLabelBackground: "rgba(10, 13, 14, 0.85)",

  // 子图（subgraph / cluster）
  clusterBkg: "rgba(255, 255, 0, 0.05)",
  clusterBorder: "rgba(255, 255, 0, 0.45)",

  // 状态图
  labelBackgroundColor: "rgba(10, 13, 14, 0.85)",

  // 甘特图（亮黄=任务 / 高亮=运行 / 橙=完成 / 粉=被抢占）
  sectionBkgColor: "rgba(255, 255, 0, 0.04)",
  sectionBkgColor2: "rgba(255, 255, 0, 0.04)",
  altSectionBkgColor: "rgba(255, 64, 128, 0.04)",
  gridColor: "rgba(255, 255, 0, 0.14)",
  taskBkgColor: "rgba(255, 255, 0, 0.45)",
  taskBorderColor: "#FFFF00",
  taskTextColor: "#0a0b0d",
  taskTextLightColor: "#e7fffa",
  taskTextDarkColor: "#0a0b0d",
  taskTextOutsideColor: "#ffe9c4",
  taskTextClickableColor: "#FFFF00",
  activeTaskBkgColor: "rgba(255, 255, 0, 0.8)",
  activeTaskBorderColor: "#FFFF00",
  doneTaskBkgColor: "rgba(255, 132, 0, 0.55)",
  doneTaskBorderColor: "#FFBE0B",
  critBkgColor: "rgba(255, 64, 128, 0.5)",
  critBorderColor: "#FF4080",
  todayLineColor: "#FFFF00",
};

let mermaidPromise: Promise<Mermaid> | null = null;
let uidCounter = 0;
let renderQueue: Promise<unknown> = Promise.resolve();

function loadMermaid(): Promise<Mermaid> {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "antiscript", // 允许 <br/> 等标签，同时过滤脚本
        theme: "base",
        themeVariables: THEME_VARIABLES,
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: "basis",
          padding: 12,
          nodeSpacing: 40,
          rankSpacing: 44,
        },
        gantt: {
          useMaxWidth: true,
          barHeight: 22,
          barGap: 5,
          topPadding: 50,
          leftPadding: 90,
          fontSize: 13,
          sectionFontSize: 14,
        },
        state: {
          useMaxWidth: true,
          nodeSpacing: 40,
          rankSpacing: 44,
        },
      });
      return mermaid;
    });
  }
  return mermaidPromise;
}

/**
 * 将一段 Mermaid 图表定义渲染为 SVG 字符串。
 *
 * 所有渲染任务在模块级队列中串行执行（对应 mermaid 官方对 render
 * 调用串行化的要求），并为每次渲染分配全局唯一 ID，避免多图并发时
 * 内部临时容器互相覆盖。
 */
export function renderMermaid(code: string): Promise<string> {
  const task = renderQueue.then(async () => {
    const mermaid = await loadMermaid();
    await mermaid.parse(code); // 预校验语法，避免 render 失败时的 DOM 残留
    const { svg } = await mermaid.render(`mermaid-diagram-${++uidCounter}`, code);
    return svg;
  });

  // 无论成功与否都继续处理队列中的后续任务
  renderQueue = task.then(
    () => undefined,
    () => undefined,
  );
  return task;
}
