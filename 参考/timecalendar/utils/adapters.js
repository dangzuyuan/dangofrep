/**
 * 适配层工具函数：将标准数据格式转换为 FullCalendar TimeGrid 兼容格式
 * 【注】由于不使用付费的 resource-timegrid，我们需要手动处理多列布局逻辑
 */

/**
 * 构建 FullCalendar 事件数组
 * @param {Array} events - 标准事件列表
 * @param {Array} resources - 资源列表（用于计算列索引）
 * @param {Number} columnWidth - 每列宽度（px）
 * @param {Number} axisWidth - 时间轴宽度（px）
 */
export const buildFCEvents = (events, resources, columnWidth = 80, axisWidth = 80) => {
  return events.map(event => {
    // 找到该事件所属资源的索引
    const resourceIndex = resources.findIndex(r => r.id === event.resourceId);
    
    // 计算水平偏移量：时间轴宽度 + 索引 * 列宽
    const leftOffset = resourceIndex >= 0 ? axisWidth + (resourceIndex * columnWidth) : axisWidth;

    return {
      ...event,
      classNames: ['custom-resource-event'],
      extendedProps: {
        leftOffset,
        resourceId: event.resourceId,
        isBackground: event.isBackground || false
      },
      display: event.isBackground ? 'background' : 'auto',
      editable: !event.isBackground
    };
  });
};

/**
 * 构建 FullCalendar 资源表头信息（用于自定义渲染）
 * @param {Array} resources - 资源列表
 */
export const buildResourceHeaders = (resources) => {
  return resources.map(resource => ({
    id: resource.id,
    title: resource.title,
    group: resource.group // 部门分组信息
  }));
};
