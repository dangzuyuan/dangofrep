/**
 * 事件数据组装器
 * 
 * 职责：
 * 1. 接收多种格式的原始事件数据
 * 2. 根据 currentDate 过滤出当天的事件
 * 3. 处理时区转换（如需要）
 * 4. 裁剪跨天事件到视图范围内
 * 5. 输出标准化的纯时间格式给 TimeCalendar
 * 
 * 架构原则：
 * - 时间视图组件只负责渲染，不处理时区、日期过滤等逻辑
 * - 所有数据预处理都在此模块完成
 */

/**
 * 判断事件是否在目标日期可见
 * @param {Object} event - 原始事件对象
 * @param {string} targetDate - 目标日期 (YYYY-MM-DD)
 * @returns {boolean}
 */
function isEventOnDate(event, targetDate) {
  try {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    
    if (isNaN(eventStart.getTime()) || isNaN(eventEnd.getTime())) {
      console.warn(`[eventAssembler] 无效的时间格式: ${event.id}`);
      return false;
    }
    
    const eventDate = event.start.split('T')[0];
    return eventDate === targetDate;
  } catch (error) {
    console.warn(`[eventAssembler] 检查事件日期失败: ${event.id}`, error);
    return false;
  }
}

/**
 * 验证事件时间的有效性
 * @param {Object} event - 标准化后的事件对象
 * @returns {boolean}
 */
function validateEvent(event) {
  const [startH, startM, startS] = event.startTime.split(':').map(Number);
  const [endH, endM, endS] = event.endTime.split(':').map(Number);
  
  // 检查时间范围
  if (startH < 0 || startH > 23 || endH < 0 || endH > 23) {
    console.warn(`[eventAssembler] 跳过无效事件 ${event.id}: 小时超出范围`);
    return false;
  }
  
  if (startM < 0 || startM > 59 || endM < 0 || endM > 59) {
    console.warn(`[eventAssembler] 跳过无效事件 ${event.id}: 分钟超出范围`);
    return false;
  }
  
  if (startS < 0 || startS > 59 || endS < 0 || endS > 59) {
    console.warn(`[eventAssembler] 跳过无效事件 ${event.id}: 秒数超出范围`);
    return false;
  }
  
  // 检查开始时间是否早于结束时间
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  
  if (startMinutes >= endMinutes) {
    console.warn(`[eventAssembler] 跳过无效事件 ${event.id}: 开始时间晚于或等于结束时间`);
    return false;
  }
  
  return true;
}

/**
 * 从 ISO 8601 格式提取纯时间字符串
 * @param {string} datetime - "2026-05-28T09:00:00"
 * @returns {string} "09:00:00"
 */
function extractTimeFromISO(datetime) {
  if (!datetime || typeof datetime !== 'string') {
    throw new Error(`无效的时间格式: ${datetime}`);
  }
  
  const parts = datetime.split('T');
  if (parts.length !== 2) {
    throw new Error(`无法解析的时间格式: ${datetime}`);
  }
  
  const timePart = parts[1];
  
  // 确保格式为 HH:mm:ss
  const [h, m, s] = timePart.split(':');
  if (!h || !m) {
    throw new Error(`不完整的时间格式: ${datetime}`);
  }
  
  const seconds = s || '00';
  return `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
}

/**
 * 从 Date 对象提取纯时间字符串
 * @param {Date} dateObj - Date 对象
 * @returns {string} "09:00:00"
 */
function extractTimeFromDate(dateObj) {
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    throw new Error('无效的 Date 对象');
  }
  
  const h = dateObj.getHours().toString().padStart(2, '0');
  const m = dateObj.getMinutes().toString().padStart(2, '0');
  const s = dateObj.getSeconds().toString().padStart(2, '0');
  
  return `${h}:${m}:${s}`;
}

/**
 * 标准化单个事件
 * @param {Object} event - 原始事件对象
 * @returns {Object|null} 标准化后的事件，或 null（如果无效）
 */
function normalizeEvent(event) {
  try {
    let startTime, endTime;
    
    // 检测输入格式并提取时间
    if (typeof event.start === 'string' && event.start.includes('T')) {
      // 格式 A: ISO 8601
      startTime = extractTimeFromISO(event.start);
      endTime = extractTimeFromISO(event.end);
    } else if (event.start instanceof Date) {
      // 格式 C: Date 对象
      startTime = extractTimeFromDate(event.start);
      endTime = extractTimeFromDate(event.end);
    } else if (typeof event.start === 'string' && !event.start.includes('-')) {
      // 已经是纯时间格式
      startTime = event.start;
      endTime = event.end;
    } else {
      console.warn(`[eventAssembler] 不支持的事件格式: ${event.id}`);
      return null;
    }
    
    // 构建标准化事件
    const normalized = {
      id: event.id,
      resourceId: event.resourceId,
      startTime,
      endTime,
      title: event.title || '',
      color: event.color || '#1890ff',
      isBackground: event.isBackground || false,
      draggable: event.draggable !== undefined ? event.draggable : !(event.isBackground || false),
      resizable: event.resizable !== undefined ? event.resizable : !(event.isBackground || false),
      description: event.description || '',
      attendees: event.attendees || []
    };
    
    // 验证标准化后的事件
    if (!validateEvent(normalized)) {
      return null;
    }
    
    return normalized;
  } catch (error) {
    console.warn(`[eventAssembler] 标准化事件失败: ${event.id}`, error);
    return null;
  }
}

/**
 * 裁剪事件到视图时间范围内
 * @param {Object} event - 标准化后的事件
 * @param {string} begintime - 视图开始时间 "HH:mm"
 * @param {string} endtime - 视图结束时间 "HH:mm"
 * @returns {Object|null} 裁剪后的事件，或 null（如果完全在视图外）
 */
function clipToViewRange(event, begintime, endtime) {
  try {
    const [viewStartH, viewStartM] = begintime.split(':').map(Number);
    const [viewEndH, viewEndM] = endtime.split(':').map(Number);
    
    const [eventStartH, eventStartM] = event.startTime.split(':').map(Number);
    const [eventEndH, eventEndM] = event.endTime.split(':').map(Number);
    
    const viewStartMin = viewStartH * 60 + viewStartM;
    const viewEndMin = viewEndH * 60 + viewEndM;
    const eventStartMin = eventStartH * 60 + eventStartM;
    const eventEndMin = eventEndH * 60 + eventEndM;
    
    // 裁剪到视图范围内
    const clippedStartMin = Math.max(eventStartMin, viewStartMin);
    const clippedEndMin = Math.min(eventEndMin, viewEndMin);
    
    // 如果裁剪后无效（完全在视图外），返回 null
    if (clippedStartMin >= clippedEndMin) {
      console.log(`[eventAssembler] 事件 ${event.id} 完全在视图范围外，跳过`);
      return null;
    }
    
    // 如果不需要裁剪，直接返回原事件
    if (clippedStartMin === eventStartMin && clippedEndMin === eventEndMin) {
      return event;
    }
    
    // 转换回 HH:mm:ss 格式
    const clippedStartH = Math.floor(clippedStartMin / 60).toString().padStart(2, '0');
    const clippedStartM = (clippedStartMin % 60).toString().padStart(2, '0');
    const clippedEndH = Math.floor(clippedEndMin / 60).toString().padStart(2, '0');
    const clippedEndM = (clippedEndMin % 60).toString().padStart(2, '0');
    
    return {
      ...event,
      startTime: `${clippedStartH}:${clippedStartM}:00`,
      endTime: `${clippedEndH}:${clippedEndM}:00`,
      _isClipped: true  // 标记已被裁剪
    };
  } catch (error) {
    console.warn(`[eventAssembler] 裁剪事件失败: ${event.id}`, error);
    return null;
  }
}

/**
 * 主函数：组装事件数组
 * 
 * @param {Array} rawEvents - 原始事件数组（支持多种格式）
 * @param {string} targetDate - 目标日期 (YYYY-MM-DD)
 * @param {Object} options - 配置选项
 * @param {string} options.begintime - 视图开始时间 "HH:mm"，默认 "07:00"
 * @param {string} options.endtime - 视图结束时间 "HH:mm"，默认 "23:00"
 * @param {string} options.timezone - 时区，默认 "Asia/Shanghai"
 * 
 * @returns {Array} 标准化后的事件数组（可能为空数组）
 * 
 * @example
 * const events = assembleEvents(
 *   rawEvents,
 *   "2026-05-28",
 *   { begintime: "07:00", endtime: "23:00" }
 * );
 */
export function assembleEvents(rawEvents, targetDate, options = {}) {
  const {
    begintime = "07:00",
    endtime = "23:00",
    timezone = "Asia/Shanghai"
  } = options;
  
  // 参数验证
  if (!Array.isArray(rawEvents)) {
    console.warn('[eventAssembler] rawEvents 必须是数组');
    return [];
  }
  
  if (!targetDate || typeof targetDate !== 'string') {
    console.warn('[eventAssembler] targetDate 必须是非空字符串');
    return [];
  }
  
  // 处理流程：过滤 → 标准化 → 裁剪 → 过滤无效
  const processedEvents = rawEvents
    .filter(ev => isEventOnDate(ev, targetDate))
    .map(ev => normalizeEvent(ev))
    .filter(ev => ev !== null)
    .map(ev => clipToViewRange(ev, begintime, endtime))
    .filter(ev => ev !== null);
  
  console.log(`[eventAssembler] 处理完成: ${rawEvents.length} → ${processedEvents.length} 个事件`);
  
  return processedEvents;
}

/**
 * 辅助函数：计算事件的持续时长（分钟）
 * @param {Object} event - 标准化后的事件
 * @returns {number} 时长（分钟）
 */
export function getEventDuration(event) {
  const [startH, startM] = event.startTime.split(':').map(Number);
  const [endH, endM] = event.endTime.split(':').map(Number);
  
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  
  return endMinutes - startMinutes;
}

/**
 * 辅助函数：判断两个事件是否重叠
 * @param {Object} event1 - 事件1
 * @param {Object} event2 - 事件2
 * @returns {boolean}
 */
export function areEventsOverlapping(event1, event2) {
  const [start1H, start1M] = event1.startTime.split(':').map(Number);
  const [end1H, end1M] = event1.endTime.split(':').map(Number);
  const [start2H, start2M] = event2.startTime.split(':').map(Number);
  const [end2H, end2M] = event2.endTime.split(':').map(Number);
  
  const start1 = start1H * 60 + start1M;
  const end1 = end1H * 60 + end1M;
  const start2 = start2H * 60 + start2M;
  const end2 = end2H * 60 + end2M;
  
  return start1 < end2 && start2 < end1;
}
