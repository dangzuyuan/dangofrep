// [清理 2026-05-30] 移除未使用的 useCallback
import React, { useRef, useEffect } from "react";
import styled from "styled-components";

const Bar = styled.div`
  position: absolute;
  border-radius: 4px;
  padding: 2px 4px;
  font-size: 11px;
  color: #fff;
  overflow: hidden;
  min-height: 18px;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 3;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

// 拉伸手柄样式
const ResizeHandle = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 6px;
  cursor: ns-resize;
  z-index: 4;
  
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 2px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 1px;
  }
`;

const TopHandle = styled(ResizeHandle)`
  top: 0;
`;

const BottomHandle = styled(ResizeHandle)`
  bottom: 0;
`;

export default function EventBar({ 
  ev, 
  top, 
  height, 
  color = "#1890ff", 
  isBackground = false,
  isDragging = false,  // 是否正在拖拽
  isResizing = false,  // 是否正在拉伸
  isSelected = false,  // 是否被选中
  isOverlapping = false,
  layoutLeft = 0,      // 水平偏移百分比（0-100）
  layoutWidth = 100,   // 宽度百分比（0-100）
  mainFontSize = 0,    // 环境变量控制主事件字体大小
  onDragStart,
  onResizeStart,
  onClick,
  style: extraStyle
}) {
  const mouseDownPos = useRef({ x: 0, y: 0 });
  // [清理 2026-05-30] onClickRef 未使用，handleBarClick 已改用 window.__openRecord
  // const onClickRef = useRef(onClick);
  // onClickRef.current = onClick;
  const dragMovedRef = useRef(false);

  useEffect(function() {
    var handler = function(e) {
      if (!dragMovedRef.current) {
        var dx = Math.abs(e.clientX - mouseDownPos.current.x);
        var dy = Math.abs(e.clientY - mouseDownPos.current.y);
        if (dx > 5 || dy > 5) dragMovedRef.current = true;
      }
    };
    document.addEventListener("mousemove", handler);
    return function() { document.removeEventListener("mousemove", handler); };
  }, []);

  // 主事件条字体大小
  const dynamicFontSize = mainFontSize > 0 ? mainFontSize : undefined;

  // 背景事件不可交互
  if (isBackground) {
    return (
      <Bar
        data-event-bar
        data-event-id={ev.id || ev._rowid}
        data-is-background="true"
        style={{
          top: `${top}%`,
          height: `${height}%`,
          left: `${layoutLeft}%`,
          width: `${layoutWidth}%`,
          backgroundColor: `${color}40`,
          border: 'none',
          opacity: 0.6,
          pointerEvents: 'none',
          zIndex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          padding: '2px 0 0 4px'
        }}
      >
        <span style={{ fontSize: mainFontSize > 0 ? Math.max(9, mainFontSize - 1) : 10, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {ev.title}
        </span>
      </Bar>
    );
  }

  const handleBarClick = (e) => {
    if (dragMovedRef.current) return;
    if (ev && (ev._rowid || ev.id) && window.__openRecord) {
      window.__openRecord(ev._rowid || ev.id);
    }
  };

  const handleMouseDown = (e) => {
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <Bar
      data-event-bar
      data-event-id={ev.id || ev._rowid}
      data-is-background="false"
      onClick={handleBarClick}
      onMouseUp={handleBarClick}
      onMouseDownCapture={handleMouseDown}
      style={{
        top: `${top}%`,
        height: `${height}%`,
        left: `${layoutLeft}%`,
        width: `${layoutWidth}%`,
        fontSize: dynamicFontSize,
        backgroundColor: isOverlapping ? '#ff4d4f80' : (isDragging || isResizing ? `${color}80` : (isSelected ? `${color}cc` : color)),
        border: isOverlapping ? '2px dashed #ff4d4f' : (isDragging || isResizing ? '2px dashed #fff' : (isSelected ? '2px solid #fff' : 'none')),
        opacity: isDragging || isResizing ? 0.7 : 1,
        pointerEvents: 'auto',
        zIndex: isDragging || isResizing ? 10 : (ev.layoutZIndex || 3),
        boxShadow: isOverlapping ? '0 0 0 2px #ff4d4f' : (isDragging || isResizing ? '0 4px 12px rgba(0, 0, 0, 0.3)' : (isSelected ? '0 0 0 2px rgba(255, 255, 255, 0.8), 0 4px 12px rgba(0, 0, 0, 0.2)' : 'none')),
        transition: isDragging || isResizing ? 'none' : 'transform 0.12s ease, box-shadow 0.12s ease',
        ...extraStyle
      }}
    >
      {/* 顶部拉伸手柄 */}
      <TopHandle 
        onMouseDown={(e) => {
          dragMovedRef.current = false;
          onResizeStart && onResizeStart(e, 'top');
        }}
      />
      
      {/* 中间拖拽区域 */}
      <div
        style={{
          position: 'absolute',
          top: '6px',
          bottom: '6px',
          left: 0,
          right: 0,
          cursor: 'grab',
          zIndex: 1
        }}
        onMouseDown={(e) => {
          dragMovedRef.current = false;
          onDragStart && onDragStart(e, ev);
        }}
      />
      
      {/* 底部拉伸手柄 */}
      <BottomHandle 
        onMouseDown={(e) => {
          dragMovedRef.current = false;
          onResizeStart && onResizeStart(e, 'bottom');
        }}
      />
      
      <span style={{ whiteSpace: "pre-line", pointerEvents: "none", position: 'relative', zIndex: 5, color: ev.fontColor || '#fff' }}>
        {ev.title}
      </span>
    </Bar>
  );
}
