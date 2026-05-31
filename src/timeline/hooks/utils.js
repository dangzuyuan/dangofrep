/**
 * 时间轴共享工具函数
 */

export function snapToGrid(minutes, timejiange) {
  return Math.round(minutes / timejiange) * timejiange;
}

export function pixelToMinutes(pixelY, containerHeight, totalMinutes) {
  return (pixelY / containerHeight) * totalMinutes;
}

export function minutesToPixel(minutes, containerHeight, totalMinutes) {
  return (minutes / totalMinutes) * containerHeight;
}

/**
 * 扫描列内所有 bar DOM，找到最近的事件边界
 * @param {string} resourceId - 列ID
 * @param {'top'|'bottom'} direction - 搜索方向
 * @param {number} proposedMin - 拟扩展到的分钟数
 * @param {number} originalBound - 原始边界min
 * @param {number} containerHeight - 列高px
 * @param {number} totalMinutes - 轴总分钟
 * @returns {number} 钳制后的分钟数
 */
export function findNearestBar(resourceId, direction, proposedMin, originalBound, containerHeight, totalMinutes) {
  var container = document.querySelector('[data-resource-id="' + resourceId + '"]');
  if (!container) return proposedMin;
  var cRect = container.getBoundingClientRect();
  var bars = container.querySelectorAll('[data-event-bar]');
  for (var i = 0; i < bars.length; i++) {
    var br = bars[i].getBoundingClientRect();
    if (direction === 'bottom') {
      var barTop = pixelToMinutes(br.top - cRect.top, containerHeight, totalMinutes);
      if (barTop > originalBound && barTop < proposedMin) proposedMin = barTop;
    } else {
      var barBot = pixelToMinutes(br.bottom - cRect.top, containerHeight, totalMinutes);
      if (barBot < originalBound && barBot > proposedMin) proposedMin = barBot;
    }
  }
  return proposedMin;
}
