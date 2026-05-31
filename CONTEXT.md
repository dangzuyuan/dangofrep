# 预约时间看板 — 领域术语与核心规则

**版本**: v1.0.0 | **日期**: 2026-05-30

---

## 核心规则

### R1: 解耦边界（最高优先级）

**解耦边界 = `src/timeline/` 的目录边界。**

| 区域 | 包含 | 职责 | 禁止 |
|------|------|------|------|
| **展示层** `src/timeline/` | TimeCalendar 及其子组件 | 接收组装好的数据，负责纯展示与交互回调 | 禁止 import mdye SDK 任何内容（env/config/apis/utils/api/md_emitter） |
| **业务层** `src/timeline/` 之外的所有 `src/` 代码 | hooks / loaders / utils / components / App.jsx | 从明道云接收数据、处理数据、数据合规校验、格式转换 | — |

**判定规则**：任何文件如果 `import` 了 `mdye` 包的任何导出，该文件就属于业务层，不得放入 `src/timeline/`。

### R2: 最低渲染要求

即使没有任何业务数据（无表头、无事件），TimeCalendar 也必须渲染出基本视图骨架：

| 元素 | 最低要求 | 数据来源 |
|------|----------|----------|
| 时间轴 | 必须显示 | begintime / endtime / timeInterval（App.jsx 提供默认值） |
| 网格 | 必须显示 | 行高 slotHeight / 列宽 colWidth（App.jsx 提供默认值） |
| 表头 | 无表头时显示空状态 | resources=[] 时展示层自行处理 |
| 事件 | 无事件时各列为空 | events=[] 时不渲染任何事件条 |

**App.jsx 参数默认值兜底**：beginTime→"08:00"、endTime→"23:00"、timeInterval→15（每15分钟一格）、slotHeight→30（行高px）、colWidth→72。确保 TimeCalendar 总能收到合法的时间轴配置。

**时间轴必需参数**：begintime + endtime + timeInterval + slotHeight + colWidth 缺一不可，由 env 参数配置或 App.jsx 默认值提供。

### R3: 最低业务数据要求

通过 loaders 校验后传给展示层的数据，必须满足以下最低要求，不满足的**单条记录在 loaders 中丢弃**：

| 数据类型 | 最低必填字段 | 缺失时处理 |
|----------|-------------|-----------|
| **表头（员工/房间）** | name（名称） | name 为空→丢弃该条 |
| **表头分组** | departmentName | 无分组→默认 "未分组" |
| **事件** | start（开始时间）+ (dur 或 end)（时长或结束时间）+ 对应日期 + 对应表头（员工/房间 accountId） | 任一缺失→丢弃该事件 |

### R4: adapters 职责边界

adapters.js 是业务层与展示层之间的**翻译层**，只做字段重命名和格式转换，不做业务校验、不做数据丢弃。

| 做 | 不做 |
|----|------|
| Map→Array 结构转换 | 不丢弃任何记录 |
| 字段重命名（accountId→resourceId, rowid→id） | 不调用 mdye API |
| 时间格式补全（HH:mm→HH:mm:ss） | 不判断字段是否为空 |
| start+dur→endTime 计算 | 不处理业务逻辑（匹配/过滤） |
| type→isBackground 映射 | — |
| 扁平 resources→departmentTree 分组 | — |

### R5: 中间格式（loaders → adapters 接口契约）

loaders 输出、adapters 输入的数据格式。这是业务层内部的数据契约。

**表头数据**：
```
staffMap = Map<accountId, {
  accountId: string,      // 主体唯一ID（员工rowid/房间rowid）
  name: string,           // 主体名称（员工姓名/房间名）
  departmentId: string,   // 分组ID（部门ID/楼层ID）
  departmentName: string  // 分组名称（部门名/楼层名），无分组时为"未分组"
}>
```

**事件数据**：
```
events = Array<{
  rowid: string,      // 明道云记录ID（用于编辑/删除回写）
  accountId: string,  // 对应的表头主体ID（用于 adapters 映射为 resourceId）
  start: string,      // "HH:mm" 开始时间
  dur: number,        // 时长（分钟）
  title: string,      // 显示文本
  color: string,      // 背景色 hex
  fc: string,         // 字体色 hex
  type: string        // "main" | "sub"
}>
```

**已移除字段**：`colIdx`（列索引）。解耦后列位置由展示层根据 resourceId 匹配 resources 数组自行决定，业务层不关心列索引。

### R16: 对话记录格式

每次对话追加至 `story/对话记录.md`，格式：
```
## 对话N: 简短标题

**时间**: 2026-5-30 22:34

**用户**: xxx

**AI**: xxx

**结果/决策**: xxx
```
每完成一个功能/修复一个 bug/做一个决策，必须追加记录。

### R6: 交互回写流程（dragHandler）

`dragHandler.js` 属于**业务层**（不属于 TimeCalendar），负责将 TimeCalendar 回调参数翻译为 mdye API 写入参数。

**流程**：
1. TimeCalendar 内部处理鼠标事件（拖拽/拉伸/框选），计算结果
2. TimeCalendar 调用 App.jsx 传入的回调函数，传递结果数据
3. **App.jsx 决定是否保存**（可做校验/确认/拒绝）
4. 决定保存 → 调用 dragHandler 执行翻译+写入
5. 决定拒绝 → 不调用 dragHandler，TimeCalendar 界面自动回退

**关键原则**：
- TimeCalendar 不知道 dragHandler 存在，不调用任何 mdye API
- App.jsx 是决策者，dragHandler 是执行者
- adapters 是正向翻译（读：mdye→TimeCalendar），dragHandler 是反向翻译（写：TimeCalendar→mdye）

### R8: TimeCalendar 内部调试组件生产环境不显示

`timeline/ConfigPanel.jsx`、`timeline/TestDataModal.jsx`、`timeline/Toolbar.jsx` 是 TimeCalendar 组件自带的开发调试工具，代码随组件保留在 `src/timeline/` 中，但生产环境不显示。

- App.jsx 不触发这3个组件的显示
- 最终用户只看到业务工具栏 `src/components/Toolbar.jsx`（日期导航/刷新/计数/调试开关）
- 两个 Toolbar 是完全不同的东西：`timeline/Toolbar.jsx`（开发调试入口） ≠ `components/Toolbar.jsx`（业务工具栏）

### R9: 事件重叠布局由展示层处理

事件重叠时的宽度缩进布局是纯 UI 逻辑，由 TimeCalendar 内部处理（已实现）。业务层**不传** `eventLayoutsMap`，**不调用** `eventLayout.js`。

- `eventLayout.js` 随 TimeCalendar 保留，但业务层不 import
- 业务层只负责按 R3/R4/R5 定义的规则过滤和翻译数据，不关心展示布局

### R10: onEventDelete 不接入

dragHandler.js 中的 `onEventDelete` 保留为预留代码，但 App.jsx 不传给 TimeCalendar。用户通过点击事件条（`onEventClick` → `utils.openRecordInfo`）打开记录详情弹窗，在弹窗内执行删除。

### R11: beta2 旧组件/旧加载器全部废弃

以下 beta2 文件新版不迁移：BookingBar.jsx、ScheduleBar.jsx、bookingLoader.js、src/EventBar.jsx、src/operateLoader.js、src/scheduleLoader.js。功能已被 TimeCalendar 内部 EventBar + 三链 loaders 覆盖。

### R12: COLOR_PALETTE 统一到 constants.js

CSS 变量回退调色板（12色）仅在 `constants.js` 中定义为 `COLOR_PALETTE`，`parseField.js` 通过 `import { COLOR_PALETTE as CP } from "./constants"` 导入使用。不再在 parseField.js 或 helpers.js 中重复定义。

用途：明道云下拉选项的 `options[].color` 可能是 CSS 变量（如 `var(--color-text-primary)`），inline style 无法渲染。`safeColor()` 检测到 CSS 变量时回退到此调色板取替代颜色。

### R13: DebugPanel 保留，默认隐藏

`components/DebugPanel.jsx` 在生产环境保留，默认 `showDebug=false` 不显示。业务工具栏上保留调试开关按钮，用户点击后展开日志面板。用于部署后排查数据加载问题。

### R14: 移动端适配由业务层决定尺寸

App.jsx 监听窗口大小和 env 参数（forceMobile/colwidth），算出 colWidth/axisWidth/slotHeight 数值，作为 props 传入 TimeCalendar。TimeCalendar 不内置响应式逻辑，只按收到的数值渲染。业务工具栏的精简布局由 `components/Toolbar.jsx` 自行根据 isMobile 切换。

### R15: eventAssembler.js 保留但不使用

`参考/timecalendar/utils/eventAssembler.js` 随 TimeCalendar 组件一同保留在 `src/utils/` 目录中，但**当前架构不调用**。原因：其功能（ISO时间转换、日期过滤、范围裁剪）已被 loaders + adapters + TimeCalendar 内部渲染逻辑覆盖。

- App.jsx **不 import** eventAssembler
- 任何 loader / adapter **不 import** eventAssembler
- 仅作为 TimeCalendar 组件配套文件保留，供未来非明道云数据源场景备用

### R16: 对话记录格式

每次对话追加至 `story/对话记录.md`，格式：`## 对话N: 标题` + `**时间**: YYYY-M-D HH:MM` + 用户/AI/结果。

### R17: 编辑安全 —— 替换块必须包含所有被依赖变量

**事故1**: 用 `edit` 替换代码块时，没有将块内声明的变量（如 `var allControls`、`var explicitIds`）包含在新代码中 → 运行时 ReferenceError，弹窗消失。

**事故2**: 重构 `getDefaultValue` 时，删除了 `var ds` 变量声明，但通用分支 `if (ds) return ...` 仍引用旧变量名 → API 写入值变成 `undefined` → 弹窗消失。

**规则**: 
1. **删除变量声明前，先 grep 全文件**确认所有引用位置
2. **删除后必须同时更新**所有引用点（grep `"变量名"` → 逐处改为新名或删除）
3. **编辑后立即 `node --check` 验证语法**
4. 替换代码块时，新块中必须包含旧块的所有被依赖变量声明

```
❌ 删除 var ds = ... → grep 发现 5 处引用未更新 → 运行时静默失败
✅ 先 grep → 逐处改为 getFirstDS() → 删声明 → node --check 验证
```

```
❌ 错误: 替换 "var allControls = ...; var explicitIds = ...; for(...)" 为 "// 诊断; for(...)" → 漏了变量声明 → ReferenceError
✅ 正确: 替换时保留变量声明行
```

---

## 术语表

| 术语 | 定义 | 反例/易混淆 |
|------|------|-------------|
| **展示层** | `src/timeline/` 目录下的所有代码。只接收标准格式的 props（resources/events/departmentTree），只通过回调通知交互事件，不知道数据来自明道云 | ≠ 整个前端 UI |
| **业务层** | `src/timeline/` 之外的所有 `src/` 代码。负责明道云 API 调用、env 参数解析、字段值提取、数据合规校验、格式转换 | ≠ 仅后端逻辑 |
| **适配器** | `utils/adapters.js`，属于业务层。将 mdye 内部数据格式（staffMap/rawEvents）转换为展示层标准 Props 格式 | ≠ 展示层的一部分 |
| **三链架构** | 数据加载的三条独立链路：链1-表头（员工/房间）、链2-附属事件（排班）、链3-主事件（预约）。各链独立 try/catch，失败不阻断其他链 | — |
| **标准格式** | TimeCalendar 组件接收的数据格式：Resource `{id, accountId, name, departmentId, departmentName}`、Event `{id, resourceId, startTime:"HH:mm:ss", endTime:"HH:mm:ss", title, color, isBackground}`、Department `{id, name, children}` | ≠ mdye 原始记录格式 |
