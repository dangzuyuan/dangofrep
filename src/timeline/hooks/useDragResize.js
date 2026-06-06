import { useState, useCallback, useRef, useEffect } from 'react';
import { snapToGrid, pixelToMinutes, findNearestBar } from './utils';

export function useDragResize({
  onEventResize,
  begintime,
  endtime,
  timejiange
}) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeState, setResizeState] = useState(null);
  const resizeRef = useRef(null);
  
  const configRef = useRef({
    onEventResize,
    timejiange,
    begintime,
    endtime
  });
  
  useEffect(() => {
    configRef.current = { onEventResize, timejiange, begintime, endtime };
  }, [onEventResize, timejiange, begintime, endtime]);

  const getTimeBounds = useCallback(() => {
    const [startH, startM] = begintime.split(':').map(Number);
    const [endH, endM] = endtime.split(':').map(Number);
    return {
      minMinutes: startH * 60 + startM,
      maxMinutes: endH * 60 + endM
    };
  }, [begintime, endtime]);

  const handleResizeStart = useCallback((e, event, resourceId, direction) => {
    try {
      if (resizeRef.current) {
        return;
      }

      if (event.isBackground) return;

      e.preventDefault();

      const container = document.querySelector(`[data-resource-id="${resourceId}"]`);
      if (!container) {
        console.error('[useDragResize] ❌ 未找到 data-resource-id 容器, resourceId:', resourceId);
        return;
      }

      const rect = container.getBoundingClientRect();
      
      if (rect.height === 0) {
        console.error('[useDragResize] ❌ 容器高度为 0');
        return;
      }

      const { minMinutes, maxMinutes } = getTimeBounds();

      const [startH, startM] = event.startTime.split(':').map(Number);
      const [endH, endM] = event.endTime.split(':').map(Number);
      const eventStartMin = startH * 60 + startM;
      const eventEndMin = endH * 60 + endM;

      resizeRef.current = {
        eventId: event.id,
        resourceId,
        direction,
        startY: e.clientY,
        containerHeight: rect.height,
        totalMinutes: maxMinutes - minMinutes,
        minMinutes,
        maxMinutes,
        originalStartMin: eventStartMin,
        originalEndMin: eventEndMin,
        previewStartMin: eventStartMin,
        previewEndMin: eventEndMin
      };

      document.body.style.userSelect = 'none';
      setIsResizing(true);
      setResizeState({
        eventId: event.id,
        direction,
        previewStartMin: eventStartMin,
        previewEndMin: eventEndMin
      });
    } catch (error) {
      console.error('[useDragResize] ❌ handleResizeStart 错误:', error);
    }
  }, [getTimeBounds]);

  useEffect(() => {
    const handleMouseMove = (moveEvent) => {
      if (!resizeRef.current) return;

      const {
        startY,
        containerHeight,
        totalMinutes,
        minMinutes,
        maxMinutes,
        originalStartMin,
        originalEndMin,
        direction
      } = resizeRef.current;

      const { timejiange } = configRef.current;

      const deltaY = moveEvent.clientY - startY;
      let deltaMinutes = pixelToMinutes(deltaY, containerHeight, totalMinutes);
      deltaMinutes = snapToGrid(deltaMinutes, timejiange);

      let newStartMin = originalStartMin;
      let newEndMin = originalEndMin;

      if (direction === 'top') {
        newStartMin = originalStartMin + deltaMinutes;
        const maxStart = newEndMin - timejiange;
        newStartMin = Math.max(minMinutes, Math.min(maxStart, newStartMin));
        newStartMin = minMinutes + findNearestBar(resizeRef.current.resourceId, 'top', newStartMin - minMinutes, originalStartMin - minMinutes, containerHeight, totalMinutes);
      } else {
        newEndMin = originalEndMin + deltaMinutes;
        const minEnd = newStartMin + timejiange;
        newEndMin = Math.max(minEnd, Math.min(maxMinutes, newEndMin));
        newEndMin = minMinutes + findNearestBar(resizeRef.current.resourceId, 'bottom', newEndMin - minMinutes, originalEndMin - minMinutes, containerHeight, totalMinutes);
      }

      resizeRef.current.previewStartMin = newStartMin;
      resizeRef.current.previewEndMin = newEndMin;
      
      requestAnimationFrame(() => {
        if (!resizeRef.current) return;
        setResizeState({
          eventId: resizeRef.current.eventId,
          direction,
          previewStartMin: newStartMin,
          previewEndMin: newEndMin
        });
      });
    };

    const handleMouseUp = () => {
      if (!resizeRef.current) return;

      const { onEventResize } = configRef.current;
      const { eventId, previewStartMin, previewEndMin, originalStartMin, originalEndMin } = resizeRef.current;

      if (previewStartMin === originalStartMin && previewEndMin === originalEndMin) {
        document.body.style.userSelect = '';
        setIsResizing(false);
        setResizeState(null);
        resizeRef.current = null;
        return;
      }

      var formatTime = function(minutes) {
        var h = Math.floor(minutes / 60).toString().padStart(2, '0');
        var m = (minutes % 60).toString().padStart(2, '0');
        return h + ':' + m + ':00';
      };

      if (onEventResize) {
        try {
        onEventResize({
          type: 'RESIZE',
          eventId,
          newStart: formatTime(previewStartMin),
          newEnd: formatTime(previewEndMin)
        });
        } catch (e) { console.error('[useDragResize] onEventResize 回调异常:', e); }
      }

      document.body.style.userSelect = '';
      var dir = resizeRef.current.direction;
      resizeRef.current = null;
      setIsResizing(false);
      setResizeState({
        eventId: eventId,
        direction: dir,
        previewStartMin: previewStartMin,
        previewEndMin: previewEndMin,
        _final: true
      });
      setTimeout(function() {
        setResizeState(null);
      }, 2000);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    const handleMouseLeave = () => {
      if (resizeRef.current) {
        document.body.style.userSelect = '';
        setIsResizing(false);
        setResizeState(null);
        resizeRef.current = null;
      }
    };
    
    const handleBlur = () => {
      if (resizeRef.current) {
        document.body.style.userSelect = '';
        setIsResizing(false);
        setResizeState(null);
        resizeRef.current = null;
      }
    };
    
    const handleVisibilityChange = () => {
      if (document.hidden && resizeRef.current) {
        document.body.style.userSelect = '';
        setIsResizing(false);
        setResizeState(null);
        resizeRef.current = null;
      }
    };
    
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    isResizing,
    resizeState,
    handleResizeStart
  };
}
