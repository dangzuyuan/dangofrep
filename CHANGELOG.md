# CHANGELOG

## 2026-06-22

- 新增环境变量 backgroundcolor：控制**表格区域**背景颜色（仅 ScrollArea 内容区），默认白色
- 新增环境变量 subbackgroundcolor：控制*时间轴/表头+锚定区*背景颜色，默认白色#fafafa
- 新增环境变量 mainfontsize：控制主事件条字体大小，值为数字（px），默认 11px
- 通过 DEBUG 日志定位 key 拼写问题（用户配置为 backgroupcolor），统一为 backgroundcolor
- 移除 DEBUG 日志，代码清理完毕
- 副事件（排班事件）不透明化：opacity=1 + 移除颜色透明度后缀，避免背景色干扰
- 网格线：#c8c8c8→#d9d9d9 + StaffColumn网格层右侧加borderRight=#d9d9d9，列间竖线可见
- 修复格线层叠顺序：改由内层 grid div(z-index:2)绘制，格线现位于副事件(z-index:1)之上、主事件(z-index:3)之下
- 格线延伸至时间轴：BodyAxisCell 多重背景(gridBg + subBgColor)，格线与列区域位置一致
- 删除列空状态“暂无安排”图标及文字，无事件时空列不显示内容

## 2026-06-18

- 修复移动端时间轴滑动：固定定位/阻断滚动链
