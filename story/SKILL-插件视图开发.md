# 明道云插件视图开发 Skill — 实战验证合集

**版本**: v2.0.0 | **日期**: 2026-05-30 | **来源**: devtest + 预约看板新版项目实战

[TOC]

---

## 一、框选新建功能（useBoxSelect）

### 1.1 问题背景

TimeCalendar 参考代码（`参考/timecalendar/`）中 useDragCreate 存在 3 个问题：
1. `mousemove` 使用了错误的钳制边界 `[minMinutes, maxMinutes]`（绝对时间）而非 `[0, totalMinutes]`（相对偏移），导致点击顶部时框选跳到底部
2. mousedown 未吸附到网格，视觉起点不对齐
3. mouseup 发送的是**容器相对偏移量**而非**绝对时间**，导致写入的时间错误

### 1.2 解决方案

独立出 `useBoxSelect.js`（120 行），4 处关键修复：

```javascript
// 修复1: 移除 preventDefault（允许 click 事件正常生成）
// 修复2: mousedown 吸附到网格
var rawY = pixelToMinutes(e.clientY - rect.top, rect.height, maxMinutes - minMinutes);
var snapped = snapToGrid(rawY, timejiange);
selectRef.current.startMin = snapped;

// 修复3: mousemove 使用 [0, totalMinutes] 钳制（非 [minMinutes, maxMinutes]）
var currentMin = Math.max(0, Math.min(totalMinutes, (currentY / containerHeight) * totalMinutes));

// 修复4: mouseup 转为绝对时间
var bm = begintime.split(':').map(Number);
var bMin = bm[0] * 60 + bm[1];
var absStart = bMin + Math.min(startMin, endMin);
var absEnd = bMin + Math.max(startMin, endMin);
```

### 1.3 文件结构

```
src/timeline/hooks/
  utils.js          ← 共享工具：snapToGrid / pixelToMinutes / minutesToPixel
  useDrag.js        ← useDragMove + useDragResize（仅保留 click 修复）
  useBoxSelect.js   ← 独立框选 Hook（120行）
```

### 1.4 TimeCalendar 集成

```javascript
// TimeCalendar.jsx
import { useBoxSelect } from './hooks/useBoxSelect';

const { handleSelectStart, isSelecting, selectState } = useBoxSelect({
  onSelectSlot, begintime, endtime, timejiange
});

// 框选视觉反馈（在 StaffColumn 内渲染）
{isSelecting && selectState && selectState.resourceId === s.id && (
  <div style={{
    position:'absolute',
    top:(selectState.startMin/timeMeta.totalMin)*100+'%',
    height:((selectState.endMin-selectState.startMin)/timeMeta.totalMin)*100+'%',
    left:0,right:0,
    backgroundColor:'rgba(24,144,255,0.15)',
    border:'2px dashed #1890ff',
    borderRadius:4,zIndex:5,pointerEvents:'none'
  }}/>
)}
```

### 1.5 完整文件

见 `src/timeline/hooks/useBoxSelect.js`（120 行，4 修复，0 诊断）。

---

## 二、默认值获取与写入（getDefaultValue + buildFieldValue）

### 2.1 默认值获取：三层回退（来源：devtest/SKILL_RELATION.md）

已验证通过，位于 `src/utils/dragHandler.js`：

```javascript
function getDefaultValue(control) {
  // 第一层：c.defaultValue
  var dv = c.defaultValue;
  if (dv !== undefined && dv !== null && dv !== "") {
    if (typeof dv === "string" && (dv.startsWith("[") || dv.startsWith("{"))) {
      try { dv = JSON.parse(dv); } catch (e) {}
    }
    if (c.type === 29) { var rid = extractRowid(dv); if (rid) return rid; return ""; }
    // ★ type 10(多选)：合并 options 中额外的 isDefault 选项
    if (c.type === 10 && c.options && Array.isArray(dv)) {
      var seen = {};
      dv.forEach(function(k) { seen[k] = true; });
      for (var oi = 0; oi < c.options.length; oi++) {
        if (c.options[oi].isDefault && !seen[c.options[oi].key]) {
          dv.push(c.options[oi].key);
          seen[c.options[oi].key] = true;
        }
      }
    }
    return dv;
  }

  // 第二层：c.advancedSetting.defsource
  if (c.advancedSetting && c.advancedSetting.defsource) {
    try {
      var ds = JSON.parse(c.advancedSetting.defsource);
      if (Array.isArray(ds) && ds.length > 0 && ds[0].staticValue) {
        var sv = ds[0].staticValue;
        if (c.type === 29) { var rid = extractRowid(sv); if (rid) return rid; }
        return sv;
      }
    } catch (e) {}
  }

  // 第三层：c.options[].isDefault
  if (c.options) {
    if (c.type === 10) {
      var keys = [];
      for (var oi = 0; oi < c.options.length; oi++) {
        if (c.options[oi].isDefault) keys.push(c.options[oi].key);
      }
      if (keys.length > 0) return keys;
    } else {
      var o = c.options.find(function(o2) { return o2.isDefault; });
      if (o) return o.key;
    }
  }

  return "";
}
```

### 2.2 extractRowid：从嵌套 JSON 提取 rowid

已验证通过，位于 `src/utils/dragHandler.js`：

```javascript
function extractRowid(val) {
  if (!val || val === "") return "";
  if (typeof val === "string" && val.length < 50 && !val.startsWith("[") && !val.startsWith("{")) return val;
  try {
    var p = typeof val === "string" ? JSON.parse(val) : val;
    while (true) {
      if (Array.isArray(p) && p.length > 0) {
        var f = p[0];
        if (typeof f === "object") return f.sid || f.rowid || f._id || "";
        if (typeof f === "string") {
          try { var j = JSON.parse(f); if (typeof j === "object") { p = j; continue; } } catch (e2) { return f; }
        }
        return String(f);
      }
      if (typeof p === "object") return p.sid || p.rowid || p._id || "";
      break;
    }
  } catch (e) {}
  return "";
}
```

### 2.3 buildFieldValue：万能写入值组装

已验证通过，位于 `src/utils/parseField.js`：

```javascript
export function buildFieldValue(type, val) {
  if (val === undefined || val === null) return "";
  if (type === 29) return JSON.stringify([{ sid: val }]);      // 关联记录
  if (type === 26) return JSON.stringify([{ accountId: val }]); // 成员
  if (type === 27) return JSON.stringify([{ departmentId: val }]);// 部门
  if (type === 9 || type === 11) return JSON.stringify([val]);   // 单选/下拉
  if (type === 10) return JSON.stringify(Array.isArray(val) ? val : [val]); // 多选
  return String(val);                                             // 文本/数字/日期/时间
}
```

### 2.4 写入记录时携带默认值

在 `api.addWorksheetRow` 之前，遍历所有 controls，自动填充带默认值的字段：

```javascript
var allControls = (controlsRef && controlsRef.current) || [];
var explicitIds = [operatorFieldId, beginFieldId, endFieldId, durationFieldId, dateFieldId];
for (var ci = 0; ci < allControls.length; ci++) {
  var c = allControls[ci];
  if (isSkipControl(c)) continue;           // 跳过系统字段
  if (explicitIds.indexOf(c.controlId) >= 0) continue; // 跳过已显式设置的字段
  var dv = getDefaultValue(c);
  if (!dv && dv !== 0 && dv !== false) continue;
  controls.push({ controlId: c.controlId, type: c.type, value: buildFieldValue(c.type, dv) });
}
```

### 2.5 注意事项

1. **statusFieldId（背景颜色字段）不应硬编码为"待确认"**，应让它走默认值循环读取用户配置
2. **多选字段的 defaultValue** 可能只包含部分选项，需合并 `c.options[].isDefault` 补充
3. **addWorksheetRow 必须携带所有必填字段的默认值**，否则静默失败

---

## 三、万能字段解析与写入（parseField.js — 265行，12导出）

来源：项目 `src/utils/parseField.js`，唯一真相源。

### 3.1 函数清单

| 函数 | 方向 | 签名 | 说明 |
|------|------|------|------|
| `parseField` | 读 | `(raw, control) → {text,id,color,idx}` | 统一字段值提取 |
| `extractFieldText` | 读 | `(raw, control) → string` | 万能显示文本提取，绝不返回 null |
| `getFieldText` | 读 | `(raw, control) → string` | parseField.text 简写 |
| `extractTime` | 读 | `(raw) → "HH:mm"\|null` | 正则提取纯时间 |
| `timeToMin` | — | `(t) → number` | "HH:mm"→分钟数 |
| `safeColor` | 读 | `(raw, idx) → string` | CSS变量→VAR_MAP→调色板→8位hex截断 |
| `filterByFieldText` | 读 | `(records, fieldId, control, text) → records[]` | 精确文本过滤 |
| **`buildFieldValue`** | 写 | `(type, val) → string` | API写入值组装（覆盖 10 种 type） |
| **`extractRowid`** | 工具 | `(val) → string` | 嵌套JSON提取rowid/sid |
| **`getDefaultValue`** | 写 | `(control) → string\|string[]` | 类型感知默认值提取 |
| **`isSkipControl`** | 工具 | `(control) → boolean` | 系统字段跳过判断 |

### 3.2 buildFieldValue — 写入值映射

| type | 名称 | 格式 |
|------|------|------|
| 2/6/8/15/16/36/46 | 文本/数值/金额/日期/检查框/时间 | `String(val)` |
| 9/11 | 单选/下拉 | `JSON.stringify([val])` |
| 10 | 多选 | `JSON.stringify(Array.isArray(val)?val:[val])` |
| 14 | 附件 | `JSON.stringify(val)` |
| 26 | 成员 | `JSON.stringify([{accountId:val}])` |
| 27 | 部门 | `JSON.stringify([{departmentId:val}])` |
| **29** | **关联记录** | `JSON.stringify([{sid:val}])` |

### 3.3 getDefaultValue — 类型感知分支

```
入参: control = {type, defaultValue, advancedSetting:{defsource}, options:[{key,value}]}

type 10(多选) → defaultValue + defsource 合并 → string[]
type 29(关联) → extractRowid(defaultValue) → defsource.staticValue 兜底 → string
type 26(成员) → defaultValue → defsource.staticValue(二次JSON解析提取accountId) → string
type 27(部门) → defaultValue → defsource.staticValue(二次JSON解析提取departmentId) → string
type 9/11(单选/下拉) → defaultValue → defsource.staticValue → options.isDefault 兜底 → string
通用 → defaultValue → defsource.staticValue → string
```

**关键修复**: 
- 多选的默认值存在于 `advancedSetting.defsource`（JSON数组 `[{staticValue:"key"}]`），不在 `c.defaultValue`
- 成员/部门的 `staticValue` 是嵌套JSON `"{\"accountId\":\"xxx\"}"`，需二次解析

### 3.4 VAR_COLOR_MAP（8 个映射）

| CSS变量 | hex | 场景 |
|----------|-----|------|
| `var(--color-text-title)` | `#1f1f1f` | 标题 |
| `var(--color-text-primary)` | `#262626` | 主文字 |
| `var(--color-text-secondary)` | `#8c8c8c` | 次要文字 |
| `var(--color-background-card)` | `#ffffff` | 卡片背景 |
| `var(--color-background)` | `#ffffff` | 页面背景 |
| `var(--color-primary)` | `#1677ff` | 主题蓝 |
| `var(--color-border)` | `#d9d9d9` | 边框 |
| `var(--color-border-secondary)` | `#f0f0f0` | 次要边框 |
```

---

## 四、type:200 参数解析（parseParam 系列）

来源：devtest STANDARD.md + 项目 utils/parseParam.js

### 4.1 parseParam

```javascript
function parseParam(raw) {
  if (raw === undefined || raw === null) return null;
  var v = raw;
  if (Array.isArray(v)) v = v[0];
  if (typeof v === "string") { var t = v.trim(); if (t.startsWith("{") || t.startsWith("[")) { try { v = JSON.parse(t); } catch (e) { v = t; } } }
  if (v === null || v === undefined) return null;
  if (typeof v !== "string" && typeof v !== "object") return { cid: "", fids: [String(v)] };
  if (typeof v === "string") return { cid: "", fids: [v] };
  if (v.value && v.value.showControls) return { cid: v.value.cid || "", fids: v.value.showControls }; // sourceControlType=29
  if (v.controlId) return { cid: "", fids: [v.controlId] };                                           // sourceControlType=0
  var ks = Object.keys(v); if (ks.length > 0) { var fv = v[ks[0]]; if (typeof fv === "string") return { cid: "", fids: [fv] }; }
  return null;
}
```

### 4.2 resolveWorksheet

```javascript
async function resolveWorksheet(relCid) {
  var res = await apis.worksheet.getWorksheetInfo({ worksheetId: config.worksheetId, getTemplate: true });
  var controls = res?.template?.controls || res?.data?.template?.controls || [];
  var f = controls.find(function(c) { return c.controlId === relCid; });
  return f?.dataSource || "";
}
```

### 4.3 getViews（三层降级）

```javascript
async function getViews(wsId) {
  var r = await apis.worksheet.getWorksheetInfo({ worksheetId: wsId });
  var views = r?.views || r?.data?.views || r?.template?.views || r?.data?.template?.views || [];
  if (views.length === 0) { r = await apis.worksheet.getWorksheetInfo({ worksheetId: wsId, getTemplate: true }); views = r?.views || ...; }
  if (views.length === 0) { try { var v3 = await api.call("app", "getWorksheetStructure", { worksheet_id: wsId }); views = v3?.data?.views || v3?.views || []; } catch (e) {} }
  return views.map(function(v) { return { viewId: v.viewId || v.id, name: v.name, type: v.type }; });
}
```

---

## 五、数据加载规范（三链架构）

来源：devtest STANDARD.md + 项目 hooks/useDataLoader.js

### 5.1 三链概述

```
链1 表头: headerLoader → resolveWorksheet(headerDisplayParam.cid) → getFilteredRows(全量) → staffMap
链2 附属: subEventLoader → resolveWorksheet(subDateParam.cid) → buildDateFilter → getFilteredRows(当天) → subEvents
链3 主事件: mainEventLoader → config.worksheetId → buildDateFilter+config.filters → getFilteredRows(当天) → mainEvents
```

### 5.2 getControls / getFilteredRows / buildDateFilter

```javascript
async function getControls(wsId) { var r = await apis.worksheet.getWorksheetInfo({ worksheetId: wsId, getTemplate: true }); return r?.template?.controls || r?.data?.template?.controls || []; }
async function getFilteredRows(wsId, fc, viewId) { var params = { worksheetId: wsId, pageSize: 1000, pageIndex: 1, notGetTotal: true, filterControls: fc || [], appId: config.appId }; if (viewId) params.viewId = viewId; var r = await apis.worksheet.getFilterRows(params); return r?.data || []; }
function buildDateFilter(ctrlId, date) { return [{ controlId: ctrlId, dataType: 15, spliceType: 1, filterType: 17, dateRange: 18, dateRangeType: 3, value: date, values: [], isDynamicsource: false, dynamicSource: [] }]; }
```

### 5.3 视图 ID 获取优先级

```
关联工作表: viewId = getRelationOpenView(cid) || getViews(ws)[0].viewId
当前工作表: viewId = config.viewId
```

### 5.4 加载锁模式

```javascript
var loadingRef = useRef({ header: false, main: false, sub: false });
async function loadChain(name, fn) {
  if (loadingRef.current[name]) return;
  loadingRef.current[name] = true;
  try { await fn(); } catch (e) { addLog("["+name+"] fail: " + (e.message || e)); }
  finally { loadingRef.current[name] = false; }
}
```

---

## 六、mdye 0.1.x 写入 API 规范

来源：项目 dragHandler.js + devtest TabCreate.js

### 6.1 API 路径

```javascript
// 更新
api.updateWorksheetRow({ appId, worksheetId, rowId: string, newOldControl: [{controlId, type, value}] })
// 新增
api.addWorksheetRow({ appId, worksheetId, receiveControls: [{controlId, type, value}] })
// 删除
api.deleteWorksheetRow({ appId, worksheetId, rowIds: [rowId] })
```

### 6.2 关键差异（与旧版 0.0.20 对比）

| 项目 | 旧版 | 新版 0.1.x |
|------|------|-----------|
| 路径 | `apis.worksheet.editWorksheetRows` | `api.updateWorksheetRow` |
| 参数名 | `controls` | `newOldControl`(更新)/`receiveControls`(新增) |
| 单/复数 | `rowIds: [id]` | `rowId: id` (更新) vs `rowIds: [id]` (删除) |
| 值格式 | `{controlId: value}` | `[{controlId, type, value}]` |

### 6.3 完整写入示例

```javascript
// 新增记录
api.addWorksheetRow({
  appId: config.appId,
  worksheetId: config.worksheetId,
  receiveControls: [
    { controlId: operatorFieldId, type: 29, value: buildFieldValue(29, rowid) },
    { controlId: beginFieldId,    type: 16, value: currentDate + " " + start.substring(0,5) + ":00" },
    { controlId: durationFieldId, type: 6,  value: String(duration) },
    { controlId: dateFieldId,     type: 15, value: currentDate },
    // + 所有有默认值的字段（通过 getDefaultValue + buildFieldValue）
  ]
});
```

---

## 七、click 交互修复（EventBar + useDrag）

来源：项目实战验证

### 7.1 问题

TimeCalendar 的 `useDragMove.handleMouseDown` 调用 `e.preventDefault()`，按 HTML 规范阻止了浏览器生成 click 事件。

### 7.2 修复（5处）

```javascript
// 修复1-3: 移除 3×preventDefault（useDragMove, useDragResize, useDragCreate）
// 修复4: 移除 useDragMove 的 stopPropagation（React合成事件中阻止capture阶段）
// 修复5: setIsDragging 延迟到 RAF（避免DOM替换打断click生成）
requestAnimationFrame(function() {
  if (!dragRef.current) return;
  setIsDragging(true);
  setDragState({...});
});
```

### 7.3 click 检测（dragMovedRef + 5px 阈值）

```javascript
// mousedown → dragMovedRef = false
// mousemove → |dx|>5 → dragMovedRef = true
// mouseup → dragMovedRef ? 拖拽 : 点击
```

### 7.4 全局兜底

```javascript
// App.jsx
window.__openRecord = function(rowid) {
  utils.openRecordInfo({ appId, worksheetId, viewId, recordId: rowid });
};

// EventBar.jsx
if (ev._rowid && window.__openRecord) window.__openRecord(ev._rowid);
```

---

## 八、关键注意事项（常见陷阱）

| # | 陷阱 | 后果 | 修复 |
|---|------|------|------|
| 1 | mousemove 使用 `[minMinutes, maxMinutes]` 钳制 | 框选跳到底部 | 改用 `[0, totalMinutes]` |
| 2 | 框选时间用偏移量而非绝对时间 | 写入时间错误 | `absTime = bMin + offsetTime` |
| 3 | mdye 0.1.x API 写入参数格式不同 | API 调用了无反应 | 使用 `api.updateWorksheetRow` + `newOldControl` |
| 4 | 写入时未带必填字段默认值 | API 静默失败 | 遍历 controlsRef 自动填充 |
| 5 | 多选字段 defaultValue 只含部分选项 | 写入选值不全 | 合并 `c.options[].isDefault` |
| 6 | React 合成事件 `stopPropagation` 阻止 capture | MouseDownCapture 不触发 | 移除所有 stopPropagation |
| 7 | `e.preventDefault()` 阻止 click | onClick 不触发 | 移除 preventDefault + RAF 延迟 state |
| 8 | buildDepartmentTree 排序键不一致 | 表头列体错位 | 统一按 `departmentName` 排序 |
