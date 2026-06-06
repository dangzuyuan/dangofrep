# 会话断点

**日期**: 2026-05-31  
**分支**: overlap-fix（当前工作分支）

---

## 本次完成

### 移动重叠检测（useDragMove）
- 新建 `overlapScanner.js` — 纯 DOM 扫描函数
- 拆分 `useDrag.js` → `useDragMove.js` / `useDragResize.js` / `useDragCreate.js`
- EventBar + data-event-id / data-is-background / isOverlapping 样式（红/蓝）
- TimeCalendar 透传 isOverlapping prop

### 坐标系 Bug 修复
- useDragMove: `scanColumnOverlap` 入参转偏移分钟（`- minMinutes`）
- useDragResize: `findNearestBar` 入参转偏移分钟（`- minMinutes` 入 / `+ minMinutes` 出）

### 文本选中修复
- useDragMove / useDragResize：mousedown 设 `userSelect: none`，所有清理路径恢复

### 拉伸松手优化
- useDragResize：`_final` 标记 → 位置保留 + 样式立即恢复
- TimeCalendar：拆分 `hasPendingResize`（位置）和 `isResizing`（样式）

### 其他
- findNearestBar 加背景事件过滤
- 移除 useDragCreate 死代码 import
- StaffColumn 去重 data-* 属性
- 移除调试 console.log

---

## 当前状态

| 功能 | 状态 |
|------|:--:|
| 移动重叠检测 + 红色预警 | ✅ |
| 拉伸边界钳制 | ✅ |
| 拖拽/拉伸防文本选中 | ✅ |
| 拉伸松手不弹回 | ✅ |
| 拉伸松手颜色立即恢复 | ✅ |
| 框选（useBoxSelect） | 已有 |

---

## 已记录问题

`story/方案设计-移动重叠检测.md` §10 — 8 类问题 + 教训

---

## 继续时

1. `git checkout overlap-fix`
2. 测试：移动/拉伸/框选 全场景验证
3. 如通过 → merge overlap-fix to master
