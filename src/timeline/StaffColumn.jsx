import React from "react";
import styled from "styled-components";

const StaffColWrap = styled.div`
  position: relative;
  border-right: 1px solid #e8e8e8;  /* 与时间轴边框颜色一致 */
  flex-shrink: 0;
  box-sizing: border-box;
  
  /* 最后一列的右边框加粗，作为整体右边界 */
  &:last-child {
    border-right: 2px solid #c8c8c8;
  }
`;

export default function StaffColumn({
  staff,
  idx,
  events = [],
  rowHeight = 600,
  gridBg = "",
  colWidth = 72,
  children,
  ...restProps  // 接收其他 props
}) {
  return (
    <StaffColWrap
      data-staff-idx={idx}
      data-accountid={staff.accountId}
      style={{ 
        height: rowHeight, 
        width: colWidth, 
        minWidth: colWidth, 
        maxWidth: colWidth,
        touchAction: 'manipulation'
      }}
      {...restProps}  // 传递其他 props
    >
      {/* 顶部彩色条 */}
      <div
        style={{
          height: 6,
          background: `hsl(${idx * 36}, 80%, 60%)`,
          width: "100%",
          flexShrink: 0,
          position: "relative",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      {/* 网格背景 */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: gridBg,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      {/* 事件内容 */}
      {children}
    </StaffColWrap>
  );
}
