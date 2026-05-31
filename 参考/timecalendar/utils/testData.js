/**
 * 测试数据模块
 * 
 * 提供示例数据用于开发和调试，生产环境可通过开关禁用。
 */

/**
 * 生成测试配置
 */
export function generateTestConfig() {
  return {
    begintime: "07:00",
    endtime: "23:00",
    timejiange: 30,
    slotHeight: 60,
    colWidth: 72,
    axisWidth: 80,
    columnHeader: "时间",
    rowHeader: "人员",
    timeFormat: "single"
  };
}

/**
 * 生成测试资源列表
 */
export function generateTestResources() {
  return [
    { id: 'a', accountId: 'a', name: '张三', departmentId: 'd1', departmentName: '技术部' },
    { id: 'b', accountId: 'b', name: '李四', departmentId: 'd1', departmentName: '技术部' },
    { id: 'c', accountId: 'c', name: '王五', departmentId: 'd2', departmentName: '产品部' }
  ];
}

/**
 * 生成测试事件列表
 * @param {string} currentDate - 当前日期字符串 (YYYY-MM-DD)
 */
export function generateTestEvents(currentDate) {
  const today = currentDate || new Date().toISOString().split('T')[0];
  
  return [
    { 
      id: 'test_1', 
      resourceId: 'a', 
      start: `${today}T09:00:00`, 
      end: `${today}T10:30:00`, 
      title: '项目会议',
      color: '#1890ff'
    },
    // 与事件1重叠的事件（用于测试并排布局）
    { 
      id: 'test_1_2', 
      resourceId: 'a', 
      start: `${today}T09:30:00`, 
      end: `${today}T10:00:00`, 
      title: '紧急电话',
      color: '#ff4d4f'
    },
    { 
      id: 'test_1_3', 
      resourceId: 'a', 
      start: `${today}T10:00:00`, 
      end: `${today}T11:00:00`, 
      title: '代码审查',
      color: '#722ed1'
    },
    { 
      id: 'test_2', 
      resourceId: 'b', 
      start: `${today}T11:00:00`, 
      end: `${today}T12:00:00`, 
      title: '客户沟通',
      color: '#52c41a'
    },
    { 
      id: 'test_3', 
      resourceId: 'c', 
      start: `${today}T14:00:00`, 
      end: `${today}T15:30:00`, 
      title: '需求评审',
      color: '#faad14'
    },
    // 背景事件示例
    { 
      id: 'test_bg1', 
      resourceId: 'a', 
      start: `${today}T13:00:00`, 
      end: `${today}T14:00:00`, 
      title: '午休时间',
      color: '#ff7875',
      isBackground: true
    },
    { 
      id: 'test_bg2', 
      resourceId: 'b', 
      start: `${today}T16:00:00`, 
      end: `${today}T17:00:00`, 
      title: '不可用时段',
      color: '#d9d9d9',
      isBackground: true
    }
  ];
}

/**
 * 生成完整测试数据
 * @param {string} currentDate - 当前日期字符串
 */
export function generateTestData(currentDate) {
  return {
    config: generateTestConfig(),
    resources: generateTestResources(),
    events: generateTestEvents(currentDate)
  };
}
