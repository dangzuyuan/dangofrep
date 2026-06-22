import React, { useMemo, useRef } from 'react';
import styled from 'styled-components';
import TimelineAxis from './TimelineAxis';
import TableHeader from './TableHeader';
import StaffColumn from './StaffColumn';
import EventBar from './EventBar';
import { useDragMove } from './hooks/useDragMove';
import { useDragResize } from './hooks/useDragResize';
import { useBoxSelect } from './hooks/useBoxSelect';
import { useTouchCreate } from './hooks/useTouchCreate';
import { useScrollLock } from './hooks/useScrollLock';
import { calculateEventLayout } from './hooks/eventLayout';

const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
  overscroll-behavior: none;
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow: auto;
  position: relative;
  min-height: 0;
  background: ${(p) => p.$tableBgColor || '#fff'};
  touch-action: pan-x pan-y;
  overscroll-behavior-x: contain;
  overscroll-behavior-y: contain;
  -webkit-overflow-scrolling: touch;
  
  /* 自定义滚动条样式 */
  scrollbar-width: thin;  /* Firefox */
  
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
`;

const BodyRow = styled.div`
  display: flex;
  position: relative;
  flex-shrink: 0;
  width: ${(p) => p.$totalWidth}px;       /* 显式像素宽度，iOS Safari 对齐表头 */
  min-width: 100%;
`;

// 全局网格背景（覆盖时间轴 + 所有资源列）
const GlobalGridBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${(props) => props.totalWidth}px;  /* 精确限制网格背景宽度，防止超出表头右边界 */
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
`;

const BodyAxisCell = styled.div`
  width: ${(props) => props.axisWidth}px;
  min-width: ${(props) => props.axisWidth}px;
  position: sticky;
  left: 0;
  z-index: 6;
  background: ${(p) => p.$subBgColor || '#fafafa'};  /* 子区域背景色（时间轴/表头/锚定区） */
  border-right: 1px solid #e8e8e8;
  flex-shrink: 0;
`;

export default function TimeCalendar({
  resources = [],
  events = [],
  departmentTree = [],
  begintime = "07:00",
  endtime = "23:00",
  timejiange = 30,
  slotHeight = 60,  // 单个时间格的高度（像素）
  colWidth = 72,
  axisWidth = 80,
  columnHeader = "时间",
  rowHeader = "人员",
  timeFormat = "single",  // 时间格式：'single' (08:00) 或 'range' (08:00-08:30)
  selectedEventId = null,  // 选中的事件 ID
  // 外观配置
  backgroundColor = "",
  subBackgroundColor = "",
  mainFontSize = 0,
  // 交互回调
  onEventClick,
  onEventDrop,
  onEventResize,
  onSelectSlot
}) {
  const columnsWidth = resources.length * colWidth;

  const timeMeta = useMemo(() => {
    const [sh, sm] = begintime.split(":").map(Number);
    const [eh, em] = endtime.split(":").map(Number);
    const totalMin = Math.max(1, (eh * 60 + em) - (sh * 60 + sm));
    const numSlots = Math.ceil(totalMin / timejiange);
    return { totalMin, numSlots };
  }, [begintime, endtime, timejiange]);

  // 计算总行高：时间槽数量 × 单个格子高度
  const calculatedRowHeight = timeMeta.numSlots * slotHeight;

  // 计算总宽度（用于限制网格背景）
  const totalWidth = axisWidth + columnsWidth;

  const gridBg = useMemo(() => {
    const slotHeight = calculatedRowHeight / timeMeta.numSlots;
    const linePos = slotHeight - 1;
    return `repeating-linear-gradient(to bottom, transparent 0px, transparent ${linePos}px, #c8c8c8 ${linePos}px, #c8c8c8 ${slotHeight}px)`;
  }, [calculatedRowHeight, timeMeta.numSlots]);

  const getEventPosition = (ev) => {
    // 直接使用已标准化的 startTime/endTime（纯时间字符串）
    const [sh, sm] = begintime.split(":").map(Number);
    const startMinTotal = sh * 60 + sm;
    const [eh, em] = endtime.split(":").map(Number);
    const endMinTotal = eh * 60 + em;

    const [startH, startM] = ev.startTime.split(':').map(Number);
    const [endH, endM] = ev.endTime.split(':').map(Number);

    const evStartMin = startH * 60 + startM;
    const evEndMin = endH * 60 + endM;

    // 钳制到时间轴范围，防止背景条/主事件条超出时间轴边界
    const clampedStart = Math.max(evStartMin, startMinTotal);
    const clampedEnd = Math.min(evEndMin, endMinTotal);

    const top = ((clampedStart - startMinTotal) / timeMeta.totalMin) * 100;
    const height = ((clampedEnd - clampedStart) / timeMeta.totalMin) * 100;
    return { top, height };
  };

  // 初始化拖拽 Hooks
  const { 
    handleMouseDown: handleDragStart,
    dragState: moveDragState
  } = useDragMove({
    onEventDrop,
    begintime,
    endtime,
    timejiange,
    resources
  });

  const { 
    handleResizeStart,
    resizeState
  } = useDragResize({
    onEventResize,
    begintime,
    endtime,
    timejiange
  });

  const { handleSelectStart, isSelecting, selectState } = useBoxSelect({
    onSelectSlot,
    begintime,
    endtime,
    timejiange
  });

  const { handleTouchStart, isCreating, createState } = useTouchCreate({
    onSelectSlot,
    begintime,
    endtime,
    timejiange
  });

  // iOS 专属方向锁定：Android 跳过，零影响
  var isIOS = /(iPhone|iPad|iPod)/i.test(navigator.userAgent);
  const scrollRef = useRef(null);
  useScrollLock(scrollRef, isIOS);

  // DEBUG
  console.log('[DEBUG TimeCalendar] backgroundColor:', JSON.stringify(backgroundColor));
  console.log('[DEBUG TimeCalendar] subBackgroundColor:', JSON.stringify(subBackgroundColor));
  console.log('[DEBUG TimeCalendar] mainFontSize:', mainFontSize);

  // 点击空白区域取消选中
  const handleBackgroundClick = (e) => {
    // 如果点击的是背景区域（不是事件条），则取消选中
    if (onEventClick && e.target === e.currentTarget) {
      onEventClick(null);
    }
  };

  return (
    <AppContainer>
      <ScrollArea ref={scrollRef} className={isIOS ? 'ios-scroll-area' : ''} $tableBgColor={backgroundColor} onClick={handleBackgroundClick}>
        {/* iOS 专属：左侧透明遮罩拦截边缘触摸，防止系统侧滑返回抢占 */}
        {isIOS && <div className="ios-edge-mask" />}
        <TableHeader
          departmentTree={departmentTree}
          columnHeader={columnHeader}
          rowHeader={rowHeader}
          columnsWidth={columnsWidth}
          colWidth={colWidth}
          axisWidth={axisWidth}
          totalWidth={totalWidth}
          bgColor={subBackgroundColor}
        />
        <BodyRow style={{ height: calculatedRowHeight }} $totalWidth={totalWidth}>
          {/* 全局网格背景 */}
          <GlobalGridBg totalWidth={totalWidth} style={{ background: gridBg }} />
          
          {/* 无资源时的空状态提示 */}
          {resources.length === 0 && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: '#bfbfbf',
                fontSize: '14px',
                zIndex: 10,
                pointerEvents: 'none'
              }}
            >
              <div style={{ marginBottom: '8px', fontSize: '32px' }}>👥</div>
              <div>暂无人员数据</div>
              <div style={{ marginTop: '4px', fontSize: '12px' }}>请在配置中添加资源</div>
            </div>
          )}
          
          <BodyAxisCell axisWidth={axisWidth} $subBgColor={subBackgroundColor} style={{ height: calculatedRowHeight }}>
            <TimelineAxis 
              begintime={begintime}
              endtime={endtime}
              timejiange={timejiange}
              rowHeight={calculatedRowHeight}
              axisWidth={axisWidth}
              timeFormat={timeFormat}
            />
          </BodyAxisCell>
          {resources.map((s, idx) => {
            const staffEvents = events.filter(ev => ev.resourceId === s.id || ev.resourceId === s.accountId);
            const mainEvents = staffEvents.filter(function(ev) { return !ev.isBackground; });
            var mainLayouts = calculateEventLayout(mainEvents);
            var mi = 0;
            var eventLayouts = staffEvents.map(function(ev) {
              if (ev.isBackground) return { left: 0, width: 100, zIndex: 1 };
              return mainLayouts[mi++] || { left: 0, width: 100, zIndex: 1 };
            });
            
            // 计算时间基准（用于预览条）
            const [sh, sm] = begintime.split(":").map(Number);
            const startMinTotal = sh * 60 + sm;
            
            return (
              <StaffColumn
                key={s.id || s.accountId}
                staff={s}
                idx={idx}
                rowHeight={calculatedRowHeight}
                colWidth={colWidth}
                gridBg="transparent"
                data-resource-column
                data-resource-id={s.id || s.accountId}
                onMouseDown={(e) => handleSelectStart(e, s.id || s.accountId)}
                onTouchStart={(e) => handleTouchStart(e, s.id || s.accountId)}
              >
                {/* 空状态提示 */}
                {staffEvents.length === 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      color: '#bfbfbf',
                      fontSize: '12px',
                      pointerEvents: 'none',
                      zIndex: 1
                    }}
                  >
                    <div style={{ marginBottom: '4px' }}>📅</div>
                    <div>暂无安排</div>
                  </div>
                )}
                {isSelecting && selectState && (selectState.resourceId === s.id || selectState.resourceId === s.accountId) && (
                  <div style={{position:'absolute',top:(selectState.startMin/timeMeta.totalMin)*100+'%',height:((selectState.endMin-selectState.startMin)/timeMeta.totalMin)*100+'%',left:0,right:0,backgroundColor:'rgba(24,144,255,0.15)',border:'2px dashed #1890ff',borderRadius:4,zIndex:5,pointerEvents:'none'}}/>
                )}
                {isCreating && createState && (createState.resourceId === s.id || createState.resourceId === s.accountId) && (
                  <div style={{position:'absolute',top:(createState.startMin/timeMeta.totalMin)*100+'%',height:((createState.endMin-createState.startMin)/timeMeta.totalMin)*100+'%',left:0,right:0,backgroundColor:'rgba(24,144,255,0.15)',border:'2px solid #1890ff',borderRadius:4,zIndex:5,pointerEvents:'none'}}/>
                )}
                {staffEvents.map((ev, evIdx) => {
                  let { top, height } = getEventPosition(ev);
                  
                  // 获取布局信息
                  const layout = eventLayouts[evIdx] || { left: 0, width: 100, zIndex: 1 };
                  
                  // 如果正在拖拽此事件，使用预览位置
                  const isDragging = moveDragState && moveDragState.eventId === ev.id;
                  if (isDragging) {
                    const [sh, sm] = begintime.split(":").map(Number);
                    const startMinTotal = sh * 60 + sm;
                    const previewTop = ((moveDragState.previewStartMin - startMinTotal) / timeMeta.totalMin) * 100;
                    const previewHeight = ((moveDragState.previewEndMin - moveDragState.previewStartMin) / timeMeta.totalMin) * 100;
                    top = previewTop;
                    height = previewHeight;
                  }
                  
                  // 如果正在拉伸此事件，使用预览位置（含 _final 阶段）
                  var hasPendingResize = resizeState && resizeState.eventId === ev.id;
                  if (hasPendingResize) {
                    const [sh, sm] = begintime.split(":").map(Number);
                    const startMinTotal = sh * 60 + sm;
                    const previewTop = ((resizeState.previewStartMin - startMinTotal) / timeMeta.totalMin) * 100;
                    const previewHeight = ((resizeState.previewEndMin - resizeState.previewStartMin) / timeMeta.totalMin) * 100;
                    top = previewTop;
                    height = previewHeight;
                  }
                  
                  var isResizing = hasPendingResize && !resizeState._final;
                  
                  return (
                    <EventBar
                      key={ev.id}
                      ev={{ ...ev, layoutZIndex: layout.zIndex }}
                      top={top}
                      height={height}
                      color={ev.color}
                      isBackground={ev.isBackground || false}
                      isDragging={isDragging}  // 传递拖拽状态
                      isResizing={isResizing}  // 传递拉伸状态
                      isSelected={selectedEventId === ev.id}  // 传递选中状态
                      isOverlapping={moveDragState && moveDragState.eventId === ev.id && moveDragState.isOverlapping}
                      layoutLeft={layout.left}
                      layoutWidth={layout.width}
                      mainFontSize={mainFontSize}
                      onDragStart={(e) => handleDragStart(e, ev, s.id || s.accountId)}
                      onResizeStart={(e, direction) => handleResizeStart(e, ev, s.id || s.accountId, direction)}
                      onClick={() => onEventClick && onEventClick(ev)}
                    />
                  );
                })}
                
                {/* 横向拖动预览：如果有事件正在拖拽到当前列，显示预览条 */}
                {moveDragState && moveDragState.resourceId === (s.id || s.accountId) && (
                  <EventBar
                    key={`preview-${moveDragState.eventId}`}
                    ev={{
                      id: moveDragState.eventId,
                      title: '...',
                      color: '#1890ff'
                    }}
                    top={((moveDragState.previewStartMin - startMinTotal) / timeMeta.totalMin) * 100}
                    height={((moveDragState.previewEndMin - moveDragState.previewStartMin) / timeMeta.totalMin) * 100}
                    color="#1890ff"
                    isDragging={true}
                    isResizing={false}
                    isOverlapping={moveDragState && moveDragState.isOverlapping}
                    mainFontSize={mainFontSize}
                  />
                )}
            </StaffColumn>
            );
          })}
        </BodyRow>
      </ScrollArea>
    </AppContainer>
  );
}
