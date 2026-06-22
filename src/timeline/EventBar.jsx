// [娓呯悊 2026-05-30] 绉婚櫎鏈娇鐢ㄧ殑 useCallback
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

// 鎷変几鎵嬫焺鏍峰紡
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
  isDragging = false,  // 鏄惁姝ｅ湪鎷栨嫿
  isResizing = false,  // 鏄惁姝ｅ湪鎷変几
  isSelected = false,  // 鏄惁琚€変腑
  isOverlapping = false,
  layoutLeft = 0,      // 姘村钩鍋忕Щ鐧惧垎姣旓紙0-100锛?
  layoutWidth = 100,   // 瀹藉害鐧惧垎姣旓紙0-100锛?
  mainFontSize = 0,    // 鐜鍙橀噺鎺у埗涓讳簨浠跺瓧浣撳ぇ灏?
  onDragStart,
  onResizeStart,
  onClick,
  onDeselect,
  style: extraStyle
}) {
  const mouseDownPos = useRef({ x: 0, y: 0 });
  // [娓呯悊 2026-05-30] onClickRef 鏈娇鐢紝handleBarClick 宸叉敼鐢?window.__openRecord
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

  // 涓讳簨浠舵潯瀛椾綋澶у皬
  const dynamicFontSize = mainFontSize > 0 ? mainFontSize : undefined;

  // 鑳屾櫙浜嬩欢锛堝壇浜嬩欢/鎺掔彮浜嬩欢锛夛細涓嶉€忔槑锛岄伩鍏嶅崐閫忔槑鍙犲姞琛ㄦ牸鑳屾櫙鑹插共鎵版樉绀?
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
          backgroundColor: color,
          border: 'none',
          opacity: 1,
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
    onDeselect && onDeselect();  // deselect time slot
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
      {/* 椤堕儴鎷変几鎵嬫焺 */}
      <TopHandle 
        onMouseDown={(e) => {
          dragMovedRef.current = false;
          onResizeStart && onResizeStart(e, 'top');
        }}
      />
      
      {/* 涓棿鎷栨嫿鍖哄煙 */}
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
      
      {/* 搴曢儴鎷変几鎵嬫焺 */}
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
