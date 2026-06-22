/**
 * 事件重叠并排布局算法
 * 
 * 检测同一资源列中时间重叠的事件，计算水平偏移量和宽度，实现并排显示。
 */

/**
 * 计算事件的重叠分组和布局位置
 * 
 * @param {Array} events - 同一资源列的事件列表（已按 startTime 排序）
 * @returns {Array} 每个事件的布局信息 { left, width, zIndex }
 */
export function calculateEventLayout(events) {
  const Z_BAR_MAIN = 3;
  if (!events || events.length === 0) {
    return [];
  }

  // 为每个事件初始化布局信息
  const layout = events.map(() => ({
    left: 0,
    width: 100,
    zIndex: Z_BAR_MAIN
  }));

  // 找出所有重叠组
  const groups = findOverlapGroups(events);

  // 为每个重叠组计算布局
  groups.forEach(group => {
    if (group.length === 1) {
      // 单个事件，无需调整
      return;
    }

    // 多个事件重叠，计算并排布局
    const columnWidth = 100 / group.length;
    
    group.forEach((eventIndex, position) => {
      layout[eventIndex].left = position * columnWidth;
      layout[eventIndex].width = columnWidth;
      layout[eventIndex].zIndex = Z_BAR_MAIN + position; // 后面的事件 z-index 更高
    });
  });

  return layout;
}

/**
 * 找出所有重叠的事件组
 * 
 * @param {Array} events - 事件列表
 * @returns {Array<Array<number>>} 重叠组的索引数组
 */
function findOverlapGroups(events) {
  const groups = [];
  const visited = new Set();

  for (let i = 0; i < events.length; i++) {
    if (visited.has(i)) continue;

    const group = [i];
    visited.add(i);

    // 查找与当前事件重叠的所有事件
    for (let j = i + 1; j < events.length; j++) {
      if (visited.has(j)) continue;

      // 检查是否与组内任意事件重叠
      const overlapsWithGroup = group.some(idx => 
        isOverlapping(events[idx], events[j])
      );

      if (overlapsWithGroup) {
        group.push(j);
        visited.add(j);
      }
    }

    if (group.length > 1) {
      groups.push(group);
    }
  }

  return groups;
}

/**
 * 判断两个事件是否时间重叠
 * 
 * @param {Object} ev1 - 事件1（包含 startTime, endTime）
 * @param {Object} ev2 - 事件2（包含 startTime, endTime）
 * @returns {boolean} 是否重叠
 */
function isOverlapping(ev1, ev2) {
  const start1 = timeToMinutes(ev1.startTime);
  const end1 = timeToMinutes(ev1.endTime);
  const start2 = timeToMinutes(ev2.startTime);
  const end2 = timeToMinutes(ev2.endTime);

  // 边界防护：校验时间有效性，无效时间不参与重叠检测
  if (start1 >= end1 || start2 >= end2) {
    return false;
  }

  // 两个时间段重叠的条件：一个的开始时间在另一个的结束时间之前
  return start1 < end2 && start2 < end1;
}

/**
 * 将时间字符串转换为分钟数
 * 
 * @param {string} time - 时间字符串 "HH:mm:ss" 或 "HH:mm"
 * @returns {number} 分钟数
 */
function timeToMinutes(time) {
  const parts = time.split(':').map(Number);
  return parts[0] * 60 + parts[1];
}
