# Session Handoff / 会话接续

> 最后更新: 2026-06-17
> Last updated: 2026-06-17

## 刚刚完成 / Just Completed

- 修复移动端时间轴滑动：固定定位+阻断滚动链
  - TimeCalendar.jsx ScrollArea 新增 touch-action: pan-x pan-y + overscroll-behavior-x/y: contain
  - TimeCalendar.jsx AppContainer 新增 overflow: hidden + overscroll-behavior: none
  - style.less html,body 新增 overscroll-behavior-x: none
  - 解决左滑时间轴未固定 + 右滑带动页面两个问题

## 正在进行 / In Progress

- 无

## 下一步 / Next Steps

1. 在明道云移动端实测：验证时间轴固定 + 横向独立滑动
2. 验证长按创建事件功能不受影响
3. 如 remote 已配置则 git push

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
