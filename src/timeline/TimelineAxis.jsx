import React, { useMemo } from "react";
import styled from "styled-components";

const AxisContainer = styled.div`
  width: ${(props) => props.axisWidth}px;
  min-width: ${(props) => props.axisWidth}px;
  height: 100%;
  background: transparent;  /* 透明，让网格线可见 */
  border-right: 1px solid #e8e8e8;
  position: relative;
  overflow: hidden;
  cursor: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSI1Ij48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMS44IiBmaWxsPSJibGFjayIvPjxyZWN0IHg9IjAiIHk9IjMuMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjEuOCIgZmlsbD0iYmxhY2siLz48cG9seWdvbiBwb2ludHM9IjIwLDAgMzAsMi41IDIwLDUiIGZpbGw9ImJsYWNrIi8+PC9zdmc+') 30 2.5, e-resize;
  padding-top: 10px;  /* 给顶部留空间，防止第一个刻度被裁剪 */
  padding-bottom: 10px;  /* 底部也留空间 */
`;

const TimeLabel = styled.div`
  position: absolute;
  left: 4px;
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  line-height: 1;
  transform: translateY(-50%);  /* 垂直居中 */
`;

export default function TimelineAxis({ 
  begintime = "07:00", 
  endtime = "23:00", 
  timejiange = 30, 
  rowHeight = 600,
  axisWidth = 80,
  timeFormat = "single",  // 'single' 或 'range'
  onSlotClick,
}) {
  const slots = useMemo(() => {
    const result = [];
    const [sh, sm] = begintime.split(":").map(Number);
    const [eh, em] = endtime.split(":").map(Number);
    
    let m = sh * 60 + sm;
    const end = eh * 60 + em;
    const totalMinutes = end - m;
    
    if (totalMinutes <= 0) return result;

    while (m < end) {
      const hh = Math.floor(m / 60).toString().padStart(2, "0");
      const mm = (m % 60).toString().padStart(2, "0");
      
      // 根据时间格式生成标签
      let label;
      if (timeFormat === "range") {
        const nextM = m + timejiange;
        const nextHh = Math.floor(nextM / 60).toString().padStart(2, "0");
        const nextMm = (nextM % 60).toString().padStart(2, "0");
        label = `${hh}:${mm}-${nextHh}:${nextMm}`;
      } else {
        label = `${hh}:${mm}`;
      }
      
      // 计算刻度在行内的绝对像素位置（从容器顶部 0 开始）
      // 加上半个格子高度，让标签在格子中间
      const slotHeight = rowHeight / Math.ceil(totalMinutes / timejiange);
      const topPixel = ((m - (sh * 60 + sm)) / totalMinutes) * rowHeight + slotHeight / 2;
      result.push({
        label,
        minutes: m,
        top: topPixel
      });
      m += Number(timejiange);
    }
    return result;
  }, [begintime, endtime, timejiange, rowHeight]);

  return (
    <AxisContainer axisWidth={axisWidth} style={{ height: `${rowHeight}px` }} onClick={(e) => { e.stopPropagation(); if (onSlotClick) { var r = e.currentTarget.getBoundingClientRect(); console.log("timeline click:",e.clientY-r.top),onSlotClick(e.clientY - r.top); } }}>
      {/* 时间刻度标签 */}
      {slots.map((slot) => (
        <TimeLabel key={slot.minutes} style={{ top: `${slot.top}px` }}>
          {slot.label}
        </TimeLabel>
      ))}
    </AxisContainer>
  );
}
