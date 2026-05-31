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
