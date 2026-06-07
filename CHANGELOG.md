# CHANGELOG

## 2026-06-07

- 移动端触屏创建降低灵敏度：长按500ms + 移动10px取消防误触
- 明道云刷新视图后保留工具栏日期（sessionStorage持久化currentDate）
- 更新设计方案文档与SESSION接续笔记

# 完整对话记录

**项目**: 预约时间看板架构解耦重构  
**开始时间**: 2026-05-30

---

## 对话1: 启动工作流 — 设计阶段

**用户**: 按工作流，设计：D:\AI\项目源码\明道云插件开发\预约看板\预约看板新版（视图展示解耦）\story\初始需求.md

**AI**: 识别为全流程模式（设计→审查→修改→验证→提交），启动阶段0设计Agent。读取了项目结构、参考代码、beta2源码、STANDARD.md、TimeCalendar组件调用规则等全部参考文件。启动设计Agent生成设计文档。

**结果**: 设计文档保存至 story/设计文档.md（591行），包含5层架构、16个迁移模块、14处代码重复消除、4阶段14步实施计划、8个待确认问题。

---

## 对话2: 启动审查

**用户**: 审查

**AI**: 启动阶段1审查Agent，对设计文档与参考代码/beta2代码进行very thorough级别审查。

**结果**: 审查报告保存至 story/审查报告.md，发现10个问题（1高/5中/4低）+ 8个设计偏离 + 17个遗漏。关键问题：TimeCalendar回调签名不准确、adaptEvents时间格式不统一、遗漏beta2过期文件清单等。

---

## 对话3: 执行修改

**用户**: 修改

**AI**: 启动阶段2修改Agent，按审查报告逐条修复设计文档。

**结果**: 12/12条全部修复。设计文档从591行更新至635行。修复内容包括：回调签名更新、时间格式标注、参数解析补充、废弃文件清单扩展等。

---

## 对话4: 启动盘问会话

**用户**: 为了明确是否你清楚了全部需求，确认你的方案是否全部合理，下面按这个方式进行明确 D:\AI\skills\my skill\grill-with-docs\SKILL.md

**AI**: 加载 Grill with Docs 技能，启动盘问会话。项目中无 CONTEXT.md 和 ADR，惰性创建。

---

## 对话5: Q1 — 解耦边界

**AI提问**: "解耦"的边界到底在哪条线？推荐：解耦边界 = src/timeline/ 的目录边界，timeline/ 内永远不 import mdye SDK。

**用户**: 是的，TimeCalendar 组件只是接收组装好的数据，负责展示，所有的从明道云接收数据，处理数据，数据合规校验，都是在TimeCalendar 组件之外做，因此要根据这个要求，及明道云数据处理的方式，明确解耦的定义，在方案上，要明确，不能有异议

**决策**: 写入 CONTEXT.md R1（解耦边界）

---

## 对话6: Q2 — 数据合规校验分工

**AI提问**: 三处校验（loaders/adapters/App.jsx）是否应有明确分工？推荐：loaders→数据完整性校验，adapters→格式转换，App.jsx→参数默认值兜底。

**用户回答（3个要点）**:
1. 不管输入参数有哪些，基本视图架构要有显示，时间轴要有 begintime、endtime、timeInterval、行高、列宽等，但没有业务数据（表头、事件等）
2. 表头要有最基本数据（员工/房间名），无分组默认"未分组"；事件要有开始时间、时长或结束时间、对应日期和表头
3. adapters.js (adaptEvents) 不明白是什么，是时区吗，请明确

**AI回应**: adapters 不是时区处理，是字段重命名+格式转换的翻译层（accountId→resourceId, HH:mm→HH:mm:ss, dur→endTime计算, Map→Array, 扁平→树形分组）。

**决策**: 写入 CONTEXT.md R2（最低渲染要求）、R3（最低业务数据要求）

---

## 对话7: Q3 — adapters 是否保留

**AI提问**: adapters.js 翻译层是否有必要单独存在？方案A保留 vs 方案B合并到loaders。推荐方案A。

**用户**: A

**决策**: 写入 CONTEXT.md R4（adapters 职责边界）

---

## 对话8: Q4 — 中间格式与 colIdx

**AI提问**: loaders 输出的中间格式需要正式定义吗？colIdx 是旧架构遗留物，在解耦架构下无意义，是否移除？

**用户**: 好，移除

**决策**: 写入 CONTEXT.md R5（中间格式契约），colIdx 正式移除

---

## 对话9: Q5 — eventAssembler.js

**AI提问**: eventAssembler.js 的功能已被 loaders+adapters+TimeCalendar 覆盖，是否需要？推荐不需要。

**用户追问**: 这是不是需要修改 timecalendar 组件中内容，如果存在 eventAssembler.js，会有什么影响

**AI回应**: TimeCalendar 内部不 import eventAssembler.js（grep 验证），移除或保留都不影响 TimeCalendar。保留的话只是业务层多一个可选预处理步骤，但会造成"数据在哪层处理"的歧义。

**用户**: 保留，但要记录，此组件 eventAssembler 不使用

**决策**: 写入 CONTEXT.md R9（保留但不使用）

---

## 对话10: Q6 — dragHandler 归属与回写流程

**AI提问**: dragHandler 做反向翻译（TimeCalendar回调→mdye API写入），属于哪一层？用户希望业务层决定 onSave。

**用户追问**: dragHandler 这是 TimeCalendar 组件的功能，还是 beta2 的功能？如果是 beta2 的，不修改 TimeCalendar，你来定。

**AI回应**: grep 验证 dragHandler 100% 是 beta2 业务层代码，TimeCalendar 内部零引用。

**决定**: 保持 dragHandler 结构不变，App.jsx 在传回调给 TimeCalendar 前包一层业务判断。流程：TimeCalendar回调 → App.jsx业务判断 → 同意则调dragHandler → 写入mdye。

**决策**: 写入 CONTEXT.md R6（交互回写流程）

---

## 对话11: Q7 — eventLayout.js 预计算

**AI提问**: 事件重叠布局由业务层预算（传 eventLayoutsMap）还是展示层自己算？推荐方案A展示层自己算。

**用户**: 重叠，是由展示层处理，已做好的方案，如何重叠，就宽度缩进处理，因此要传入到展示层，业务层只按前面定的过滤数据。另外，如何我把们对话都能自动的记录下来。

**决策**: 写入 CONTEXT.md R8（事件重叠布局由展示层处理）

---

## 对话12: Q8 — TimeCalendar 内部组件（ConfigPanel/TestDataModal/内部Toolbar）

**AI提问**: TimeCalendar 自带的 ConfigPanel、TestDataModal、内部Toolbar 是开发调试工具，生产环境是否显示？推荐不显示。

**用户**: 不是盘问记录，是对话记录，是所有的对话记录，并且每次都自动的记录，不需要再提醒。时间轴的 begintime/endtime/slotHeight，应该还有一个时间间隔，即从9:00到23:00，每15分钟一格，行高为30，这些参数是需要的。

**状态**: 用户确认时间轴参数（begintime/endtime/timeInterval/slotHeight）是必须的。Q8 关于 ConfigPanel/TestDataModal/内部Toolbar 在生产环境是否显示的问题待继续确认。

---

## 对话13: Q8 — TimeCalendar 内部调试组件

**AI提问**: ConfigPanel/TestDataModal/内部Toolbar 是开发调试工具，生产环境是否显示？推荐不显示。

**用户**: 同意

**决策**: → CONTEXT.md R8（调试组件生产环境不显示）

---

## 对话14: Q9 — onEventDelete

**AI提问**: dragHandler 已实现 onEventDelete 但 TimeCalendar 无此回调 prop，是否接入？推荐暂不接入。

**用户**: 不接入

**决策**: → CONTEXT.md R10（onEventDelete 不接入）

---

## 对话15: Q10 — beta2 旧组件/旧加载器

**AI提问**: BookingBar/ScheduleBar/bookingLoader/operateLoader/scheduleLoader 等未使用的 beta2 旧文件是否全部废弃？推荐全部废弃。

**用户**: 同意

**决策**: → CONTEXT.md R11（旧组件旧加载器全部废弃）

---

## 对话16: Q11 — COLOR_PALETTE/CP 统一

**AI提问**: 12色兜底调色板在三处重复定义，是否统一到 constants.js？

**用户追问**: COLOR_PALETTE 是做什么用的，颜色是由环境参数输入的，如背景、字段颜色等。

**AI回应**: COLOR_PALETTE 不是主颜色来源，是 CSS 变量回退兜底。明道云下拉选项的 color 可能是 CSS 变量（如 `var(--color-text-primary)`），inline style 无法渲染，safeColor() 检测到 CSS 变量时回退到此调色板取替代颜色。

**用户**: 同意统一到 constants.js

**决策**: → CONTEXT.md R12（COLOR_PALETTE 统一到 constants.js）

---

## 对话17: Q12 — DebugPanel 生产环境

**AI提问**: DebugPanel 生产环境是否保留？推荐保留，默认隐藏，工具栏保留调试按钮。

**用户**: 同意

**决策**: → CONTEXT.md R13（DebugPanel 保留默认隐藏）

---

## 对话18: Q13 — 移动端适配

**AI提问**: 移动端适配逻辑（列宽/行高/时间轴宽随屏幕调整）属于哪一层？

**用户追问**: 这个移动端适配不应该是显示层的功能吗？显示层没有这个功能，不太懂，明确一下。

**AI回应**: 分两部分——App.jsx（业务层）算出尺寸数值传入，TimeCalendar（展示层）按收到的数值渲染。TimeCalendar 不内置响应式逻辑，是纯受控组件。维持现状不改 TimeCalendar。

**用户**: A（维持现状）

**决策**: → CONTEXT.md R14（移动端适配由业务层决定尺寸）

---

## 盘问总结

设计文档全部8个待确认项 + 审查报告的关键问题均已决策，共产出 CONTEXT.md 15条规则（R1-R15）。

---

## 对话19: 关于"验证"与实施方式

**用户**: 验证是做什么工作，我需要在开发时，一步一步的做，如环境变量，读表头，读事件，读背景事件，具体功能，等，如一个详细的任务清单，每次展示做了哪些，验证没有问题

**AI回应**: 工作流的"验证"只是构建检查，不是用户需要的。用户需要的是逐步开发、逐步验证的详细实施清单。基于设计文档和 CONTEXT.md 的15条规则，拆出4阶段17步的实施清单，每步都有明确的验证标准。

**结果**: 实施清单保存至 story/实施清单.md，包含：
- P0 基础设施（Step 1-4）：目录结构、复制TimeCalendar、工具函数、空数据骨架
- P1 数据层（Step 5-9）：env参数读取、链1表头、链3主事件、链2附属事件、三链合并
- P2 交互层（Step 10-12）：点击详情、拖拽移动、拉伸+框选新建
- P3 辅助功能（Step 13-15）：工具栏、调试面板+自动刷新、移动端适配
- P4 收尾（Step 16-17）：全局检查、功能回归测试

---

## 对话20: 开始实施 Step 1

**用户**: 好（确认从 Step 1 开始）

**AI执行**: 创建目录结构：
- `src/timeline/hooks/` ✅
- `src/hooks/` ✅
- `src/loaders/` ✅
- `src/components/` ✅
- `src/utils/` ✅

**验证结果**:
```
src/
  App.js           ← 原有
  components/      ✅ 新建
  hooks/           ✅ 新建
  icon.svg         ← 原有
  index.js         ← 原有
  loaders/         ✅ 新建
  style.less       ← 原有
  timeline/        ✅ 新建
    hooks/         ✅ 新建
  utils/           ✅ 新建
```

**状态**: Step 1 完成，待用户确认

---

## 对话21: Step 2 — 复制 TimeCalendar 展示层

**用户**: 好（确认 Step 1，继续 Step 2）

**AI执行**:
- 复制 `参考/timecalendar/timeline/` → `src/timeline/`（9个文件 + hooks/useDrag.js）
- 复制 `参考/timecalendar/utils/` → `src/utils/`（eventAssembler.js、eventLayout.js、testData.js）

**验证结果**:
- src/timeline/: 10个条目（9文件+1目录） ✅
- src/timeline/hooks/useDrag.js ✅
- src/utils/: 3个文件 ✅
- R1检查: grep `import.*mdye` in src/timeline/ → 0匹配 ✅

**状态**: Step 2 完成

---

## 对话22: Step 3 — 搭建工具函数（去重统一）

**用户**: 继续

**AI执行**:
- 从 beta2 复制 `constants.js`（含 COLOR_PALETTE，190行）
- 从 beta2 复制 `parseParam.js`（5个导出：parseParam/resolveWorksheet/getRelationOpenView/getViews/paramText）
- 从 beta2 复制 `mdyeApi.js`（3个导出：getControls/getFilteredRows/buildDateFilter）
- 新写 `parseField.js`（R12: CP 改为 `import { COLOR_PALETTE as CP } from "./constants"`，6个导出）

**验证结果**:
- src/utils/ 共7个文件（4个工具函数 + 3个Step2的文件） ✅
- parseField.js 第1行: `import { COLOR_PALETTE as CP } from "./constants"` ✅ (R12)
- grep `helpers` in src/ → 0匹配 ✅（无 helpers.js 残留引用）

**状态**: Step 3 完成

---

## 对话23: Step 4 — 最小可运行骨架

**用户**: 好（确认 Step 3，继续 Step 4）

**AI执行**:
- 创建 `src/App.jsx`：导入 TimeCalendar + constants，传入空数据 + 默认时间轴参数
- 删除旧版 `src/App.js`（mdye 模板文件）
- 更新 `src/index.js`：`import App from "./App.jsx"`

**App.jsx 配置**:
- begintime="08:00", endtime="23:00", timejiange=15, slotHeight=30（R2）
- colWidth=72, axisWidth=80
- resources=[], events=[], departmentTree=[]（空数据）

**待用户验证**: 运行 `mdye dev`，页面应显示空的时间轴骨架（08:00-23:00，每15分钟一格，有网格线，无表头，无事件）

**状态**: Step 4 代码完成，待运行验证

---

## 对话24: Step 5 — env 参数读取与解析

**用户**: 继续

**AI执行**: 更新 App.jsx，添加 env 参数读取：
- 导入 `env` from `mdye`
- 时间轴参数：beginTime/endTime/timeInterval + 默认值兜底
- showstyle 归一化：下拉值 `["key"]` → 判断含"区间" → timeFormat='range'/'single'
- 响应式：forceMobile + window.resize → colWidth(72/56) + axisWidth(80/60)
- UI参数：rowHeader/columnHeader + 默认值
- console.log 输出解析结果和 env 原始值

**App.jsx 参数映射**:
| env 参数 | 解析后变量 | 默认值 | 传给 TimeCalendar |
|----------|-----------|--------|-------------------|
| beginTime | begintime | "08:00" | begintime |
| endTime | endtime | "23:00" | endtime |
| timeInterval | timejiange | 15 | timejiange |
| showstyle | timeFormat | "single" | timeFormat |
| rowHeader | rowHeader | "人员" | rowHeader |
| columnHeader | columnHeader | "时间" | columnHeader |
| forceMobile | isMobile | false | → colWidth/axisWidth |

**验证**: `mdye dev` 启动，浏览器控制台应显示【环境参数】和【env 原始值】日志，时间轴参数应与明道云插件配置一致

**状态**: Step 5 完成

---

## 对话25: Step 5.5 — 完整业务工具栏

**用户**: 没有工具栏，工具栏是哪个模块负责的？方案A（业务层）还是集成到TimeCalendar？先把完整的工具栏做好。

**AI**: 方案A（业务层 `src/components/Toolbar.jsx`），理由：工具栏内容是业务概念，不修改TimeCalendar（R1）。

**AI执行**:
- 从 beta2 复制 `components/Toolbar.jsx`（174行，含桌面端+移动端布局）
- 更新 App.jsx：添加 currentDate/showDebug/refreshKey 状态，集成 Toolbar

**Toolbar 功能清单**:
- 日期导航：< 前一天 | 日期选择器 | 后一天 > | 今天
- 刷新按钮 🔄
- 计数显示：人员:N | 主事件:N（当前传0，Step 6+连接真实数据）
- 调试开关：显示/隐藏日志
- 移动端精简布局（R14）

**验证**: Toolbar 无 mdye 依赖 ✅，日期导航功能可用，点击前一天/后一天/今天可切换日期

**决策**: → CONTEXT.md R14 补充确认（工具栏属于业务层）

---

## 对话26: Step 6 — 链1 表头加载

**用户**: 好（确认 Step 5.5）

**AI执行**: 创建3个文件 + 更新 App.jsx：
- `src/loaders/headerLoader.js` ← beta2 迁移（链1：解析 headerDisplayField → resolveWorksheet → getControls → getFilteredRows → parseField → staffMap）
- `src/utils/adapters.js` ← 新建（R4：adaptResources + adaptEvents + buildDepartmentTree + adaptTableViewData）
- `src/hooks/useDataLoader.js` ← 新建最小版（仅链1，解析 header 参数 → loadHeaderStaff → 返回 staffMap）
- `src/App.jsx` ← 更新（集成 useDataLoader + adaptTableViewData → 真实数据传入 TimeCalendar + Toolbar 计数）

**数据流**:
```
env.headerDisplayField → parseParam → resolveWorksheet → getFilteredRows
  → parseField → staffMap (R5中间格式)
  → adaptResources → resources[] (标准格式)
  → buildDepartmentTree → departmentTree[]
  → TimeCalendar 渲染表头列
```

**验证**: import 路径全部正确 ✅，headerLoader→../utils/* ✅，useDataLoader→../loaders/* ✅

**待用户验证**: mdye dev → 页面应显示表头列（人员/房间名称），按部门分组排列，Toolbar 显示正确的人员计数

---

## 对话27: Step 7 — 链3 主事件加载

**用户**: 确认（Step 6）

**AI执行**:
- 创建 `src/loaders/mainEventLoader.js` ← beta2 迁移，**已移除 colIdx（R5）**
- 更新 `src/hooks/useDataLoader.js` ← 添加链3：解析8个主事件参数 → loadMainEvents → mainStaffMap 合并

**R5 验证**: grep colIdx in mainEventLoader.js → 0匹配 ✅
**Import 路径**: mdye ✅, ../utils/parseField ✅, ../utils/mdyeApi ✅

**数据流**:
```
env.mainEventDateField → parseParam → buildDateFilter → getFilteredRows
  → extractTime + parseField → events (R5中间格式，无colIdx)
  → adaptEvents → TimeCalendar events (标准格式，resourceId匹配)
```

**待用户验证**: mdye dev → 主事件条应出现在对应人员/房间列的正确时间位置，颜色与明道云下拉选项一致

---

## 对话28-30: Step 7 验证 — 事件显示问题排查与修复

**问题1**: 事件 title 显示 "云wftc45" 不正确
- 添加诊断日志排查 → 用户发现是自己配置了两个同名字段，配置修正后 title 正确

**问题2**: 颜色值 "#1677ffff" 8位hex
- 修复 `parseField.js` 的 `safeColor()`：增加 8位hex 截断为 7位 ✅

**问题3**: 事件条字体颜色不正确
- 根因：TimeCalendar 的 EventBar 文字颜色硬编码白色，无自定义字体颜色输入
- 修复：
  - `EventBar.jsx` 第155行：span 添加 `color: ev.fontColor || '#fff'`（展示层唯一修改）
  - `adapters.js`：添加 `fontColor: ev.fc || "#fff"` 映射
- 创建 `src/timeline/修改记录.md` 记录展示层修改
- 文件对比验证：展示层仅 EventBar.jsx 一处 DIFF，其余8个文件 MD5 一致 ✅

---

## 对话31-34: 颜色问题深度排查

**用户反馈**: #757575/#515151 显示蓝色，#ffffff 显示红色

**根因确认**: 
- bgField options: 4 个选项，其中 1 个 CSS 变量 `var(--color-text-primary)`
- fontField options: 7 个选项，其中 3 个 CSS 变量（0/3/4）、2 个 8位hex（1/6）、2 个正常hex（2/5）
- parseParam 解析正确，参数传递正确
- 这是明道云平台限制，不是代码问题
- 要完全匹配配色须在明道云后台改用自定义 hex



---

## 对话35-48: 点击打开详情 — 长时间排错

**问题**: 点击事件条无法打开明道云详情，各种尝试均失败

**排查过程**:
- Step10-12: 集成 dragHandler、wire up onEventClick → 不工作
- App.jsx 漏解构 `controlsRef` → 修复 → 仍不工作
- EventBar 的 onClick 依赖 mouseDownPos，但 useDragMove.handleMouseDown 的 e.preventDefault() 阻止浏览器生成 click 事件（HTML 规范）
- 移除 useDrag.js 3处 preventDefault → 仍不工作
- 改为 onMouseUp 检测点击 → MOUSEUP-click 可以打印但不触发回调
- 原生 DOM click 监听、React onMouseUp 全部无法触发
- Test Button 直接调用 utils.openRecordInfo → 可以打开详情 ✅ → 证明问题不在 mdye SDK
- 发现 RAF state 更新会替换 DOM 影响 click 生成
- 各种尝试后最终怀疑：拖拽 div 覆盖整个 Bar，zIndex 更高，拦截所有事件

**用户**: 参考 qoder 写的报告 D:\AI\项目源码\明道云插件开发\time视图\docs\点击事件问题检查报告.md

**AI 读取**: qoder 报告确认根因——useDragMove 的 e.preventDefault() 阻止 click。推荐方案A：onMouseUp + isDraggingRef

**用户**: 还是不行，参考 beta1 D:\AI\项目源码\明道云插件开发\预约看板\正式版beta1

**AI 分析**: beta1 不用独立的 TimeCalendar 组件，用本地 EventBar + 独立 drag 模块。beta1 EventBar 的 drag 手柄不覆盖 Bar，文字在顶层有 `pointerEvents: none`

---

## 对话49: 方案A — zIndex 调整（最终修复）

**AI 分析**: 新版 EventBar 的拖拽 div `zIndex:3` 高于文字 span `zIndex:2`，覆盖整个 Bar 导致所有事件被拦截

**用户**: 方案A如何修改，改哪些内容，影响，风险

**AI 回复**: 仅改 2 行 zIndex：
- drag div: 3→1
- span: 2→5
- 原理：文字穿透(pointerEvents:none) → 拖拽 div 处理 mousedown → click 冒泡到 Bar

**用户**: 好，做好备份，修改，测试

**AI 执行**:
- 备份 EventBar.jsx.bak-20260530-v3
- L148: drag div zIndex 3→1
- L162: span zIndex 2→5
- 更新修改记录（修改5）

**用户**: 对话记录没有记录，如何让你一直记住

**AI 补全**: 追加对话35-49到此记录

---

## 对话50-55: 点击问题深入排错 — 多种方案尝试

**问题**: zIndex 修改后点击仍不工作

**排查**:
- 怀疑 onClick props 未传递 → EventBar-props 诊断显示 onClick:function ✅
- 怀疑闭包问题 → 用 onClickRef 绕开 → 仍 undefined
- 改用 window.__openRecord 全局函数 → 点击可打开 ✅
- 但拖拽也触发打开 → 需区分点击/拖拽
- 用 mouseDownPos 检查移动 → 但 mouseDownPos 始终 (0,0)
- 改用 dragMovedRef（文档 mousemove 监听）→ 点击工作 + 拖拽不误触 ✅
- 改为 onMouseUp 替代 onClick → 编译报错（缺 useEffect import）
- 移除 useDragMove 的 stopPropagation + RAF 延迟 state → 点击最终可以工作 ✅

**决策**: EventBar 使用 dragMovedRef + 5px 阈值 + onMouseUp + 全局函数兜底

---

## 对话56-58: 拖拽/拉伸写入问题

**问题**: mdye 0.1.x API 路径变化
- 旧: `apis.worksheet.editWorksheetRows` → 新: `api.updateWorksheetRow`
- 重写 dragHandler.js 适配新 API（newOldControl/receiveControls 格式）

**问题**: 乐观更新引入的 bug — 先改 ev.accountId 再判断 → 永远 false
- 已用 oldAccountId 保存旧值修复
- 记入铁律 7: 先读后写

**问题**: onEventResize 漏了 `var controls = []` → ReferenceError
- 已补回

**问题**: 关联记录写入格式 `[{sid: uuid}]` → 参考 devtest/SKILL_RELATION.md
- 已实现 buildFieldValue 万能写入函数
- 已写入 Skill 文档 `story/SKILL-字段解析与写入.md`

**问题**: 拖拽松手弹回原位 → useDragMove 不立即清理 isDragging

---

## 对话59-60: 列体表头错位 BUG

**现象**: 朴美善的主事件显示在陈茜列下

**排查过程**:
- 查表头数据 → staffMap 26人，包含朴美善和陈茜 ✅
- 查匹配逻辑 → mainEventLoader 匹配 accountId 正确 ✅
- 查 adapted 数据 → resource.id 和 event.resourceId 一致 ✅
- 查 TimeCalendar 内部匹配 → TIMELINE-COL 诊断证明匹配正确 ✅
- **最终发现**: buildDepartmentTree 按 departmentId(UUID)排序，headerLoader 按 departmentName(pinyin)排序 → 表头和列体错位

**修复**: adapters.js 1 行 `departmentId` → `departmentName`

**教训**: 
- 表头和列体必须同源排序
- "数据正确" != "显示正确"，第4次诊断已证实匹配无误时应转查渲染
- 排序是隐式契约，两模块各自排必须键一致

**记录**: `story/BUG-001-列体表头错位.md`

---

## 对话61: 编辑安全规则更新

- 铁律 6: Hook 使用必检查 import（useEffect 漏 import 导致编译错误）
- 铁律 7: 先读后写，禁止在判断条件前修改变量
- 铁律 8: TimeCalendar 展示层修改规则（备份+注释+记录+验证）

---

## 对话62-63: buildFieldValue Skill

- 万能写入值组装函数，覆盖 type 29/26/27/9/10/11/等
- 保存至 `story/SKILL-字段解析与写入.md`
- dragHandler 已全面使用

---

## 对话64: 进度整理

- 创建 `story/进度状态.md` 记录所有任务进度
- 更新 `story/实施清单.md` 进度表格式为"阶段|任务|时间|进度|状态|依赖"
- useAutoRefresh 实现 ✅，阻塞解除，Step 11/11b/12 可实测

---

## 断点摘要 (2026-05-30 会话结束)

**已完成**: useAutoRefresh ✅, useBoxSelect(框选) ✅, 默认值填充 ✅, multi-select合并修复 ✅, Skill文档 ✅

**待验证**: 拖拽 / 拉伸 / 框选 / 自动刷新 实测

**待完成**: EventBar 代码清理, mdye build, 回归测试

**关键文件**: 
- `story/SKILL-插件视图开发.md` — 实战 Skill 合集
- `story/进度状态.md` — 完整进度
- `story/实施清单.md` — 17 步任务表
- `story/编辑安全规则.md` — 8 条铁律

---

## 断点摘要 (2026-05-30 会话结束)

**Git**: 已初始化仓库，主分支 `master`，开发分支 `dev`，里程碑 `v1.0.0-milestone`
**启动**: `git checkout dev` → 继续开发

**已完成**: 
- 系统架构：5层解耦、24模块、R1-R17规则
- 数据层：三链加载(header/sub/main) + useAutoRefresh
- 工具层：parseField.js(12函数) + parseParam.js(5函数) + mdyeApi.js(3函数)
- 交互层：点击详情 + 拖拽移动 + 拉伸调整 + 框选新建(useBoxSelect.js)
- 默认值：getDefaultValue类型感知 + buildFieldValue 10种type
- 展示层：EventBar(5处修改) + useDrag(5处修改) + useBoxSelect(120行)

**待完成**: 代码清理, mdye build, 回归测试

**关键文件**: story/进度状态.md, story/SKILL-插件视图开发.md, story/设计文档.md

---

## 对话65-67: 代码清理与编译检查

**用户要求**: 只可计划、不可直接执行代码修改

**16b 预案**: 分析 EventBar.jsx 发现 useCallback(导入未使用)、onClickRef(声明+赋值未使用)、mouseDownPos/handleMouseDown(dragMovedRef 检测依赖，需保留)。预案: 2 处删除，-3 行。用户要求注释不删除。

**事故**: `import React, { useRef, /* useCallback */, useEffect }` — Babel 不支持 import 解构内注释，编译失败。修复: 行注释放 import 之前，直接移除 useCallback。

**R18 规则**: 记入 CONTEXT.md — 禁止在 import/export 括号内注释。

**清理结果**: EventBar.jsx L1 移除 useCallback，L72-74 onClickRef 声明+赋值注释保留。

## 对话68: 任务状态更新

16c 非任务，17a/b/c/d 已实测通过。仅剩 16b 完成 + 17e 回归测试待做。

## 对话69: Git 里程碑

初始化 Git 仓库，提交所有代码 (`v1.0.0 里程碑`)，打 tag `v1.0.0-milestone`，建开发分支 `dev`。回退: `git checkout v1.0.0-milestone`。

## 对话70: 移动端 slotHeight

App.jsx 补充 isMobile 自适应 slotHeight (formula: `Math.max(24, (window.innerHeight*0.6)/numSlots)`)，桌面端固定 30。测试: F12 DevTools 或 forceMobile="true"。

## 对话71-72: 事件重叠修复

**根因**: R1 建立后 Step2 用 `Copy-Item dir/*` 一把复制，将纯展示层文件 `eventLayout.js` 误放入业务层 `src/utils/`，TimeCalendar 未调用，重叠功能失效。

**修复**: eventLayout.js 移动至 `src/timeline/hooks/`，TimeCalendar 内 import + 调用 `calculateEventLayout(staffEvents)`，替换外部 prop `eventLayoutsMap`。App.jsx 零改动。

**R19 规则**: 禁止一把复制，逐文件 grep mdye 确认归属。

## 对话73: 今日总结

**已完成新增功能**: useBoxSelect(框选120行)、useAutoRefresh(24行)、buildFieldValue 补齐、getDefaultValue 重写类型感知、extractRowid 从 dragHandler 迁入 parseField、VAR_COLOR_MAP 8映射、移动端 slotHeight、eventLayout 展示层内置、R16-R19 规则

**代码提交**: `v1.0.0-milestone` tag 锁定

**文档更新**: 设计文档 v5.0.0、SKILL-插件视图开发 v2.0.0、时间视图设计方案 v5.0、CONTEXT.md R16-R19

---



## 2026-06-06

- 修复横向滚动时间轴遮挡与锚定区消失问题
*（后续对话将自动追加）*