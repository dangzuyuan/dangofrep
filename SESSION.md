# Session Handoff / 会话接续

> 最后更新: 2026-06-22
> Last updated: 2026-06-22

## 会话历史 / Session History

### 2026-06-06 - 整理输出最新设计方案文档(story/设计方案-最新.md)

- 修复横向滚动时间轴遮挡与锚定区消失问题（3项改动）：

### 2026-06-07 - 更新设计方案文档与SESSION接续笔记

- 修复框选新建员工错位：去掉 `dept.children.sort(按 accountId)`，部门内人员顺序与列体完全对齐
- 部门排序改为视图返回顺序：`headerLoader` + `adapters` 均保留首次出现顺序，不再按拼音排序
- 整理输出最新设计方案文档 `story/设计方案-最新.md`（合并了所有旧方案文档）

### 2026-06-07 - 移动端触屏创建降低灵敏度:长按500ms+移动10px取消防误触

- 修复框选新建员工错位：去掉 `dept.children.sort(按 accountId)`，部门内人员与列体完全对齐
- 部门排序改为视图返回顺序：去掉全部拼音排序
- 整理输出最新设计方案文档 `story/设计方案-最新.md`

### 2026-06-07 - 更新CHANGELOG与SESSION接续笔记

- 框选新建员工错位修复：去掉 dept.children.sort，部门内人员与列体对齐
- 部门排序改为视图返回顺序：去掉全部拼音排序
- 移动端触屏创建降低灵敏度：长按500ms + touchmove 10px取消（防轻触滑动误触）

### 2026-06-17 - 修复iOS时间轴滑动与表头对齐：webkit惯性滚动+显式宽度

- 修复移动端时间轴滑动：固定定位+阻断滚动链

### 2026-06-18 - V8工业级：iOS/Android双分支滑动，全局守卫+fixed容器+边缘遮罩

- 修复移动端时间轴滑动：固定定位+阻断滚动链（Android 生效）
- 修复iOS时间轴滑动与表头对齐：webkit惯性滚动+显式宽度
- V7 iOS专属修复（第三轮重启）：enabled gate 隔离 Android

### 2026-06-18 - 回退Android分支逻辑，恢复V7的enabled gate跳过模式

- 修复移动端时间轴滑动：固定定位+阻断滚动链（Android 生效）
- 修复iOS时间轴滑动与表头对齐：webkit惯性滚动+显式宽度
- V7 iOS专属修复：enabled gate 隔离 Android

### 2026-06-22 - 新增环境变量：backgroundcolor表格背景色 + mainfontsize主事件字体大小

- 修复移动端时间轴滑动：固定定位+阻断滚动链（Android 生效）
- 修复iOS时间轴滑动与表头对齐：webkit惯性滚动+显式宽度
- V7 iOS专属修复：enabled gate 隔离 Android

### 2026-06-22 - 修复背景颜色未生效：AppWrap+ScrollArea同步传递bgColor

- 修复移动端时间轴滑动 + iOS 专属多轮优化
- **新增 2 个环境变量**：backgroundcolor + mainfontsize

### 2026-06-22 - 修复背景颜色未全局生效：HeaderRow+StaffRow+数据行SplitCorner同步bgColor

- 修复移动端时间轴滑动 + iOS 专属多轮优化
- **新增 2 个环境变量**：backgroundcolor + mainfontsize

### 2026-06-22 - 添加DEBUG日志排查backgroundcolor+mainfontsize映射链

- 修复移动端时间轴滑动 + iOS 专属多轮优化
- **新增 2 个环境变量**：backgroundcolor + mainfontsize

### 2026-06-22 - 移除DEBUG日志，清理backgroundcolor兼容代码，仅保留正确的参数名

- 修复移动端时间轴滑动 + iOS 专属多轮优化
- **重构 3 个环境变量**：backgroundcolor / subbackgroundcolor / mainfontsize

### 2026-06-22 - 副事件(排班事件)改为不透明：opacity=1 + 移除颜色透明度后缀，避免背景色干扰

- 修复移动端时间轴滑动 + iOS 专属多轮优化
- **重构 3 个环境变量**：backgroundcolor / subbackgroundcolor / mainfontsize

### 2026-06-22 - 更新 CHANGELOG 和 SESSION 记录格线延伸与空状态删除

- **格线延伸至时间轴**：BodyAxisCell 使用多重背景 (gridBg + subBgColor)，格线和列区域使用同一 gradient，位置完全一致
- **删除列空状态**：移除每列的 "暂无安排" 图标及文字，无事件时空列不显示内容
- **修复格线层叠顺序**：格线由内层 grid div(z-index:2) 绘制，位于副事件(z-index:1)之上、主事件(z-index:3)之下

### 2026-06-22 - 修复 CHANGELOG 乱码：重写为正确 UTF-8 中文并去除 BOM

- **格线延伸至时间轴**：BodyAxisCell 使用多重背景 (gridBg + subBgColor)，格线和列区域使用同一 gradient，位置完全一致
- **删除列空状态**：移除每列的 "暂无安排" 图标及文字，无事件时空列不显示内容
- **修复格线层叠顺序**：格线由内层 grid div(z-index:2) 绘制，位于副事件(z-index:1)之上、主事件(z-index:3)之下


## 刚刚完成 / Just Completed

- 修复移动端时间轴滑动 + iOS 专属多轮优化
- **重构 3 个环境变量**：backgroundcolor / subbackgroundcolor / mainfontsize
  - backgroundcolor：仅表格区域（ScrollArea 内容区），参数名统一为 `backgroundcolor`
  - subbackgroundcolor：时间轴 + 表头 + 锚定区（BodyAxisCell/SplitCorner/HeaderRow/StaffRow），默认白色
  - mainfontsize：主事件条字体大小
  - 区域划分：表格=$tableBgColor(ScrollArea)；子区域=$subBgColor(时间轴+表头+锚定区)
  - 已移除 DEBUG 日志，参数 key 统一为 backgroundcolor（不再兼容 backgroupcolor 拼写）

## 正在进行 / In Progress

- 无

## 下一步 / Next Steps

1. 设置 env: backgroundcolor=#f5f5f5 subbackgroundcolor=#fff mainfontsize=14 测试
2. iOS 滑动问题待真机验证
3. git push

## 待决定 / Pending Decisions

- /v3/departments/lookup 精确获取拖拽部门顺序：已确认不可行，改为视图排序方案
- 是否生成项目 run skill（/run-skill-generator 被中断）

## 注意事项 / Notes

- 分支: overlap-fix
- push 未配置 remote，需手动 git remote add 后推送
- adapters.js 中 buildDepartmentTree 的 sort 已全部移除
- headerLoader.js 的拼音排序 + 重建 Map 逻辑已移除
- useTouchCreate.js：HOLD_MS=500, MOVE_CANCEL_PX=10
- App.jsx：新增 sessionStorage 读写 currentDate

## 2026-06-22 本次会话 / This Session

- **修复格线层叠顺序**：改由内层 grid div(z-index:2)绘制，格线位于副事件(z-index:1)之上、主事件(z-index:3)之下
  - 引入 COLOR_GRID_LINE = "#c8c8c8" 常量替代硬编码 #d9d9d9
  - StaffColumn 传参从 gridBg="transparent" 改为 gridBg={gridBg}
  - eventLayout.js 主事件 z-index 从 1 改为 Z_BAR_MAIN(3)
- **格线延伸至时间轴**：BodyAxisCell 多重背景(gridBg + subBgColor)，格线与列区域位置一致
- **删除列空状态**：移除每列的 "暂无安排" 图标及文字，无事件时空列不显示内容


## 2026-06-25 This Session

> Last updated: 2026-06-25 09:42

### Just Completed

- 修复事件默认边框（none→1px solid rgba）
- 修复 hover 阴影（inline boxShadow 改为 undefined，让 :hover 生效）
- 修复点击事件打开两次详情页（移除 onMouseUp={handleBarClick}）
- 重叠并排事件增加水平间隙 GAP_PERCENT=0.4
- 新增 overlapCount/overlapIndex 布局深度信息
- 新增 EventBarIsolateStyle iframe 样式隔离
- style.less 新增 [data-event-bar]/:hover/drag-preview-bar !important 规则

### In Progress

- 无

### Next Steps

1. git add + commit + push（当前 .git 目录对 codexsandboxoffline 只读，需手动执行）
2. 线上验证 iframe 环境下边框/间距/层级稳定性
3. 后续如有重叠事件视觉优化需求，可恢复 overlap 深度指示器组件

### Pending Decisions

- 无

### Notes

- .git 目录权限限制：BUILTIN\\Users 仅 RX，git 写操作无法执行
- Chinese 文件用 Node.js 写，不用 PowerShell Set-Content
- 所有修改基于 EventBar.jsx.bak 还原后再做最小侵入改动
