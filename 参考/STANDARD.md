# 明道云通用排程视图插件 · 正式开发 Skill

**版本：** v3.0 (Final) | **日期：** 2026-05-23  
**来源：** devtest 全量测试验证通过  
**适用范围：** Mdye v0.0.20+ · React 18 · Styled-Components 6  
**状态：** 生产就绪，可直接用于正式编码

---

## 〇、总体架构

```
┌──────────────┬───────────────────────────────────────────────────────┐
│ 锚点区        │ 工具栏: < 前一天 [日期] 后一天 > ●今天 🔄 {表头}:N 主:N 附:N │
│ sticky        ├───────────────────────────────────────────────────────┤
│ top+left      │ 表头: 分组行(部门/楼层) + 主体名称行(员工/房间)          │
├──────────────┼───────────────────────────────────────────────────────┤
│ 时间轴        │ 主内容画布区                                          │
│ sticky left   │ z=1 附属事件条(半透明 op:0.65, 左边框3px, 只读)        │
│               │ z=2 网格背景线                                        │
│               │ z=3 主事件条(实色, 全交互, 可拖拽/点击/删除)            │
└──────────────┴───────────────────────────────────────────────────────┘

三链数据源（各自独立工作）:
  链1-表头: type:200(29) → cid→dataSource → 员工档案表/房间表 → staffMap
  链2-附属: type:200(29) → cid→dataSource → 排班表 → events(只读)
  链3-主事件: type:200(0) → config.worksheetId → 预约表 → events(交互)
```

---

## 一、参数定义（29个，源码级对照）

### 1.1 表头参数（5个，含1分组线）

| fieldId | 类型 | sourceControlType | 说明 |
|---------|------|-------------------|------|
| `group` | type:22 | — | 分组线 "表头参数"，仅UI分隔 |
| `headerDisplayField` | type:200 | 29 | 关联字段选择器。cid→dataSource=员工档案表ID，fids[0]=名称字段(姓名)。showControls: ["2","11","26","27"] |
| `headerGroupField` | type:200 | 29 | 关联字段选择器。fids[0]=分组字段(部门)。showControls: ["27","26","2","11"] |
| `headerFilterField` | type:200 | 29 | 关联字段选择器。fids[0]=筛选字段。showControls: ["2","6","11","10"] (可选文本/数值/下拉/多选) |
| `Headerconditonvalue` | type:11 | — | 下拉筛选值。options: 排班(#C3F2F2), 不排班(#C2F1D2)。值格式 `["key"]`，须用 `paramText()` 归一化 |

**headerFilterField 取值规则**：
- `showControls` 是字段**类型**限制 `["2","6","11","10"]`
- parseParam → `{cid, fids:[目标表字段ID]}`
- `cid` 可能≠`headerDisplayField.cid` → 须**独立** `resolveWorksheet(cid)`

### 1.2 附属事件参数（9个，含1分组线）

| fieldId | 类型 | sourceControlType | 说明 |
|---------|------|-------------------|------|
| `subEventGroup` | type:22 | — | 分组线 "副事件参数" |
| `subEventDateField` | type:200 | 29 | 日期字段。showControls: ["15"] |
| `subEventBeginTime` | type:200 | 29 | 开始时间。showControls: ["46","30"] |
| `subEventEndTime` | type:200 | 29 | 结束时间。showControls: ["46","15","30"] |
| `subEventTimeInterval` | type:200 | 29 | 时长(数值类型,分钟)。showControls: ["6"]。★ 优先级最高 |
| `subEventDisplayContent` | type:200 | 29 | 显示文本。showControls: ["2","15","46","11","30","32"] |
| `subEventBgColor` | type:200 | 29 | 背景颜色(下拉)。showControls: ["11"] |
| `subEventFontColor` | type:200 | 29 | 字体颜色(下拉,可选) |
| 

**隐藏规则**：subEventDateField + subEventBeginTime 都为空 → 跳过附属事件全链路

### 1.3 主事件参数（10个，含1分组线）

| fieldId | 类型 | sourceControlType | 说明 |
|---------|------|-------------------|------|
| `mainEventGroup` | type:22 | — | 分组线 "主事件参数" |
| `mainEventDateField` | type:200 | 0 | 日期字段。controls: ["15"] |
| `mainEventBeginTime` | type:200 | 0 | 开始时间。controls: ["46","15"] |
| `mainEventEndTime` | type:200 | 0 | 结束时间。controls: ["46","15"] |
| `mainEventDuration` | type:200 | 0 | 时长(数值,分钟)。controls: ["6"]。★ 优先级最高 |
| `mainEventDisplayContent` | type:200 | 0 | 显示文本。controls: ["2","6","32","29","36","10","3"] |
| `mainEventBgColor` | type:200 | 0 | 背景颜色(下拉)。controls: ["11","2"] |
| `mainEventFontColor` | type:200 | 0 | 字体颜色(下拉,可选)。controls: ["2","11"] |
|

**取值规则**：sourceControlType=0 → parseParam 读 `["controlId"]` → fids[0] 在 config.worksheetId 查找

### 1.4 时间轴参数（6个，含1分组线）

| fieldId | 类型 | 代码引用 | 说明 |
|---------|------|----------|------|
| `group1` | type:22 | — | 分组线 "时间轴" |
| `beginTime` | type:2 | `TabTimeline.js:5` `\| env.beginTime \| "08:00"` | 时间轴开始时间 HH:mm |
| `endTime` | type:2 | `TabTimeline.js:6` `\| env.endTime \| "23:00"` | 时间轴结束时间 HH:mm |
| `timeInterval` | type:2 | `TabTimeline.js:7` `Number(env.timeInterval) \| 15` | 刻度间隔(分钟) |
| `showstyle` | type:11 | `TabTimeline.js:8-11` | 显示方式。options: 时间区间(#C3F2F2), 单一时间(#C2F1D2)。值格式 `["key"]` |
| `colwidth` | type:6 | `TabTimeline.js:13` `Number(env.colwidth) \| (showRange?80:60)` | 时间轴列宽(px) |

---

## 二、type:200 参数解析规范

### 2.1 parseParam — 自动识别两种 sourceControlType

```javascript
/**
 * 解析 type:200 参数值，自动识别 sourceControlType=29 或 =0
 * @param {*} raw - env 中的参数原始值
 * @returns {{cid: string, fids: string[]}|null}
 *   sourceControlType=29: cid=关联字段controlId, fids=目标表字段ID列表
 *   sourceControlType=0:  cid="", fids=当前表字段ID列表
 */
function parseParam(raw) {
  if (raw === undefined || raw === null) return null;

  let v = raw;
  if (Array.isArray(v)) v = v[0];                        // ["fid"] → "fid"

  // 仅JSON字符串尝试解析（避免纯controlId字符串被误解析报错）
  if (typeof v === "string") {
    const t = v.trim();
    if (t.startsWith("{") || t.startsWith("[")) {
      try { v = JSON.parse(t); } catch (e) { v = t; }
    }
  }

  if (v === null || v === undefined) return null;

  // 数字/布尔 → 转为 controlId
  if (typeof v !== "string" && typeof v !== "object") return { cid: "", fids: [String(v)] };

  // 字符串 → controlId
  if (typeof v === "string") return { cid: "", fids: [v] };

  // sourceControlType=29: {type:29, value:{cid, showControls}}
  if (v.value && v.value.showControls) return { cid: v.value.cid || "", fids: v.value.showControls };

  // {controlId: "xxx"}
  if (v.controlId) return { cid: "", fids: [v.controlId] };

  // 兜底: 取第一个属性值
  const ks = Object.keys(v);
  if (ks.length > 0) { const fv = v[ks[0]]; if (typeof fv === "string") return { cid: "", fids: [fv] }; }

  return null;
}
```

### 2.2 resolveWorksheet — cid → 真正工作表ID

```javascript
/**
 * 仅 sourceControlType=29 使用
 * @param {string} relationControlId - type:200参数中 value.cid 的值
 * @returns {string} 真正的工作表ID (dataSource)
 */
async function resolveWorksheet(relationControlId) {
  const res = await apis.worksheet.getWorksheetInfo({
    worksheetId: config.worksheetId, getTemplate: true
  });
  const controls = res?.template?.controls || res?.data?.template?.controls || [];
  const relField = controls.find(c => c.controlId === relationControlId);
  return relField?.dataSource || "";
}
```

### 2.3 getRelationOpenView — 提取关联字段的打开视图ID

```javascript
/**
 * ★ 提取主表中关联字段 advancedSetting.openview
 * 这是用户在关联字段上设置的"打开记录时的视图"，优先级高于目标表默认视图
 * @param {string} relationControlId - type:200参数中 value.cid 的值
 * @returns {string} viewId 或 ""
 */
async function getRelationOpenView(relationControlId) {
  const res = await apis.worksheet.getWorksheetInfo({
    worksheetId: config.worksheetId, getTemplate: true
  });
  const controls = res?.template?.controls || res?.data?.template?.controls || [];
  const relField = controls.find(c => c.controlId === relationControlId);
  if (relField && relField.advancedSetting && relField.advancedSetting.openview) {
    return relField.advancedSetting.openview;
  }
  return "";
}
```

### 2.4 getViews — 获取目标工作表的视图列表

```javascript
/**
 * ★ 三层降级获取视图列表
 *   1) mdye API 无 getTemplate → 扫描 4 条路径
 *   2) mdye API 含 getTemplate → 扫描 4 条路径
 *   3) V3 API api.call("app","getWorksheetStructure") → data.views
 * @param {string} worksheetId - 目标工作表ID
 * @returns {Array<{viewId:string, name:string, type:string}>}
 */
async function getViews(worksheetId) {
  var r = await apis.worksheet.getWorksheetInfo({ worksheetId });
  var views = r?.views || r?.data?.views || r?.template?.views || r?.data?.template?.views || [];
  if (views.length === 0) {
    r = await apis.worksheet.getWorksheetInfo({ worksheetId, getTemplate: true });
    views = r?.views || r?.data?.views || r?.template?.views || r?.data?.template?.views || [];
  }
  if (views.length === 0) {
    try {
      var v3 = await api.call("app", "getWorksheetStructure", { worksheet_id: worksheetId });
      views = v3?.data?.views || v3?.views || [];
    } catch (e) {}
  }
  return views.map(function(v) { return { viewId: v.viewId || v.id, name: v.name, type: v.type }; });
}
```

### 2.5 paramText — 归一化参数值为纯文本

```javascript
/**
 * ★ env 中下拉/选项参数值是 ["key"] 数组，不能直接当字符串比较
 *   必须用此函数提取纯文本后再匹配
 * @param {*} raw - env 参数原始值
 * @returns {string} 纯文本
 */
function paramText(raw) {
  if (raw === undefined || raw === null) return "";
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw)) return raw.length > 0 ? String(raw[0]) : "";
  if (typeof raw === "object") return raw.value || raw.key || raw.name || "";
  return String(raw);
}
```

### 2.6 视图ID 获取优先级（★ 核心规则）

```
关联工作表的数据获取:
  vId = getRelationOpenView(cid)   // 1. 关联字段 advancedSetting.openview
     ∥  getViews(ws)[0].viewId     // 2. 目标表第一个视图（降级）

当前工作表的数据获取:
  vId = config.viewId               // 直接用当前视图ID
```

**openview 来源证明：**
```json
// 主表关联字段 controls 中:
{
  "controlId": "...",
  "dataSource": "69edcfa26d759b382b16b780",   // 目标工作表ID
  "advancedSetting": {
    "openview": "69edcfa26d759b382b16b857"     // ★ 关联视图ID
  }
}
```

### 2.7 完整使用模式

```javascript
// ── 链1/链2: 表头/附属事件 (sourceControlType=29) ──
var param = parseParam(env.headerDisplayField);        // → {cid, fids}
var wsId = await resolveWorksheet(param.cid);          // → 目标工作表ID
var openView = await getRelationOpenView(param.cid);    // → 关联视图ID 或 ""
var views = await getViews(wsId);
var vId = openView || (views.length > 0 ? views[0].viewId : "");  // ★ 优先级
var controls = await getControls(wsId);                // → 目标表字段列表
var field = controls.find(c => c.controlId === param.fids[0]);
var records = await getFilteredRows(wsId, dateFilter, vId);  // ★ 必须带 vId

// ── 链3: 主事件 (sourceControlType=0) ──
var param = parseParam(env.mainEventDateField);        // → {cid:"", fids:["字段ID"]}
var controls = await getControls(config.worksheetId);
var field = controls.find(c => c.controlId === param.fids[0]);
var vId = config.viewId;                               // ★ 当前视图ID
var records = await getFilteredRows(config.worksheetId, dateFilter, vId);

// ── 表头专用条件过滤 (headerFilterField + Headerconditonvalue) ──
var hFilt = parseParam(env.headerFilterField);         // → {cid, fids}
var fWs = await resolveWorksheet(hFilt.cid);           // 过滤条件可能指向不同工作表
var fCs = fWs === wsId ? controls : await getControls(fWs);
var fc = fCs.find(c => c.controlId === hFilt.fids[0]);  // 过滤字段
var fvText = paramText(env.Headerconditonvalue);        // ★ 归一化参数值
records = filterByFieldText(records, hFilt.fids[0], fc, fvText);
// filterByFieldText 内部用 parseField 提取字段值的 display text，精确匹配
```

---

## 三、字段值解析规范

### 3.1 parseField — 统一字段值提取

```javascript
/**
 * 按字段类型从 record 中解析显示文本、标识ID、配色、选项索引
 * @param {*} raw - record[fieldId] 的原始值
 * @param {Object|null} control - 字段的 controls 配置（含 options）
 * @returns {{text: string, id: string, color: string, idx: number}}
 */
function parseField(raw, control) {
  if (raw == null || raw === "") return { text: "", id: "", color: "", idx: 0 };
  const s = String(raw);

  // 纯文本/数字/日期 → 直接返回
  if (!s.startsWith("[") && !s.startsWith("{")) return { text: s, id: s, color: "", idx: 0 };

  try {
    const p = JSON.parse(s);

    // ── 数组格式 ──
    if (Array.isArray(p)) {
      if (p.length === 0) return { text: "", id: "", color: "", idx: 0 };
      const first = p[0];

      // 关联记录(29)/成员(26)/部门(27): [{sid/accountId/departmentId, name/fullname/departmentName}]
      if (typeof first === "object") {
        let text = first.name || first.fullname || first.departmentName || first.value || "";
        const id = first.sid || first.rowid || first.accountId || first.departmentId || "";
        // sourcevalue 中提取姓名（用于 namefield 别名场景）
        if (first.sourcevalue && typeof first.sourcevalue === "string") {
          try {
            const sv = JSON.parse(first.sourcevalue);
            for (const k of Object.keys(sv)) {
              if (/[\u4e00-\u9fa5]/.test(sv[k])) { text = sv[k]; break; }
            }
          } catch (e) {}
        }
        return { text, id, color: first.color || "", idx: 0 };
      }

      // 选项/下拉(9/10/11): ["key"] → 查 options 取 value & color & idx
      if (control?.options) {
        const idx = control.options.findIndex(o => String(o.key) === String(first));
        const opt = control.options[idx];
        if (opt && idx >= 0) return {
          text: opt.value || String(first), id: String(first), color: opt.color || "", idx
        };
      }
      return { text: String(first), id: String(first), color: "", idx: 0 };
    }

    // ── 对象格式 ──
    if (typeof p === "object" && p !== null) {
      return {
        text: p.name || p.fullname || p.departmentName || p.value || "",
        id: p.sid || p.rowid || p.accountId || p.departmentId || "",
        color: p.color || "", idx: 0
      };
    }
  } catch (e) {}

  return { text: s, id: s, color: "", idx: 0 };
}
```

### 3.2 辅助时间函数

```javascript
/** 从任意格式时间字符串提取 HH:mm */
function extractTime(raw) {
  if (!raw) return null;
  const m = String(raw).match(/(\d{2}:\d{2})/);
  return m ? m[1] : null;
}

/** "HH:mm" → 分钟数 */
function timeToMin(t) {
  const [h, m] = String(t).split(":").map(Number);
  return h * 60 + m;
}
```

---

## 四、颜色处理规范

### 4.1 问题

明道云下拉选项的 `options[].color` 可能是 CSS 变量（如 `var(--color-text-primary)`），inline style 中无法渲染，导致背景透明。已验证 11 个选项中有 2 个是 CSS 变量。

### 4.2 safeColor — 检测 CSS 变量并回退到调色板

```javascript
const COLOR_PALETTE = [
  "#1890ff","#52c41a","#faad14","#f5222d","#722ed1","#13c2c2",
  "#eb2f96","#fa8c16","#2f54eb","#a0d911","#fa541c","#1b9a59"
];

/**
 * @param {string} raw - 选项 color 原始值 (如 "#1677ffff" 或 "var(--color-text-primary)")
 * @param {number} idx - 选项在 options 数组中的索引 (来自 parseField 的 idx)
 * @returns {string} 可用的 hex 颜色，CSS 变量回退到调色板
 */
function safeColor(raw, idx) {
  if (!raw) return "";
  if (typeof raw === "string" && raw.startsWith("var(--")) {
    return COLOR_PALETTE[(idx || 0) % COLOR_PALETTE.length];
  }
  return raw;
}
```

### 4.3 事件颜色赋值

```javascript
// 背景色
const bgVal = parseField(record[bgFieldId], bgControl);
const bgColor = safeColor(bgVal.color, bgVal.idx) || (isMainEvent ? "#2196F3" : "#4CAF50");

// 字体色
const fontVal = parseField(record[fontFieldId], fontControl);
const fontColor = safeColor(fontVal.color, fontVal.idx) || "#fff";

// 附属事件渲染
//   opacity: 0.65
//   borderLeft: "3px solid " + bgColor
//   zIndex: 1

// 主事件渲染
//   opacity: 1
//   zIndex: 3
```

---

## 五、数据加载规范（三链架构）

### 5.1 加载流程图

```
useEffect(currentDate, refreshKey)
  │
  ├─ try ─────────────────────────────────────────────────┐
  │                                                        │
  ├── 链1: 表头加载 (独立 try/catch, 失败不阻断后续)       │
  │   1. param = parseParam(env.headerDisplayField)        │
  │   2. ws = resolveWorksheet(param.cid)                  │
  │   3. openview = getRelationOpenView(param.cid)          │
  │      ★ 提取关联字段 advancedSetting.openview (关联视图)  │
  │   4. views = getViews(ws), vId = openview ∥ views[0]   │
  │      ★ 优先级: openview > views[0].viewId              │
  │   5. controls = getControls(ws)                        │
  │   6. records = getFilteredRows(ws, null, vId)          │
  │   7. 遍历: parseField → {name,group,accountId}         │
  │   8. 如有 headerFilterField → 客户端过滤                │
  │   9. staffMap: Map<accountId, {name,group}>            │
  │                                                        │
  ├── 链2: 附属事件 (独立 try/catch, wsId 为空跳过)        │
  │   1. param = parseParam(env.subEventDateField)          │
  │   2. ws = resolveWorksheet(param.cid)                  │
  │   3. openview = getRelationOpenView(param.cid)          │
  │   4. views = getViews(ws), vId = openview ∥ views[0]   │
  │   5. controls = getControls(ws)                        │
  │   6. fc = buildDateFilter(param.fids[0], currentDate)  │
  │   7. records = getFilteredRows(ws, fc, vId)            │
  │   8. 遍历: extractTime → 主体匹配 → 时长 → 颜色 → push │
  │                                                        │
  ├── 链3: 主事件 (独立 try/catch)                         │
  │   1. param = parseParam(env.mainEventDateField)         │
  │   2. controls = getControls(config.worksheetId)        │
  │   3. fc = buildDateFilter(param.fids[0], currentDate)  │
  │       fc += config.filters.filterControls (视图筛选)    │
  │   4. records = getFilteredRows(wsId, fc, viewId)       │
  │      ★ viewId=config.viewId 传入以应用视图筛选          │
  │   5. 遍历: extractTime → 主体匹配 → 时长 → 颜色 → push │
  │                                                        │
  └── 合并 ───────────────────────────────────────────────┘
       finalStaffMap = headerStaffMap ∪ mainStaffMap (accountId 去重)
       finalEvents = mainEvents ∪ subEvents
```

### 5.2 基础 API 封装

```javascript
/** 获取工作表字段列表 */
async function getControls(worksheetId) {
  const res = await apis.worksheet.getWorksheetInfo({ worksheetId, getTemplate: true });
  return res?.template?.controls || res?.data?.template?.controls || [];
}

/** 获取工作表视图列表
 *  ★ 关联工作表（链1表头/链2附属事件）需通过此函数获取 viewId 传入 getFilteredRows
 *  @returns {Array<{viewId:string, name:string, type:string}>}
 */
async function getViews(worksheetId) {
  var r = await apis.worksheet.getWorksheetInfo({ worksheetId });
  var views = r?.views || r?.data?.views || r?.template?.views || r?.data?.template?.views || [];
  if (views.length === 0) {
    r = await apis.worksheet.getWorksheetInfo({ worksheetId, getTemplate: true });
    views = r?.views || r?.data?.views || r?.template?.views || r?.data?.template?.views || [];
  }
  if (views.length === 0) {
    try {
      var v3 = await api.call("app", "getWorksheetStructure", { worksheet_id: worksheetId });
      views = v3?.data?.views || v3?.views || [];
    } catch (e) {}
  }
  return views.map(function(v) { return { viewId: v.viewId || v.id, name: v.name, type: v.type }; });
}

/** 获取关联字段设置的打开视图ID
 *  ★ 提取主表中关联字段 advancedSetting.openview，优先级高于 getViews[0]
 *  @returns {string} viewId 或 ""
 */
async function getRelationOpenView(relationControlId) {
  const res = await apis.worksheet.getWorksheetInfo({ worksheetId: config.worksheetId, getTemplate: true });
  const controls = res?.template?.controls || res?.data?.template?.controls || [];
  const f = controls.find(c => c.controlId === relationControlId);
  if (f && f.advancedSetting && f.advancedSetting.openview) return f.advancedSetting.openview;
  return "";
}

/** 获取记录数据
 * @param {string} worksheetId - 工作表ID
 * @param {Array}  filterControls - 过滤条件数组
 * @param {string} viewId - 视图ID (★ 必须传入以应用视图筛选条件)
 */
async function getFilteredRows(worksheetId, filterControls, viewId) {
  var params = {
    worksheetId, pageSize: 1000, pageIndex: 1,
    notGetTotal: true, filterControls: filterControls || [],
    appId: config.appId
  };
  if (viewId) params.viewId = viewId;
  const res = await apis.worksheet.getFilterRows(params);
  return res?.data || [];
}
```

### 5.3 日期过滤构造

```javascript
/**
 * 构造 getFilterRows 的日期过滤条件
 * 已验证: dataType=15, filterType=17, dateRange=18, dateRangeType=3
 */
function buildDateFilter(controlId, dateStr) {
  return [{
    controlId,
    dataType: 15,
    spliceType: 1,
    filterType: 17,
    dateRange: 18,
    dateRangeType: 3,
    value: dateStr,                    // "YYYY-MM-DD"
    values: [],
    isDynamicsource: false,
    dynamicSource: []
  }];
}
```

### 5.4 万能字段值文本过滤（★ 推荐）

```javascript
/**
 * ★ 万能取值: 根据字段类型提取 display text
 *   基于 parseField，支持所有字段类型 (文本/选项/关联/成员/部门等)
 * @param {*} raw - record[fieldId] 的原始值
 * @param {Object} control - 字段的 controls 配置
 * @returns {string} 显示文本
 */
function getFieldText(raw, control) { return parseField(raw, control).text; }

/**
 * ★ 万能过滤: 按字段 display text 精确匹配
 *   替代 filterByDropdown + filterByText，统一接口
 * @param {Array} records - 记录列表
 * @param {string} fieldId - 字段 controlId
 * @param {Object} control - 字段 controls 配置
 * @param {string} expectedText - 期望文本 (★ 先用 paramText 归一化)
 * @returns {Array} 过滤后记录列表
 */
function filterByFieldText(records, fieldId, control, expectedText) {
  return records.filter(function(r) {
    return getFieldText(r[fieldId], control) === expectedText;
  });
}
```

**调用示例（表头专用条件过滤）：**
```javascript
var hFilt = parseParam(env.headerFilterField);         // → {cid, fids}
var fWs = await resolveWorksheet(hFilt.cid);           // 可能指向不同工作表
var fCs = fWs === hWs ? hCs : await getControls(fWs);
var fc = fCs.find(c => c.controlId === hFilt.fids[0]);  // 过滤字段
var fvText = paramText(env.Headerconditonvalue);        // ★ 归一化: ["排班"] → "排班"
records = filterByFieldText(records, hFilt.fids[0], fc, fvText);
```

**旧版过滤函数（已不推荐，保留兼容）：**
```javascript
/** 下拉字段过滤: 显示文本→key→匹配record中JSON数组 (仅选项类型) */
function filterByDropdown(records, fieldId, control, displayValue) { ... }

/** 文本字段过滤 (仅纯文本类型) */
function filterByText(records, fieldId, value) { ... }
```

### 5.5 主体匹配

```javascript
// 步骤1: 构建索引 O(1) 查找
const subjectIndex = {};
staffList.forEach((s, i) => { subjectIndex[s.accountId] = i; });

// 步骤2: 精确ID匹配
let col = subjectIndex[eventEmployeeId];

// 步骤3: 名称模糊回退 (处理ID格式不一致的情况)
if (col === undefined) {
  col = staffList.findIndex(s => s.name === eventEmployeeName);
}

// 步骤4: 仍未匹配 → 跳过该事件，记录日志
if (col === undefined) { /* log warning, continue */ }
```

### 5.6 时长计算优先级

```
主事件:
  1. mainEventDuration 字段值 (数值, 分钟) → 直接使用
  2. mainEventEndTime 字段值 → extractTime → duration = endMin - beginMin
  3. 都不配 → 跳过该事件 (不渲染)

附属事件:
  1. subEventTimeInterval 字段值 (数值, 分钟) → 直接使用
  2. subEventEndTime 字段值 → extractTime → duration = endMin - beginMin
  3. 都不配 → 跳过该事件 (不渲染)
```

### 5.7 加载锁

```javascript
const loadingRef = useRef({ header: false, main: false, sub: false });
async function loadChain(name, fn) {
  if (loadingRef.current[name]) return;
  loadingRef.current[name] = true;
  try { await fn(); }
  catch (e) { console.error("[" + name + "] fail:", e); }
  finally { loadingRef.current[name] = false; }
}
```

### 5.8 事件条构造

```javascript
// 所有变量收集完毕后 push
events.push({
  colIdx: col,              // 所在列索引 (匹配到的主体在 staffList 中的位置)
  start: beginTime,         // "HH:mm" 格式
  dur: durationMinutes,     // 分钟数
  title: displayText,       // "主体名称-事件内容" 或 仅"主体名称"
  color: bgColor,           // 背景色
  fc: fontColor,            // 字体色
  type: "main" | "sub"      // 事件类型
});
```

---

## 六、渲染规范

### 6.1 Z-Index 层级

```javascript
const Z_SPLIT_CORNER = 11;    // 锚点区: sticky top:0 + left:0, background:#fafafa
const Z_HEADER_ROW = 10;      // 表头行: sticky top:0, background:#fff
const Z_BODY_AXIS_CELL = 5;   // 时间轴: sticky left:0, background:#fafafa
const Z_BAR_MAIN = 3;         // 主事件条: 实色, 全交互
const Z_GRID_BG = 2;          // 网格背景线: pointer-events:none
const Z_BAR_SUB = 1;          // 附属事件条: 半透明, 只读

// 关键约束: 所有 sticky 元素必须设不透明 background，防止滚动时事件条从下方露出
```

### 6.2 附属事件渲染

```javascript
// opacity: 0.65
// zIndex: 1
// borderLeft: "3px solid " + bgColor
// cursor: default (非 pointer)
// 无拖拽手柄
// 无点击事件
// 无右键菜单
// 无叉号删除图标
```

### 6.3 主事件渲染

```javascript
// opacity: 1
// zIndex: 3
// cursor: pointer → 点击打开编辑弹窗
// 三个拖拽手柄: 上边改开始时间 / 中间移动 / 下边改结束时间
// 左上角 ✕ 图标: 快速删除
// 右键菜单: 确认删除
```

### 6.4 时间轴计算

```javascript
const startMin = timeToMin(beginTime);
const endMin = timeToMin(endTime);
const totalMin = Math.max(1, endMin - startMin);
const numSlots = Math.ceil(totalMin / timeInterval);
const availH = window.innerHeight - 120;          // 可用高度减去工具栏+表头
const rowHeight = Math.max(availH, numSlots * 24); // 每个slot最小24px
const slotHeight = rowHeight / numSlots;

// 事件条定位
const evStartMin = timeToMin(event.start);
const evEndMin = evStartMin + event.dur;
const top = ((Math.max(evStartMin, startMin) - startMin) / totalMin) * 100;
const height = ((Math.min(evEndMin, endMin) - Math.max(evStartMin, startMin)) / totalMin) * 100;

// 渲染条件: height > 0 && top < 100 → 否则 return null
```

### 6.5 锚点区

```javascript
// 宽度: 80px (强制与时间轴列宽一致)
// 位置: position:sticky; top:0; left:0; z-index:11
// 样式: CSS linear-gradient 斜线 从右上到左下
// 右上文字: "时间" (右对齐)
// 左下文字: "人员" (左对齐)
```

### 6.6 工具栏

```
桌面端: < 前一天  [日期]  后一天 >  ●今天  🔄  {表头名}:N  主事件:N  附属事件:N
移动端: <  [日]  >  📅  🔄  👥N  📋N  📌N

附属事件 wsId 未配置 → 自动隐藏附属事件计数
刷新按钮: 重新加载当前日期数据，不改变选中日期
```

---

## 七、完整可复用工具函数库

```javascript
// ── 参数解析 ──
function parseParam(raw)                    → {cid:string, fids:string[]}|null
async function resolveWorksheet(relCid)     → dataSource|""

// ── 字段值 ──
function parseField(raw, control)           → {text, id, color, idx}
function safeColor(raw, idx)               → hexColor|""
function extractTime(raw)                   → "HH:mm"|null
function timeToMin(t)                       → number

// ── 数据获取 ──
async function resolveWorksheet(relCid)       → dataSource|""
async function getRelationOpenView(relCid)    → viewId|""
async function getControls(wsId)            → controls[]
async function getViews(wsId)               → [{viewId,name,type}]
async function getFilteredRows(wsId, fc, viewId) → records[]
function buildDateFilter(ctrlId, date)       → filterControls[]

// ── 万能字段值文本提取/过滤 ──
function getFieldText(raw, control)        → string
function filterByFieldText(recs,fid,ctrl,val) → records[]

// ── 客户端过滤 (旧版，已被 filterByFieldText 替代) ──
function filterByDropdown(recs, fid, ctrl, val) → records[]
function filterByText(recs, fid, val)           → records[]

// ── 主体匹配 ──
function buildIndex(staffList)              → {accountId: colIdx}
function matchSubject(eId, eName, idx, list) → colIdx|null
```

---

## 八、Mdye API 调用速查

```javascript
// 获取字段
const res = await apis.worksheet.getWorksheetInfo({ worksheetId, getTemplate: true });
const controls = res?.template?.controls || res?.data?.template?.controls || [];

// 获取记录（带日期过滤）
const rows = await apis.worksheet.getFilterRows({
  worksheetId, pageSize: 1000, pageIndex: 1,
  notGetTotal: true, filterControls: buildDateFilter(fid, date),
  appId: config.appId
});

// 事件监听
md_emitter.addListener('new-record', () => { isSilentRef.current = true; setKey(k => k + 1); });
md_emitter.addListener('delete-record', () => { isSilentRef.current = true; setKey(k => k + 1); });
md_emitter.addListener('update-record', () => { isSilentRef.current = true; setKey(k => k + 1); });

// 弹窗
utils.openRecordInfo({ appId: config.appId, worksheetId, viewId: config.viewId, recordId });
utils.openNewRecord({ worksheetId });
```

---

## 九、关键注意事项

| # | 要点 | 后果（如忽略） |
|---|------|---------------|
| 1 | **cid ≠ worksheetId**。cid 是控件 ID，必须通过 `dataSource` 获取 | 用 cid 做 worksheetId → 0 字段 → 无数据 |
| 2 | **CSS 变量颜色必须 safeColor**。`options[].color` 可能是 `var(--...)` | inline style 不渲染 → 背景透明 |
| 3 | **parseParam 的 JSON.parse 仅限 `{` 或 `[` 开头**。纯字符串 controlId 不解析 | 误解析 → 报错 |
| 4 | **时长不配则跳过**。durationField 和 endTimeField 都不配 → 不渲染事件 | 否则事件条高度为 0 |
| 5 | **附属事件全空隐藏**。subEventDateField + BeginTime 不配 → 跳过全链 | 不配却请求 → 报错 |
| 6 | **sourceControlType=29 → resolveWorksheet**。=0 → 直接用 config.worksheetId | 混用 → 错误的 controls |
| 7 | **sticky 元素必须不透明 background** | 事件条从表头/时间轴下方透出 |
| 8 | **parseField 的 idx 用于 safeColor**。同一选项 key → 同一 idx → 同一调色板色 | idx 错误 → 同选项不同颜色 |
| 9 | **默认值必须先 extractRowid 再使用**。`c.defaultValue` 可能是 `["{...嵌套JSON...}"]` | 直接当 sid 写入 → 格式错误 |
| 10 | **写入必须包含所有带默认值的字段**。只传关联字段会因必填字段缺失失败 | API 静默失败 |
| 11 | **日期必须用本地时间，禁用 `toISOString()`**。UTC 偏移导致东八区 8:00 前日期差一天 | 过滤日期错位一天 |
| 12 | **时长+结束时间同步写入**。duration 优先，自动计算 endTime 同步写入两者 | 数据不一致 |
| 13 | **获取主表记录必须传入 viewId**。`getFilteredRows(wsId, fc, config.viewId)` | 不传 viewId → 视图筛选条件不生效 → 全量数据 |
| 14 | **关联表视图ID优先级: openview > getViews[0]**。先查关联字段 `advancedSetting.openview`，无则取目标表第一个视图 | 优先级错误 → 视图筛选举止不一致 |
| 15 | **编辑后自检上下 20 行**。每次 edit 工具操作后，读回编辑区 + 上下 20 行确认无副作用 | 残留旧代码覆盖新代码 → 变量值被意外改写 |
| 16 | **同名 var 不允许重复赋值**。同一作用域内同一变量只能有一处 `var xxx =`。修改前 grep 变量名确认 | 覆盖赋值 → 前一个赋值白费，数据错误 |
| 17 | **参数值必须归一化**。`env` 中下拉参数值是 `["key"]` 数组不是字符串，过滤/比较前用 `paramText()` 提取文本 | `"text"==="["text"]"` → false，过滤静默失败 |

---

## E. 日期获取规范（关键）

### E.1 问题

`new Date().toISOString()` 返回 **UTC 时间**，东八区(UTC+8)早8点前 UTC 日期比本地日期少一天。

```
本地 5月25日 07:38 → UTC 5月24日 23:38 → toISOString() = "2026-05-24" ← 错误
```

### E.2 正确方式

```javascript
// ✅ 本地日期
var d = new Date();
var today = d.getFullYear() + "-"
  + String(d.getMonth() + 1).padStart(2, "0") + "-"
  + String(d.getDate()).padStart(2, "0");
// → "2026-05-25"

// ❌ 禁止
var today = new Date().toISOString().substring(0, 10); // UTC
```

### E.3 规范

- 页面展示、筛选 → 使用本地时间
- 接口存储 → 使用 `YYYY-MM-DD` 格式字符串
- 禁止 `toISOString()` 用于日期计算

---

## F. 时长与结束时间同步

### F.1 优先级

```
1. durationField(数值,分钟) → 直接使用
2. endTimeField(时间) → endMin - beginMin
3. 都不配 → 跳过事件
```

### F.2 写入规则

当 durationField **和** endTimeField **都配置**时，创建/更新记录必须**同时写入两字段**：

```javascript
var beginTime = "09:00";
var duration = 60; // 分钟
var endMin = timeToMin(beginTime) + duration;
var endTime = pad2(Math.floor(endMin/60)) + ":" + pad2(endMin%60);

receiveControls = [
  { controlId: beginFieldId, type: 16, value: today + " " + beginTime + ":00" },
  { controlId: durationFieldId, type: 6, value: String(duration) },       // 写入时长
  { controlId: endTimeFieldId, type: 16, value: today + " " + endTime + ":00" } // 写入结束时间
];
// 两端同步保证数据一致
```

---

## 十、时间轴完整规范（已验证）

### 10.1 参数定义

| fieldId | 类型 | 默认值 | 说明 |
|---------|------|--------|------|
| `beginTime` | 文本 | "08:00" | 时间轴开始时间(HH:mm) |
| `endTime` | 文本 | "23:00" | 时间轴结束时间(HH:mm) |
| `timeInterval` | 数字 | 15 | 刻度间隔(分钟) |
| `showstyle` | 下拉(11) | "单一时间" | "单一时间"=仅显示起始 | "时间区间"=显示完整时段 |
| `colwidth` | 数字 | 60/80 | 时间轴列宽(px)，不配则自动：single=60, range=80 |

### 10.2 showstyle 解析

```javascript
var style = env.showstyle;
var showRange = false;
if (style) {
  try {
    // 下拉值可能是 JSON数组["key"] 或直接字符串
    var p = typeof style === "string" && style.startsWith("[") ? JSON.parse(style)[0] : style;
    showRange = String(p).indexOf("区间") >= 0;
  } catch (e) {}
}
```

### 10.3 核心计算

```javascript
var axisW = Number(env.colwidth) || (showRange ? 80 : 60);   // 列宽
var fontSize = showRange ? 9 : 12;                            // 字号
var sMin = timeToMin(beginTime), eMin = timeToMin(endTime);
var tMin = Math.max(1, eMin - sMin);
var nSlots = Math.ceil(tMin / timeInterval);                 // 刻度数量
var avH = Math.max(window.innerHeight - 100, 400);            // 可用高度
var rowHeight = Math.max(avH, nSlots * 24);                   // 最小24px/slot
var slotHeight = rowHeight / nSlots;
```

### 10.4 刻度标签生成

```javascript
var slots = [];
for (var si = 0; si < nSlots; si++) {
  var m = sMin + si * timeInterval;
  var hh = Math.floor(m / 60), mm = m % 60;
  if (showRange) {
    var nh = Math.floor((m + timeInterval) / 60), nm = (m + timeInterval) % 60;
    slots.push({
      label: pad2(hh) + ":" + pad2(mm) + "-" + pad2(nh) + ":" + pad2(nm),
      isHour: mm === 0
    });
  } else {
    slots.push({
      label: pad2(hh) + ":" + pad2(mm),
      isHour: mm === 0
    });
  }
}
function pad2(n) { return (n < 10 ? "0" : "") + n; }
```

### 10.5 网格背景

```javascript
var gridBg = "repeating-linear-gradient(to bottom, transparent 0px, transparent "
  + (slotHeight - 1) + "px, #e8e8e8 " + (slotHeight - 1) + "px, #e8e8e8 " + slotHeight + "px)";
```

### 10.6 渲染结构

```javascript
// 时间轴容器: position: sticky, left: 0, z-index: 5, background: #fafafa
// 宽度: axisW px
// 每个 slot: height = slotHeight, border-bottom: 1px solid #f5f5f5
//   整点标签: color #666, 非整点标签: color #ccc (single模式不显示非整点)
//   range 模式: 显示所有标签, fontSize: 9px, padding: 0 2px
//   single 模式: fontSize: 12px, padding: 0 6px
// 右侧网格区: flex:1, background: gridBg
```

### 10.7 事件条定位公式

```javascript
var evStartMin = timeToMin(event.start);
var evEndMin = evStartMin + event.durationMin;
var top = ((Math.max(evStartMin, sMin) - sMin) / tMin) * 100;     // %
var height = ((Math.min(evEndMin, eMin) - Math.max(evStartMin, sMin)) / tMin) * 100;  // %
// 渲染条件: height > 0 && top < 100
```
