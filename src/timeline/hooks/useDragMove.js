import { useState, useCallback, useRef, useEffect } from 'react';
import { snapToGrid, pixelToMinutes } from './utils';
import { scanColumnOverlap } from './overlapScanner';

export function useDragMove({
  onEventDrop,
  begintime,
  endtime,
  timejiange,
  resources
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragState, setDragState] = useState(null);
  const dragRef = useRef(null);
  
  const configRef = useRef({
    onEventDrop,
    timejiange,
    begintime,
    endtime
  });
  
  useEffect(() => {
    configRef.current = { onEventDrop, timejiange, begintime, endtime };
  }, [onEventDrop, timejiange, begintime, endtime]);

  const getTimeBounds = useCallback(() => {
    const [startH, startM] = begintime.split(':').map(Number);
    const [endH, endM] = endtime.split(':').map(Number);
    return {
      minMinutes: startH * 60 + startM,
      maxMinutes: endH * 60 + endM
    };
  }, [begintime, endtime]);

  const handleMouseDown = useCallback((e, event, resourceId) => {
    try {
    if (dragRef.current) return;

    if (event.isBackground) return;

    const container = e.currentTarget.closest('[data-resource-column]');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const { minMinutes, maxMinutes } = getTimeBounds();

    const [startH, startM] = event.startTime.split(':').map(Number);
    const [endH, endM] = event.endTime.split(':').map(Number);
    const eventStartMin = startH * 60 + startM;
    const eventEndMin = endH * 60 + endM;
    const eventDuration = eventEndMin - eventStartMin;

    dragRef.current = {
      eventId: event.id,
      originalResourceId: resourceId,
      startY: e.clientY,
      startTop: e.clientY - rect.top,
      containerHeight: rect.height,
      totalMinutes: maxMinutes - minMinutes,
      minMinutes,
      maxMinutes,
      eventDuration,
      originalStartMin: eventStartMin,
      previewStartMin: eventStartMin,
      previewEndMin: eventEndMin,
      newResourceId: resourceId
    };

    requestAnimationFrame(function() {
      if (!dragRef.current) return;
      document.body.style.userSelect = 'none';
      setIsDragging(true);
      setDragState({
        eventId: event.id,
        resourceId,
        offsetY: 0,
        previewStartMin: eventStartMin,
        previewEndMin: eventEndMin
      });
    });
    } catch (error) {
      console.error('[useDragMove] ❌ handleMouseDown 错误:', error);
    }
  }, [getTimeBounds]);

  useEffect(() => {
    const handleMouseMove = (moveEvent) => {
      if (!dragRef.current) return;

      const {
        startY,
        containerHeight,
        totalMinutes,
        minMinutes,
        maxMinutes,
        eventDuration,
        originalStartMin
      } = dragRef.current;

      const { timejiange } = configRef.current;

      const deltaY = moveEvent.clientY - startY;

      let deltaMinutes = pixelToMinutes(deltaY, containerHeight, totalMinutes);

      deltaMinutes = snapToGrid(deltaMinutes, timejiange);

      let newStartMin = originalStartMin + deltaMinutes;
      let newEndMin = newStartMin + eventDuration;

      const maxStart = maxMinutes - eventDuration;
      newStartMin = Math.max(minMinutes, Math.min(maxStart, newStartMin));
      newEndMin = newStartMin + eventDuration;

      const currentColumn = moveEvent.target && moveEvent.target.closest && moveEvent.target.closest('[data-resource-column]');
      let newResourceId = dragRef.current.originalResourceId;
      if (currentColumn) {
        newResourceId = currentColumn.dataset.resourceId;
      }

      dragRef.current.previewStartMin = newStartMin;
      dragRef.current.previewEndMin = newEndMin;
      dragRef.current.newResourceId = newResourceId;

      var hasOverlap = scanColumnOverlap(
        newResourceId,
        newStartMin - minMinutes,
        newEndMin - minMinutes,
        dragRef.current.eventId,
        containerHeight,
        totalMinutes
      );
      dragRef.current.isOverlapping = hasOverlap;
      
      requestAnimationFrame(() => {
        if (!dragRef.current) return;
        setDragState({
          eventId: dragRef.current.eventId,
          resourceId: newResourceId,
          offsetY: deltaY,
          previewStartMin: newStartMin,
          previewEndMin: newEndMin,
          isOverlapping: hasOverlap
        });
      });
    };

    const handleMouseUp = () => {
      if (!dragRef.current) return;

      const { onEventDrop } = configRef.current;
      const { eventId, previewStartMin, previewEndMin, originalResourceId, newResourceId, originalStartMin, isOverlapping } = dragRef.current;

      if (previewStartMin === originalStartMin && newResourceId === originalResourceId) {
        document.body.style.userSelect = '';
        setIsDragging(false);
        setDragState(null);
        dragRef.current = null;
        return;
      }

      if (isOverlapping) {
        document.body.style.userSelect = '';
        setIsDragging(false);
        setDragState(null);
        dragRef.current = null;
        return;
      }

      const formatTime = (minutes) => {
        const h = Math.floor(minutes / 60).toString().padStart(2, '0');
        const m = (minutes % 60).toString().padStart(2, '0');
        return `${h}:${m}:00`;
      };

      if (onEventDrop) {
        try {
        onEventDrop({
          type: 'MOVE',
          eventId,
          oldResourceId: originalResourceId,
          newResourceId: newResourceId || originalResourceId,
          newStart: formatTime(previewStartMin),
          newEnd: formatTime(previewEndMin)
        });
        } catch (e) { console.error('[useDragMove] onEventDrop 回调异常:', e); }
      }

      document.body.style.userSelect = '';
      dragRef.current = null;
      setTimeout(function() {
        setIsDragging(false);
        setDragState(null);
      }, 2000);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    const handleMouseLeave = () => {
      if (dragRef.current) {
        document.body.style.userSelect = '';
        setIsDragging(false);
        setDragState(null);
        dragRef.current = null;
      }
    };
    
    const handleBlur = () => {
      if (dragRef.current) {
        document.body.style.userSelect = '';
        setIsDragging(false);
        setDragState(null);
        dragRef.current = null;
      }
    };
    
    const handleVisibilityChange = () => {
      if (document.hidden && dragRef.current) {
        document.body.style.userSelect = '';
        setIsDragging(false);
        setDragState(null);
        dragRef.current = null;
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
    isDragging,
    dragState,
    handleMouseDown
  };
}
