# Session Handoff / 会话接续

> 最后更新: 2026-06-07 11:50
> Last updated: 2026-06-07 11:50

## 刚刚完成 / Just Completed

- 框选新建员工错位修复：去掉 dept.children.sort，部门内人员与列体对齐
- 部门排序改为视图返回顺序：去掉全部拼音排序
- 移动端触屏创建降低灵敏度：长按500ms + touchmove 10px取消（防轻触滑动误触）
- 明道云"刷新视图"重建组件树导致日期回到今天：sessionStorage 持久化 currentDate
- 整理输出最新设计方案文档 story/设计方案-最新.md

## 正在进行 / In Progress

- 无

## 下一步 / Next Steps

1. 测试移动端触屏创建：长按500ms才激活，轻触/滑动不误触
2. 测试明道云刷新视图：日期是否保留在切换前的日期
3. 测试框选新建：事件创建到正确的员工
4. 全功能回归测试

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
