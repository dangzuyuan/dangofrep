/**
 * 拖拽交互 Hooks
 * 
 * 包含三个核心 Hook：
 * 1. useDragMove - 事件拖拽移动
 * 2. useDragResize - 事件拉伸调整时长
 * 3. useDragCreate - 空白区域框选新建
 */

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * 时间吸附函数（Snap to Grid）
 * @param {number} minutes - 原始分钟数
 * @param {number} timejiange - 时间步长（分钟）
 * @returns {number} 吸附后的分钟数
 */
export function snapToGrid(minutes, timejiange) {
  return Math.round(minutes / timejiange) * timejiange;
}

/**
 * 将像素位置转换为分钟偏移量
 * @param {number} pixelY - Y轴像素位置
 * @param {number} containerHeight - 容器总高度（px）
 * @param {number} totalMinutes - 总分钟数（endtime - begintime）
 * @returns {number} 分钟偏移量
 */
export function pixelToMinutes(pixelY, containerHeight, totalMinutes) {
  return (pixelY / containerHeight) * totalMinutes;
}

/**
 * 将分钟偏移量转换为像素位置
 * @param {number} minutes - 分钟偏移量
 * @param {number} containerHeight - 容器总高度（px）
 * @param {number} totalMinutes - 总分钟数
 * @returns {number} 像素位置
 */
export function minutesToPixel(minutes, containerHeight, totalMinutes) {
  return (minutes / totalMinutes) * containerHeight;
}

/**
 * Hook: 事件拖拽移动
 * 
 * 采用成熟的文档级事件监听模式（参考正式版beta1）：
 * - 在组件挂载时添加 document 级别监听器
 * - 使用 ref 管理所有状态，避免闭包问题
 * - 监听器生命周期与组件一致，不依赖 state
 * 
 * @param {Object} options
 * @param {Function} options.onEventDrop - 拖拽完成回调
 * @param {string} options.begintime - 视图开始时间 "HH:mm"
 * @param {string} options.endtime - 视图结束时间 "HH:mm"
 * @param {number} options.timejiange - 时间步长（分钟）
 * @param {Array} options.resources - 资源列表
 * 
 * @returns {Object} { isDragging, dragState, handleMouseDown }
 */
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
  
  // 使用 ref 存储最新的配置，避免闭包问题
  const configRef = useRef({
    onEventDrop,
    timejiange,
    begintime,
    endtime
  });
  
  // 更新 configRef（每次 props 变化时同步）
  useEffect(() => {
    configRef.current = { onEventDrop, timejiange, begintime, endtime };
  }, [onEventDrop, timejiange, begintime, endtime]);

  /**
   * 计算时间边界（begintime/endtime 对应的分钟数）
   */
  const getTimeBounds = useCallback(() => {
    const [startH, startM] = begintime.split(':').map(Number);
    const [endH, endM] = endtime.split(':').map(Number);
    return {
      minMinutes: startH * 60 + startM,
      maxMinutes: endH * 60 + endM
    };
  }, [begintime, endtime]);

  /**
   * 处理鼠标按下事件卡片
   */
  const handleMouseDown = useCallback((e, event, resourceId) => {
    try {
    // 防重复启动保护
    if (dragRef.current) {
      console.log('[useDragMove] ⚠️ 拖拽已在进行中，忽略重复启动');
      return;
    }

    // 背景事件不可拖拽
    if (event.isBackground) return;

    // [修复] 移除 preventDefault/stopPropagation
    const container = e.currentTarget.closest('[data-resource-column]');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const { minMinutes, maxMinutes } = getTimeBounds();

    // 解析事件的起止时间（纯时间字符串 "HH:mm:ss"）
    const [startH, startM] = event.startTime.split(':').map(Number);
    const [endH, endM] = event.endTime.split(':').map(Number);
    const eventStartMin = startH * 60 + startM;
    const eventEndMin = endH * 60 + endM;
    const eventDuration = eventEndMin - eventStartMin;

    // 记录初始状态
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
      previewStartMin: eventStartMin,  // 初始化预览时间
      previewEndMin: eventEndMin,      // 初始化预览时间
      newResourceId: resourceId        // 初始化新资源ID
    };

    // [修复] RAF delay 允许 click 先完成
    requestAnimationFrame(function() {
      if (!dragRef.current) return;
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

  // 在组件挂载时添加 document 级别的监听器（参考正式版beta1）
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

      // 从 configRef 读取最新配置
      const { timejiange } = configRef.current;

      // 计算鼠标移动的像素偏移
      const deltaY = moveEvent.clientY - startY;

      // 转换为分钟偏移
      let deltaMinutes = pixelToMinutes(deltaY, containerHeight, totalMinutes);

      // 应用时间吸附
      deltaMinutes = snapToGrid(deltaMinutes, timejiange);

      // 计算新的起始时间（带边界约束）
      let newStartMin = originalStartMin + deltaMinutes;
      let newEndMin = newStartMin + eventDuration;

      // 统一边界钳位（避免互相覆盖）
      const maxStart = maxMinutes - eventDuration;
      newStartMin = Math.max(minMinutes, Math.min(maxStart, newStartMin));
      newEndMin = newStartMin + eventDuration;

      // 检测是否跨越到其他资源列
      const currentColumn = moveEvent.target && moveEvent.target.closest && moveEvent.target.closest('[data-resource-column]');
      let newResourceId = dragRef.current.originalResourceId;
      if (currentColumn) {
        newResourceId = currentColumn.dataset.resourceId;
      }

      // 更新 ref 中的预览状态
      dragRef.current.previewStartMin = newStartMin;
      dragRef.current.previewEndMin = newEndMin;
      dragRef.current.newResourceId = newResourceId;
      
      // 异步更新 state 用于 UI 渲染
      requestAnimationFrame(() => {
        if (!dragRef.current) return;  // RAF 空值守卫，防止 cleanup 后访问 null
        setDragState({
          eventId: dragRef.current.eventId,
          resourceId: newResourceId,
          offsetY: deltaY,
          previewStartMin: newStartMin,
          previewEndMin: newEndMin
        });
      });
    };

    const handleMouseUp = () => {
      if (!dragRef.current) return;

      const { onEventDrop } = configRef.current;
      const { eventId, previewStartMin, previewEndMin, originalResourceId, newResourceId, originalStartMin } = dragRef.current;

      if (previewStartMin === originalStartMin) {
        setIsDragging(false);
        setDragState(null);
        dragRef.current = null;
        return;
      }

      // 格式化时间为 "HH:mm:ss"
      const formatTime = (minutes) => {
        const h = Math.floor(minutes / 60).toString().padStart(2, '0');
        const m = (minutes % 60).toString().padStart(2, '0');
        return `${h}:${m}:00`;
      };

      // 触发回调，返回增量操作对象
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

      // 清理状态
      setIsDragging(false);
      setDragState(null);
      dragRef.current = null;
    };

    // 添加全局监听器（只在组件挂载时添加一次）
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // 异常清理机制：防止鼠标在窗口外松开导致状态卡死
    const handleMouseLeave = () => {
      console.log('[useDragMove] ⚠️ 鼠标离开窗口，强制清理拖拽状态');
      if (dragRef.current) {
        setIsDragging(false);
        setDragState(null);
        dragRef.current = null;
      }
    };
    
    const handleBlur = () => {
      console.log('[useDragMove] ⚠️ 窗口失去焦点，强制清理拖拽状态');
      if (dragRef.current) {
        setIsDragging(false);
        setDragState(null);
        dragRef.current = null;
      }
    };
    
    const handleVisibilityChange = () => {
      if (document.hidden && dragRef.current) {
        console.log('[useDragMove] ⚠️ 页面隐藏，强制清理拖拽状态');
        setIsDragging(false);
        setDragState(null);
        dragRef.current = null;
      }
    };
    
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 清理函数（组件卸载时移除）
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // 空依赖数组，只在挂载时运行一次

  return {
    isDragging,
    dragState,
    handleMouseDown
  };
}

/**
 * Hook: 事件拉伸调整时长
 * 
 * 采用成熟的文档级事件监听模式（参考正式版beta1）：
 * - 在组件挂载时添加 document 级别监听器
 * - 使用 ref 管理所有状态，避免闭包问题
 * - 监听器生命周期与组件一致，不依赖 state
 * 
 * @param {Object} options
 * @param {Function} options.onEventResize - 拉伸完成回调
 * @param {string} options.begintime - 视图开始时间
 * @param {string} options.endtime - 视图结束时间
 * @param {number} options.timejiange - 时间步长
 * 
 * @returns {Object} { isResizing, resizeState, handleResizeStart }
 */
export function useDragResize({
  onEventResize,
  begintime,
  endtime,
  timejiange
}) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeState, setResizeState] = useState(null);
  const resizeRef = useRef(null);
  
  // 使用 ref 存储最新的配置，避免闭包问题
  const configRef = useRef({
    onEventResize,
    timejiange,
    begintime,
    endtime
  });
  
  // 更新 configRef（每次 props 变化时同步）
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

  /**
   * 处理拉伸开始（鼠标按下事件卡片顶部或底部边缘）
   */
  const handleResizeStart = useCallback((e, event, resourceId, direction) => {
    try {
      // 防重复启动保护
      if (resizeRef.current) {
        return;
      }

      if (event.isBackground) return;

      // [修复] 移除 preventDefault/stopPropagation

      // 通过 resourceId 直接查找对应的 StaffColumn 容器
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

      // 设置 dragRef
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

  // 在组件挂载时添加 document 级别的监听器（参考正式版beta1）
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

      // 从 configRef 读取最新配置
      const { timejiange } = configRef.current;

      const deltaY = moveEvent.clientY - startY;
      let deltaMinutes = pixelToMinutes(deltaY, containerHeight, totalMinutes);
      deltaMinutes = snapToGrid(deltaMinutes, timejiange);

      let newStartMin = originalStartMin;
      let newEndMin = originalEndMin;

      if (direction === 'top') {
        // 拉伸顶部：改变开始时间
        newStartMin = originalStartMin + deltaMinutes;
        
        // 统一边界钳位（避免互相覆盖）
        const maxStart = newEndMin - timejiange; // 最多只能拉伸到结束时间之前一个步长
        newStartMin = Math.max(minMinutes, Math.min(maxStart, newStartMin));
      } else {
        // 拉伸底部：改变结束时间
        newEndMin = originalEndMin + deltaMinutes;
        
        // 统一边界钳位（避免互相覆盖）
        const minEnd = newStartMin + timejiange; // 最少要保持一个步长的持续时间
        newEndMin = Math.max(minEnd, Math.min(maxMinutes, newEndMin));
      }

      // 更新 ref 中的预览状态
      resizeRef.current.previewStartMin = newStartMin;
      resizeRef.current.previewEndMin = newEndMin;
      
      // 异步更新 state 用于 UI 渲染
      requestAnimationFrame(() => {
        if (!resizeRef.current) return;  // RAF 空值守卫，防止 cleanup 后访问 null
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
        setIsResizing(false);
        setResizeState(null);
        resizeRef.current = null;
        return;
      }

      // 格式化时间为 "HH:mm:ss"
      const formatTime = (minutes) => {
        const h = Math.floor(minutes / 60).toString().padStart(2, '0');
        const m = (minutes % 60).toString().padStart(2, '0');
        return `${h}:${m}:00`;
      };

      // 触发回调
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

      // 清理状态
      setIsResizing(false);
      setResizeState(null);
      resizeRef.current = null;
    };

    // 添加全局监听器（只在组件挂载时添加一次）
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // 异常清理机制：防止鼠标在窗口外松开导致状态卡死
    const handleMouseLeave = () => {
      console.log('[useDragResize] ⚠️ 鼠标离开窗口，强制清理拉伸状态');
      if (resizeRef.current) {
        setIsResizing(false);
        setResizeState(null);
        resizeRef.current = null;
      }
    };
    
    const handleBlur = () => {
      console.log('[useDragResize] ⚠️ 窗口失去焦点，强制清理拉伸状态');
      if (resizeRef.current) {
        setIsResizing(false);
        setResizeState(null);
        resizeRef.current = null;
      }
    };
    
    const handleVisibilityChange = () => {
      if (document.hidden && resizeRef.current) {
        console.log('[useDragResize] ⚠️ 页面隐藏，强制清理拉伸状态');
        setIsResizing(false);
        setResizeState(null);
        resizeRef.current = null;
      }
    };
    
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 清理函数（组件卸载时移除）
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // 空依赖数组，只在挂载时运行一次

  return {
    isResizing,
    resizeState,
    handleResizeStart
  };
}

/**
 * Hook: 空白区域框选新建
 * 
 * @param {Object} options
 * @param {Function} options.onSelectSlot - 框选完成回调
 * @param {string} options.begintime - 视图开始时间
 * @param {string} options.endtime - 视图结束时间
 * @param {number} options.timejiange - 时间步长
 * 
 * @returns {Object} { isSelecting, selectState, handleSelectStart }
 */
export function useDragCreate({
  onSelectSlot,
  begintime,
  endtime,
  timejiange
}) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectState, setSelectState] = useState(null);
  const selectRef = useRef(null);
  
  // 使用 ref 存储最新的配置，避免闭包问题
  const configRef = useRef({
    onSelectSlot,
    timejiange,
    begintime,
    endtime
  });
  
  // 更新 configRef（每次 props 变化时同步）
  useEffect(() => {
    configRef.current = { onSelectSlot, timejiange, begintime, endtime };
  }, [onSelectSlot, timejiange, begintime, endtime]);

  const getTimeBounds = useCallback(() => {
    const [startH, startM] = begintime.split(':').map(Number);
    const [endH, endM] = endtime.split(':').map(Number);
    return {
      minMinutes: startH * 60 + startM,
      maxMinutes: endH * 60 + endM
    };
  }, [begintime, endtime]);

  /**
   * 处理空白区域鼠标按下
   */
  const handleSelectStart = useCallback((e, resourceId) => {
    try {
    // 如果点击的是事件卡片，不触发框选
    if (e.target && e.target.closest && e.target.closest('[data-event-bar]')) return;

    const container = e.currentTarget.closest('[data-resource-column]');
    if (!container) return;

    // [修复] 移除 preventDefault
    const rect = container.getBoundingClientRect();
    const { minMinutes, maxMinutes } = getTimeBounds();

    selectRef.current = {
      resourceId,
      startY: pixelToMinutes(e.clientY - rect.top, rect.height, maxMinutes - minMinutes), // 存储分钟数而非像素值
      containerHeight: rect.height,
      totalMinutes: maxMinutes - minMinutes,
      minMinutes,
      maxMinutes,
      startMin: pixelToMinutes(e.clientY - rect.top, rect.height, maxMinutes - minMinutes),
      endMin: pixelToMinutes(e.clientY - rect.top, rect.height, maxMinutes - minMinutes)
    };

    setIsSelecting(true);
    setSelectState({
      resourceId,
      startMin: selectRef.current.startMin,
      endMin: selectRef.current.endMin
    });
    } catch (error) {
      console.error('[useDragCreate] ❌ handleSelectStart 错误:', error);
    }
  }, [getTimeBounds]);

  // 在组件挂载时添加 document 级别的监听器（参考正式版beta1）
  useEffect(() => {
    const handleMouseMove = (moveEvent) => {
      if (!selectRef.current) return;

      const {
        containerHeight,
        totalMinutes,
        minMinutes,
        maxMinutes
      } = selectRef.current;

      // 从 body 获取容器（因为事件在 document 级别）
      const container = document.querySelector(`[data-resource-id="${selectRef.current.resourceId}"]`);
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const currentY = moveEvent.clientY - rect.top;
      let currentMin = pixelToMinutes(currentY, containerHeight, totalMinutes);

      // 边界约束
      currentMin = Math.max(minMinutes, Math.min(maxMinutes, currentMin));

      // 使用分钟数进行比较和计算
      const startMin = Math.min(selectRef.current.startMin, currentMin);
      const endMin = Math.max(selectRef.current.startMin, currentMin);
      
      // 更新 ref 中的预览状态
      selectRef.current.startMin = startMin;
      selectRef.current.endMin = endMin;
      
      // 异步更新 state 用于 UI 渲染
      requestAnimationFrame(() => {
        if (!selectRef.current) return;  // RAF 空值守卫，防止 cleanup 后访问 null
        setSelectState({
          resourceId: selectRef.current.resourceId,
          startMin,
          endMin
        });
      });
    };

    const handleMouseUp = () => {
      if (!selectRef.current) {
        cleanup();
        return;
      }

      const { onSelectSlot, timejiange } = configRef.current;
      const { resourceId, startMin, endMin } = selectRef.current; // 从 ref 读取最新值

      if (!onSelectSlot) {
        cleanup();
        return;
      }

      // 最小时间间隔检查（至少一个 timejiange）
      if (Math.abs(endMin - startMin) < timejiange) {
        cleanup();
        return;
      }

      const formatTime = (minutes) => {
        const h = Math.floor(minutes / 60).toString().padStart(2, '0');
        const m = (minutes % 60).toString().padStart(2, '0');
        return `${h}:${m}:00`;
      };

      try {
      onSelectSlot({
        type: 'CREATE',
        resourceId,
        start: formatTime(Math.min(startMin, endMin)),
        end: formatTime(Math.max(startMin, endMin))
      });
      } catch (e) { console.error('[useDragCreate] onSelectSlot 回调异常:', e); }

      cleanup();
    };

    const cleanup = () => {
      setIsSelecting(false);
      setSelectState(null);
      selectRef.current = null;
    };

    // 添加全局监听器（只在组件挂载时添加一次）
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // 异常清理机制：防止鼠标在窗口外松开导致状态卡死
    const handleMouseLeave = () => {
      console.log('[useDragCreate] ⚠️ 鼠标离开窗口，强制清理框选状态');
      if (selectRef.current) {
        cleanup();
      }
    };
    
    const handleBlur = () => {
      console.log('[useDragCreate] ⚠️ 窗口失去焦点，强制清理框选状态');
      if (selectRef.current) {
        cleanup();
      }
    };
    
    const handleVisibilityChange = () => {
      if (document.hidden && selectRef.current) {
        console.log('[useDragCreate] ⚠️ 页面隐藏，强制清理框选状态');
        cleanup();
      }
    };
    
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 清理函数（组件卸载时移除）
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // 空依赖数组，只在挂载时运行一次

  return {
    isSelecting,
    selectState,
    handleSelectStart
  };
}
