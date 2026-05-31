/**
 * 空白区域框选新建 Hook - 基于 TimeCalendar 原始代码
 * 修复1: 移除 e.preventDefault()
 * 修复2: mousedown 吸附到网格  
 * 修复3: mouseup 转为绝对时间
 * 修复4: mousemove 使用 [0, totalMinutes] 钳制而非 [minMinutes, maxMinutes]
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { snapToGrid, pixelToMinutes, findNearestBar } from './utils';

export function useBoxSelect({ onSelectSlot, begintime, endtime, timejiange }) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectState, setSelectState] = useState(null);
  const selectRef = useRef(null);

  const configRef = useRef({ onSelectSlot, timejiange, begintime, endtime });
  useEffect(() => {
    configRef.current = { onSelectSlot, timejiange, begintime, endtime };
  }, [onSelectSlot, timejiange, begintime, endtime]);

  const getTimeBounds = useCallback(() => {
    const [startH, startM] = begintime.split(':').map(Number);
    const [endH, endM] = endtime.split(':').map(Number);
    return { minMinutes: startH * 60 + startM, maxMinutes: endH * 60 + endM };
  }, [begintime, endtime]);

  const handleSelectStart = useCallback((e, resourceId) => {
    try {
      if (e.target && e.target.closest && e.target.closest('[data-event-bar]')) return;
      const container = e.currentTarget.closest('[data-resource-column]');
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const { minMinutes, maxMinutes } = getTimeBounds();
      const rawY = pixelToMinutes(e.clientY - rect.top, rect.height, maxMinutes - minMinutes);
      const snapped = snapToGrid(rawY, timejiange);

      selectRef.current = {
        resourceId,
        containerHeight: rect.height,
        totalMinutes: maxMinutes - minMinutes,
        minMinutes,
        maxMinutes,
        startMin: snapped,
        endMin: snapped
      };

      setIsSelecting(true);
      setSelectState({ resourceId, startMin: snapped, endMin: snapped });
      document.body.style.userSelect = 'none';
    } catch (error) {
      console.error('[useBoxSelect] handleSelectStart error:', error);
    }
  }, [getTimeBounds, timejiange]);

  useEffect(() => {
    const handleMouseMove = (moveEvent) => {
      if (!selectRef.current) return;
      const { containerHeight, totalMinutes } = selectRef.current;

      const container = document.querySelector(`[data-resource-id="${selectRef.current.resourceId}"]`);
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const currentY = moveEvent.clientY - rect.top;
      var currentMin = (currentY / containerHeight) * totalMinutes;
      currentMin = Math.max(0, Math.min(totalMinutes, currentMin));

      // 钳制到最近bar边界（替换 elementFromPoint）
      if (currentMin > selectRef.current.startMin) {
        currentMin = findNearestBar(selectRef.current.resourceId, 'bottom', currentMin, selectRef.current.startMin, containerHeight, totalMinutes);
      } else if (currentMin < selectRef.current.startMin) {
        currentMin = findNearestBar(selectRef.current.resourceId, 'top', currentMin, selectRef.current.startMin, containerHeight, totalMinutes);
      }

      const sMin = Math.min(selectRef.current.startMin, currentMin);
      const eMin = Math.max(selectRef.current.startMin, currentMin);
      selectRef.current.startMin = sMin;
      selectRef.current.endMin = eMin;

      requestAnimationFrame(() => {
        if (!selectRef.current) return;
        setSelectState({ resourceId: selectRef.current.resourceId, startMin: sMin, endMin: eMin });
      });
    };

    const handleMouseUp = (e) => {
      if (!selectRef.current) { cleanup(); return; }
      const config = configRef.current;
      if (!config.onSelectSlot) { cleanup(); return; }

      const { resourceId, startMin, endMin } = selectRef.current;
      const tj = config.timejiange || 15;

      if (e && e.target && e.target.closest('[data-event-bar]')) { cleanup(); return; }
      if (Math.abs(endMin - startMin) < tj) { cleanup(); return; }

      const bm = begintime.split(':').map(Number);
      const bMin = bm[0] * 60 + bm[1];
      const absStart = bMin + Math.min(startMin, endMin);
      const absEnd = bMin + Math.max(startMin, endMin);

      const ft = (m) => {
        const h = Math.floor(m / 60).toString().padStart(2, '0');
        const mm = Math.floor(m % 60).toString().padStart(2, '0');
        return `${h}:${mm}:00`;
      };

      try {
        config.onSelectSlot({ type: 'CREATE', resourceId, start: ft(absStart), end: ft(absEnd) });
      } catch (e) { console.error('[useBoxSelect] callback error:', e); }

      cleanup();
    };

    const cleanup = () => { 
      setIsSelecting(false); setSelectState(null); selectRef.current = null;
      document.body.style.userSelect = '';
    };

    var escHandler = function(e) { if (e.key === 'Escape' && selectRef.current) cleanup(); };
    document.addEventListener('keydown', escHandler);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    const forceClean = () => { if (selectRef.current) cleanup(); };
    window.addEventListener('mouseleave', forceClean);
    window.addEventListener('blur', forceClean);
    document.addEventListener('visibilitychange', () => { if (document.hidden && selectRef.current) cleanup(); });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', escHandler);
      window.removeEventListener('mouseleave', forceClean);
      window.removeEventListener('blur', forceClean);
    };
  }, []);

  return { isSelecting, selectState, handleSelectStart };
}
