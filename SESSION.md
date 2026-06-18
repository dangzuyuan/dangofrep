# Session Handoff / 会话接续

> 最后更新: 2026-06-18
> Last updated: 2026-06-18

## 刚刚完成 / Just Completed

- 修复移动端时间轴滑动：固定定位+阻断滚动链（Android 生效）
- 修复iOS时间轴滑动与表头对齐：webkit惯性滚动+显式宽度
- V7 iOS专属修复：enabled gate 隔离 Android
- **V8 工业级**：iOS/Android 双分支滑动，全局守卫+fixed容器+边缘遮罩
  - useScrollLock.js 完全重写：iOS/Android 双分支常量 + 逻辑
  - iOS: touchstart→addDocGuard 立即挂载 document 捕获守卫；横向→scrollLeft+速度采样；touchend→rAF 动量
  - Android: 仅方向判定+preventDefault，原生 overflow 不动
  - index.js: iOS 写 body.ios-app class
  - style.less: body.ios-app #app fixed + .ios-scroll-area padding-left:42px + .ios-edge-mask
  - TimeCalendar.jsx: iOS 专属 42px 透明边缘遮罩 div

## 正在进行 / In Progress

- 无

## 下一步 / Next Steps

1. iOS 真机：直接/慢速/边缘右滑 → 页面不动；快滑松手惯性；纵向正常
2. Android 真机：横纵滑动原生顺畅；long-press create 正常
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
