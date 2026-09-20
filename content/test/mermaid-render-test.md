---
title: Mermaid 渲染测试
date: 2026-09-21
toc: false
---

# Mermaid 渲染测试

本页面用于验证 Mermaid 图表的客户端渲染、主题配色与回退机制。

## Flowchart 流程图

```mermaid
flowchart TB
    subgraph AppLayer [应用层]
        App["ArkUI / ArkTS"]
    end

    subgraph ServiceLayer [系统服务框架]
        Service["Ability、分布式软总线等"]
    end

    subgraph KernelLayer [内核层]
        K_A["LiteOS-A 内核<br/>(IoT, 数MB RAM)<br/>优先级+时间片调度"]
        K_L["Linux 定制内核<br/>(手机/平板/PC, GB级RAM)<br/>CFS+EAS+实时调度类"]
    end

    AppLayer --> ServiceLayer
    ServiceLayer --> KernelLayer
```

## Gantt 甘特图

```mermaid
gantt
    title 固定优先级抢占式调度时序图 (H=3, M=2, L=1)
    dateFormat X
    axisFormat t%s

    section Task_H
    运行 :active, h1, 2, 4
    运行 :active, h2, 8, 9

    section Task_M
    运行 :active, m1, 4, 7

    section Task_L
    运行 :active, l1, 0, 2
    被H抢占 :crit, w1, 2, 4
    被M抢占 :crit, w2, 4, 7
    运行 :active, l2, 7, 8
    被H抢占 :crit, w3, 8, 9
    运行 :active, l3, 9, 12
```

## StateDiagram 状态机

```mermaid
stateDiagram-v2
    state "任务生命周期" as TaskLife {
        Ready : 就绪态
        Running : 运行态
        Blocked : 阻塞态
        Suspended : 挂起态

        [*] --> Ready : vTaskCreate()
        Ready --> Running : 调度器选中
        Running --> Ready : 抢占/时间片到期
        Running --> Blocked : 阻塞型API调用
        Blocked --> Ready : 事件触发/超时到期
        Running --> Suspended : vTaskSuspend()
        Suspended --> Ready : vTaskResume()
    }
    TaskLife --> Deleted : vTaskDelete() (任何状态)
    Deleted : 已删除
    Deleted --> [*] : 待空闲任务回收栈
```

## 普通代码块（回归检查）

```c
int main(void) {
    return 0;
}
```

## 内联公式完整性（回归检查）

公式：$E = mc^2$，行内代码 `luckysheet`。
