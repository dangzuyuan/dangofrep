# TimeCalendar 组件调用规则文档

**版本**: v1.0.0  
**最后更新**: 2026-05-29  
**组件路径**: `src/timeline/TimeCalendar.jsx`

---

## 1. 组件导入方式

### 1.1 标准导入

```javascript
import TimeCalendar from './timeline/TimeCalendar';
```

### 1.2 配套工具导入（推荐）

```javascript
// 核心组件
import TimeCalendar from './timeline/TimeCalendar';

// 数据组装层（处理时区、过滤、裁剪）
import { assembleEvents } from './utils/eventAssembler';

// 布局计算（性能优化）
import { calculateEventLayout } from './utils/eventLayout';

// 测试数据生成器（开发环境）
import { generateTestData } from './utils/testData';
```

---

## 2. Props 配置项

### 2.1 必需 Props

| Prop | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| `resources` | `Array<Resource>` | ✅ | `[]` | 资源列表（人员/设备），每个资源包含 `id`, `accountId`, `name`, `departmentId`, `departmentName` |
| `events` | `Array<Event>` | ✅ | `[]` | 事件列表，每个事件包含 `id`, `resourceId`, `startTime`, `endTime`, `title`, `color`, `isBackground` |

### 2.2 可选 Props - 时间配置

| Prop | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| `begintime` | `string` | ❌ | `"07:00"` | 时间轴起始时间，格式 `"HH:mm"` |
| `endtime` | `string` | ❌ | `"23:00"` | 时间轴结束时间，格式 `"HH:mm"` |
| `timejiange` | `number` | ❌ | `30` | 时间间隔（分钟），用于网格线和吸附对齐 |
| `timeFormat` | `'single' \| 'range'` | ❌ | `"single"` | 时间标签格式：`'single'` (08:00) 或 `'range'` (08:00-08:30) |

### 2.3 可选 Props - 布局配置

| Prop | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| `slotHeight` | `number` | ❌ | `60` | 单个时间格的高度（像素） |
| `colWidth` | `number` | ❌ | `72` | 资源列宽度（像素） |
| `axisWidth` | `number` | ❌ | `80` | 时间轴宽度（像素） |
| `columnHeader` | `string` | ❌ | `"时间"` | 表头列标题文本 |
| `rowHeader` | `string` | ❌ | `"人员"` | 表头行标题文本 |

### 2.4 可选 Props - 交互状态

| Prop | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| `selectedEventId` | `string \| null` | ❌ | `null` | 当前选中的事件 ID，用于高亮显示 |
| `eventLayoutsMap` | `Object` | ❌ | `{}` | 预计算的事件布局映射表 `{ [resourceId]: Array<{left, width, zIndex}> }` |
| `departmentTree` | `Array<Department>` | ❌ | `[]` | 部门树形结构，用于分组显示资源 |

### 2.5 可选 Props - 事件回调

| Prop | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| `onEventClick` | `Function(event \| null)` | ❌ | `undefined` | 事件点击回调，参数为事件对象或 `null`（点击空白） |
| `onEventDrop` | `Function(data)` | ❌ | `undefined` | 拖拽移动完成回调，返回 `{ eventId, newResourceId, newStart, newEnd }` |
| `onEventResize` | `Function(data)` | ❌ | `undefined` | 拉伸调整完成回调，返回 `{ eventId, newStart, newEnd }` |
| `onSelectSlot` | `Function(data)` | ❌ | `undefined` | 框选新建完成回调，返回 `{ resourceId, start, end }` |

---

## 3. 数据结构定义

### 3.1 Resource（资源对象）

```javascript
{
  id: string,              // 资源唯一标识（如 'a', 'b'）
  accountId: string,       // 账户ID（与 id 相同或关联）
  name: string,            // 资源名称（如 '张三'）
  departmentId: string,    // 部门ID（如 'd1'）
  departmentName: string   // 部门名称（如 '技术部'）
}
```

### 3.2 Event（事件对象）

```javascript
{
  id: string,              // 事件唯一标识（如 'test_1'）
  resourceId: string,      // 关联的资源ID
  startTime: string,       // 开始时间，格式 "HH:mm:ss"（纯时间字符串，无日期）
  endTime: string,         // 结束时间，格式 "HH:mm:ss"
  title: string,           // 事件标题（如 '项目会议'）
  color: string,           // 事件颜色（如 '#1890ff'）
  isBackground?: boolean   // 是否为背景事件（默认为 false）
}
```

### 3.3 Department（部门对象）

```javascript
{
  id: string,              // 部门ID
  name: string,            // 部门名称
  children: Array<Resource> // 该部门下的资源列表
}
```

---

## 4. 事件回调函数使用规则

### 4.1 onEventClick - 事件点击

**触发时机**: 用户点击事件条或空白区域

**回调参数**:
```javascript
onEventClick = (event) => {
  if (event === null) {
    // 点击空白区域，取消选中
    console.log('取消选中');
  } else {
    // 点击事件条
    console.log('选中事件:', event.id, event.title);
  }
};
```

**注意事项**:
- ⚠️ **必须支持 `null` 参数**：点击空白区域时传入 `null`
- 💡 **建议实现切换逻辑**：再次点击已选中事件时取消选中

---

### 4.2 onEventDrop - 拖拽移动完成

**触发时机**: 用户拖拽事件条到新位置并释放鼠标

**回调参数**:
```javascript
onEventDrop = ({ eventId, newResourceId, newStart, newEnd }) => {
  console.log('拖拽移动:', {
    eventId,           // 被拖拽的事件ID
    newResourceId,     // 新的资源ID（可能跨列移动）
    newStart,          // 新的开始时间 "HH:mm:ss"
    newEnd             // 新的结束时间 "HH:mm:ss"
  });
  
  // 更新事件数据
  setEvents(prev => prev.map(ev => 
    ev.id === eventId 
      ? { ...ev, resourceId: newResourceId, startTime: newStart, endTime: newEnd }
      : ev
  ));
};
```

**注意事项**:
- ⚠️ **时间已自动吸附**：`newStart` 和 `newEnd` 已根据 `timejiange` 对齐到刻度
- ⚠️ **边界已约束**：时间不会超出 `begintime` 和 `endtime` 范围
- 💡 **需要持久化**：回调中必须更新事件数据，否则拖拽效果会回退

---

### 4.3 onEventResize - 拉伸调整完成

**触发时机**: 用户拖拽事件条顶部/底部拉伸手柄并释放鼠标

**回调参数**:
```javascript
onEventResize = ({ eventId, newStart, newEnd }) => {
  console.log('拉伸调整:', {
    eventId,           // 被拉伸的事件ID
    newStart,          // 新的开始时间 "HH:mm:ss"
    newEnd             // 新的结束时间 "HH:mm:ss"
  });
  
  // 更新事件数据
  setEvents(prev => prev.map(ev => 
    ev.id === eventId 
      ? { ...ev, startTime: newStart, endTime: newEnd }
      : ev
  ));
};
```

**注意事项**:
- ⚠️ **时间已自动吸附**：同 `onEventDrop`
- ⚠️ **最小时长限制**：事件时长不能小于 `timejiange`（防止过度压缩）
- 💡 **需要持久化**：回调中必须更新事件数据

---

### 4.4 onSelectSlot - 框选新建完成

**触发时机**: 用户在空白区域按下鼠标并拖动形成选框，释放后

**回调参数**:
```javascript
onSelectSlot = ({ resourceId, start, end }) => {
  console.log('框选新建:', {
    resourceId,        // 选框所在的资源ID
    start,             // 选框开始时间 "HH:mm:ss"
    end                // 选框结束时间 "HH:mm:ss"
  });
  
  // 创建新事件
  const newEvent = {
    id: `new_${Date.now()}`,
    resourceId,
    startTime: start,
    endTime: end,
    title: '新建事件',
    color: '#1890ff'
  };
  
  setEvents(prev => [...prev, newEvent]);
};
```

**注意事项**:
- ⚠️ **仅在空白区域触发**：如果选框覆盖了已有事件，不会触发此回调
- ⚠️ **时间已自动吸附**：同 `onEventDrop`
- 💡 **需要手动创建事件**：回调不会自动创建事件，需自行处理

---

## 5. 不同业务场景的 JSX 使用示例

### 5.1 基础用法（只读模式）

适用于展示日程安排，不允许用户交互。

```javascript
import React from 'react';
import TimeCalendar from './timeline/TimeCalendar';

function ReadOnlyCalendar() {
  const resources = [
    { id: 'a', accountId: 'a', name: '张三', departmentId: 'd1', departmentName: '技术部' }
  ];
  
  const events = [
    { 
      id: '1', 
      resourceId: 'a', 
      startTime: '09:00:00', 
      endTime: '10:30:00', 
      title: '项目会议',
      color: '#1890ff'
    }
  ];

  return (
    <TimeCalendar
      resources={resources}
      events={events}
      begintime="08:00"
      endtime="18:00"
      timejiange={30}
    />
  );
}
```

---

### 5.2 完整交互模式（推荐）

适用于需要支持拖拽、拉伸、框选等完整交互的场景。

```javascript
import React, { useState, useMemo } from 'react';
import TimeCalendar from './timeline/TimeCalendar';
import { assembleEvents } from './utils/eventAssembler';
import { calculateEventLayout } from './utils/eventLayout';

function InteractiveCalendar() {
  const [currentDate, setCurrentDate] = useState('2026-05-29');
  const [selectedEventId, setSelectedEventId] = useState(null);
  
  // 原始事件数据（含日期）
  const rawEvents = [
    { 
      id: '1', 
      resourceId: 'a', 
      start: '2026-05-29T09:00:00',  // ISO 8601 格式
      end: '2026-05-29T10:30:00',
      title: '项目会议',
      color: '#1890ff'
    }
  ];
  
  const resources = [
    { id: 'a', accountId: 'a', name: '张三', departmentId: 'd1', departmentName: '技术部' }
  ];
  
  // 步骤1: 使用数据组装层处理事件（过滤、标准化、裁剪）
  const events = useMemo(() => {
    return assembleEvents(rawEvents, currentDate, {
      begintime: '08:00',
      endtime: '18:00'
    });
  }, [rawEvents, currentDate]);
  
  // 步骤2: 预计算事件布局（性能优化）
  const eventLayoutsMap = useMemo(() => {
    const layoutMap = {};
    resources.forEach(resource => {
      const staffEvents = events.filter(ev => 
        ev.resourceId === resource.id || ev.resourceId === resource.accountId
      );
      layoutMap[resource.id] = calculateEventLayout(staffEvents);
    });
    return layoutMap;
  }, [events, resources]);
  
  // 步骤3: 定义回调函数
  const handleEventClick = (event) => {
    if (event === null) {
      setSelectedEventId(null);
    } else {
      setSelectedEventId(prev => prev === event.id ? null : event.id);
    }
  };
  
  const handleEventDrop = ({ eventId, newResourceId, newStart, newEnd }) => {
    setRawEvents(prev => prev.map(ev => 
      ev.id === eventId 
        ? { 
            ...ev, 
            resourceId: newResourceId,
            start: `${currentDate}T${newStart}`,
            end: `${currentDate}T${newEnd}`
          }
        : ev
    ));
  };
  
  const handleEventResize = ({ eventId, newStart, newEnd }) => {
    setRawEvents(prev => prev.map(ev => 
      ev.id === eventId 
        ? { 
            ...ev,
            start: `${currentDate}T${newStart}`,
            end: `${currentDate}T${newEnd}`
          }
        : ev
    ));
  };
  
  const handleSelectSlot = ({ resourceId, start, end }) => {
    const newEvent = {
      id: `new_${Date.now()}`,
      resourceId,
      start: `${currentDate}T${start}`,
      end: `${currentDate}T${end}`,
      title: '新建事件',
      color: '#1890ff'
    };
    setRawEvents(prev => [...prev, newEvent]);
  };

  return (
    <TimeCalendar
      resources={resources}
      events={events}
      eventLayoutsMap={eventLayoutsMap}
      begintime="08:00"
      endtime="18:00"
      timejiange={30}
      slotHeight={60}
      colWidth={72}
      axisWidth={80}
      selectedEventId={selectedEventId}
      onEventClick={handleEventClick}
      onEventDrop={handleEventDrop}
      onEventResize={handleEventResize}
      onSelectSlot={handleSelectSlot}
    />
  );
}
```

---

### 5.3 部门分组模式

适用于需要按部门分组显示资源的场景。

```javascript
import React, { useMemo } from 'react';
import TimeCalendar from './timeline/TimeCalendar';

function GroupedCalendar({ resources, events }) {
  // 构建部门树形结构
  const departmentTree = useMemo(() => {
    const tree = [], deptMap = {};
    
    resources.forEach((s) => {
      let deptId, deptName;
      
      if (s.departmentId && s.departmentId.trim() !== '') {
        deptId = s.departmentId;
        deptName = s.departmentName || s.departmentId;
      } else if (s.departmentName && s.departmentName.trim() !== '') {
        deptId = `dept_${s.departmentName}`;
        deptName = s.departmentName;
      } else {
        deptId = 'unknown';
        deptName = '未分组';
      }
      
      if (!deptMap[deptId]) {
        deptMap[deptId] = { id: deptId, name: deptName, children: [] };
        tree.push(deptMap[deptId]);
      }
      
      deptMap[deptId].children.push(s);
    });
    
    // 排序
    tree.sort((a, b) => a.id.localeCompare(b.id));
    tree.forEach(dept => {
      dept.children.sort((a, b) => a.accountId.localeCompare(b.accountId));
    });
    
    return tree;
  }, [resources]);

  return (
    <TimeCalendar
      resources={resources}
      events={events}
      departmentTree={departmentTree}
      columnHeader="时间"
      rowHeader="人员"
    />
  );
}
```

---

### 5.4 自定义时间范围模式

适用于非标准工作时间段（如夜班、24小时监控等）。

```javascript
import React from 'react';
import TimeCalendar from './timeline/TimeCalendar';

function NightShiftCalendar() {
  return (
    <TimeCalendar
      resources={resources}
      events={events}
      begintime="20:00"      // 晚上8点开始
      endtime="08:00"        // 次日早上8点结束
      timejiange={60}        // 每小时一个刻度
      timeFormat="range"     // 显示时间范围 "20:00-21:00"
      slotHeight={80}        // 更高的格子，便于查看
    />
  );
}
```

---

### 5.5 紧凑布局模式

适用于小屏幕或需要显示更多资源的场景。

```javascript
import React from 'react';
import TimeCalendar from './timeline/TimeCalendar';

function CompactCalendar() {
  return (
    <TimeCalendar
      resources={resources}
      events={events}
      slotHeight={40}        // 更矮的格子
      colWidth={60}          // 更窄的列
      axisWidth={60}         // 更窄的时间轴
      timejiange={60}        // 每小时一个刻度，减少网格线
    />
  );
}
```

---

## 6. 组件受控/非受控模式使用说明

### 6.1 受控模式（推荐）

**特点**: 所有状态由父组件管理，组件完全受控。

**适用场景**: 
- 需要持久化数据到服务器
- 需要复杂的状态管理逻辑
- 需要与其他组件联动

**示例**:
```javascript
function ControlledCalendar() {
  // 父组件管理所有状态
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  
  // 通过回调更新状态
  const handleEventDrop = (data) => {
    // 1. 更新本地状态
    setEvents(prev => /* ... */);
    
    // 2. 同步到服务器
    api.updateEvent(data.eventId, { 
      resourceId: data.newResourceId,
      start: data.newStart,
      end: data.newEnd
    });
  };
  
  return (
    <TimeCalendar
      events={events}                    // 受控：数据来自 state
      selectedEventId={selectedEventId}  // 受控：选中状态来自 state
      onEventDrop={handleEventDrop}      // 通过回调更新
    />
  );
}
```

**优点**:
- ✅ 状态集中管理，易于调试
- ✅ 可以轻松实现撤销/重做功能
- ✅ 方便与服务端同步

**缺点**:
- ❌ 需要编写更多样板代码
- ❌ 每次状态变更都会触发重新渲染

---

### 6.2 非受控模式（不推荐）

**特点**: 组件内部管理状态，父组件仅传入初始数据。

**⚠️ 重要说明**: 
**TimeCalendar 组件目前不支持完全的非受控模式**。所有交互都必须通过回调函数由父组件处理，因为：
1. 事件数据存储在父组件（遵循单向数据流）
2. 拖拽、拉伸等操作需要父组件持久化数据
3. 选中状态需要父组件管理以实现跨组件联动

**伪非受控示例**（仍需回调）:
```javascript
function PseudoUncontrolledCalendar() {
  // 仅在初始化时设置数据
  const [events] = useState(initialEvents);
  
  // 仍需提供回调，但可以选择不更新状态
  const handleEventDrop = (data) => {
    console.log('拖拽发生，但不更新状态', data);
    // 不调用 setEvents，拖拽效果会回退
  };
  
  return (
    <TimeCalendar
      events={events}
      onEventDrop={handleEventDrop}  // 必须提供，但可以为空函数
    />
  );
}
```

---

### 6.3 混合模式（最佳实践）

**特点**: 结合受控和非受控的优点，部分状态由父组件管理，部分由组件内部处理。

**示例**:
```javascript
function HybridCalendar() {
  // 受控：事件数据由父组件管理
  const [events, setEvents] = useState([]);
  
  // 非受控：选中状态可以由子组件内部管理（如果需要）
  // 但当前架构要求由父组件管理
  
  // 性能优化：预计算布局在父组件中进行
  const eventLayoutsMap = useMemo(() => {
    // ... 计算逻辑
  }, [events]);
  
  return (
    <TimeCalendar
      events={events}                    // 受控
      eventLayoutsMap={eventLayoutsMap}  // 受控（性能优化）
      onEventDrop={(data) => {
        // 异步更新，避免阻塞UI
        setTimeout(() => {
          setEvents(prev => /* ... */);
        }, 0);
      }}
    />
  );
}
```

---

## 7. 性能优化建议

### 7.1 预计算事件布局（强烈推荐）

```javascript
// ✅ 推荐：在父组件中预计算
const eventLayoutsMap = useMemo(() => {
  const layoutMap = {};
  resources.forEach(resource => {
    const staffEvents = events.filter(ev => 
      ev.resourceId === resource.id || ev.resourceId === resource.accountId
    );
    layoutMap[resource.id] = calculateEventLayout(staffEvents);
  });
  return layoutMap;
}, [events, resources]);

<TimeCalendar
  events={events}
  eventLayoutsMap={eventLayoutsMap}  // 传入预计算结果
/>
```

**优势**:
- 避免每次 render 都执行 O(n²) 的重叠检测算法
- 特别适用于事件数量较多（>50）的场景

---

### 7.2 使用数据组装层

```javascript
// ✅ 推荐：使用 assembleEvents 处理时区和过滤
const events = useMemo(() => {
  return assembleEvents(rawEvents, currentDate, {
    begintime: config.begintime,
    endtime: config.endtime
  });
}, [rawEvents, currentDate, config.begintime, config.endtime]);
```

**优势**:
- 自动处理时区问题
- 自动过滤非当前日期的事件
- 自动裁剪超出时间范围的事件

---

### 7.3 虚拟化优化（未来计划）

当资源数量 > 20 时，建议实施虚拟滚动：
- 仅渲染可视区域内的资源列
- 使用 `react-window` 或 `react-virtualized`

---

## 8. 常见问题 FAQ

### Q1: 为什么拖拽后事件位置会回退？

**A**: 因为 `onEventDrop` 回调中没有更新事件数据。必须在回调中调用 `setEvents` 更新状态。

```javascript
const handleEventDrop = (data) => {
  // ❌ 错误：忘记更新状态
  console.log('拖拽完成');
  
  // ✅ 正确：更新状态
  setEvents(prev => prev.map(ev => 
    ev.id === data.eventId 
      ? { ...ev, startTime: data.newStart, endTime: data.newEnd }
      : ev
  ));
};
```

---

### Q2: 如何实现事件的增删改查？

**A**: 所有操作都在父组件中进行，组件本身不负责数据管理。

```javascript
// 新增
const addEvent = (newEvent) => {
  setEvents(prev => [...prev, newEvent]);
};

// 删除
const deleteEvent = (eventId) => {
  setEvents(prev => prev.filter(ev => ev.id !== eventId));
};

// 修改
const updateEvent = (eventId, updates) => {
  setEvents(prev => prev.map(ev => 
    ev.id === eventId ? { ...ev, ...updates } : ev
  ));
};

// 查询
const getEvent = (eventId) => {
  return events.find(ev => ev.id === eventId);
};
```

---

### Q3: 如何禁用某些交互功能？

**A**: 不提供对应的回调函数即可禁用。

```javascript
<TimeCalendar
  events={events}
  // ✅ 提供 onEventClick → 允许点击
  onEventClick={handleEventClick}
  
  // ❌ 不提供 onEventDrop → 禁用拖拽
  // onEventDrop={...}
  
  // ❌ 不提供 onEventResize → 禁用拉伸
  // onEventResize={...}
  
  // ❌ 不提供 onSelectSlot → 禁用框选
  // onSelectSlot={...}
/>
```

---

### Q4: 事件时间格式为什么是 "HH:mm:ss" 而不是 Date 对象？

**A**: 这是为了避免时区问题。组件内部使用纯时间字符串，日期由父组件通过 `assembleEvents` 处理。

```javascript
// ✅ 正确：使用纯时间字符串
{
  startTime: '09:00:00',
  endTime: '10:30:00'
}

// ❌ 错误：不要直接传入 Date 对象
{
  startTime: new Date('2026-05-29T09:00:00'),  // 会导致时区问题
  endTime: new Date('2026-05-29T10:30:00')
}
```

---

### Q5: 如何实现多日视图？

**A**: 当前组件仅支持单日视图。如需多日视图，需要：
1. 在父组件中添加日期导航（上一天/下一天）
2. 根据当前日期过滤事件
3. 或使用多个 `TimeCalendar` 实例并排显示

```javascript
function MultiDayView() {
  const [currentDate, setCurrentDate] = useState('2026-05-29');
  
  const nextDay = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    setCurrentDate(date.toISOString().split('T')[0]);
  };
  
  const prevDay = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 1);
    setCurrentDate(date.toISOString().split('T')[0]);
  };
  
  return (
    <div>
      <button onClick={prevDay}>前一天</button>
      <span>{currentDate}</span>
      <button onClick={nextDay}>后一天</button>
      
      <TimeCalendar
        events={assembleEvents(rawEvents, currentDate, config)}
        resources={resources}
      />
    </div>
  );
}
```

---

## 9. 最佳实践总结

### ✅ 推荐做法

1. **始终使用数据组装层**：`assembleEvents()` 处理时区和过滤
2. **预计算事件布局**：在父组件中使用 `useMemo` 计算 `eventLayoutsMap`
3. **使用受控模式**：所有状态由父组件管理
4. **提供完整的回调**：至少实现 `onEventClick`，根据需要实现其他回调
5. **处理 null 参数**：`onEventClick` 必须支持 `null`（点击空白）

### ❌ 避免做法

1. **不要在循环内调用 Hooks**：违反 React 规则
2. **不要直接修改 props**：必须通过回调更新父组件状态
3. **不要忽略回调返回值**：拖拽/拉伸后必须更新数据
4. **不要混用时间格式**：统一使用 "HH:mm:ss" 纯时间字符串
5. **不要忘记边界检查**：确保事件时间在 `begintime` 和 `endtime` 范围内

---

## 10. 更新日志

- **v1.0.0** (2026-05-29): 初始版本，包含完整的 Props 定义、回调说明和使用示例
