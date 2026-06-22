# Session Handoff / 会话接续

> 最后更新: 2026-06-22
> Last updated: 2026-06-22

## 刚刚完成 / Just Completed

- 修复移动端时间轴滑动 + iOS 专属多轮优化
- **重构 3 个环境变量**：backgroundcolor / subbackgroundcolor / mainfontsize
  - backgroundcolor：仅表格区域（ScrollArea 内容区），参数名统一为 `backgroundcolor`
  - subbackgroundcolor：时间轴 + 表头 + 锚定区（BodyAxisCell/SplitCorner/HeaderRow/StaffRow），默认白色
  - mainfontsize：主事件条字体大小
  - 区域划分：表格=$tableBgColor(ScrollArea)；子区域=$subBgColor(时间轴+表头+锚定区)
  - AppContainer(AppWrap) 恢复固定白色，不参与动态背景

## 正在进行 / In Progress

- 无

## 下一步 / Next Steps

1. 在明道云配置中设置 backgroundcolor + mainfontsize 环境变量，测试生效
2. iOS 滑动问题待真机验证
3. git push（如 remote 已配置）

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
