# Session Handoff / 会话接续

> 最后更新: 2026-06-17
> Last updated: 2026-06-17

## 刚刚完成 / Just Completed

- 修复移动端时间轴滑动：固定定位+阻断滚动链（Android 生效）
- 修复iOS时间轴滑动与表头对齐：webkit惯性滚动+显式宽度
- V7 iOS专属修复（第三轮重启）：enabled gate 隔离 Android
  - useScrollLock.js：`if(!enabled) return` → Android 完全跳过
  - isIOS UA 检测 + ScrollArea className="ios-scroll-area"
  - style.less .ios-scroll-area { padding-left: 40px }
  - Android 上 className="" 空字符串，零影响
  - 不加 capture/stopPropagation/document 守卫，用冒泡阶段+被动监听，与其他组件和平共处

## 正在进行 / In Progress

- 无

## 下一步 / Next Steps

1. iOS 真机：直接右滑/慢滑/边缘右滑 → 页面完全不动
2. Android 真机：纵向滑动、横向滑动完全不受影响（已验证）
3. 长按创建事件不受影响
4. git push（如 remote 已配置）

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
