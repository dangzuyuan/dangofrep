import { COLOR_PALETTE as CP } from "./constants";

export { CP };

export function parseField(raw, control) {
  if (raw == null || raw === "") return { text: "", id: "", color: "", idx: 0 };
  var s = String(raw);
  if (!s.startsWith("[") && !s.startsWith("{")) return { text: s, id: s, color: "", idx: 0 };
  try {
    var p = JSON.parse(s);
    if (Array.isArray(p)) {
      if (p.length === 0) return { text: "", id: "", color: "", idx: 0 };
      var first = p[0];
      if (typeof first === "object") {
        var text = first.name || first.fullname || first.departmentName || first.value || "";
        var id = first.sid || first.rowid || first.accountId || first.departmentId || "";
        if (first.sourcevalue && typeof first.sourcevalue === "string") {
          try {
            var sv = JSON.parse(first.sourcevalue);
            var ks = Object.keys(sv);
            for (var ki = 0; ki < ks.length; ki++) {
              if (/[\u4e00-\u9fa5]/.test(sv[ks[ki]])) { text = sv[ks[ki]]; break; }
            }
          } catch (e) {}
        }
        return { text: text, id: id, color: first.color || "", idx: 0 };
      }
      if (control && control.options) {
        var idx = control.options.findIndex(function(o) { return String(o.key) === String(first); });
        var opt = control.options[idx];
        if (opt && idx >= 0) return { text: opt.value || String(first), id: String(first), color: opt.color || "", idx: idx };
      }
      return { text: String(first), id: String(first), color: "", idx: 0 };
    }
    if (typeof p === "object" && p !== null) {
      return { text: p.name || p.fullname || p.departmentName || p.value || "", id: p.sid || p.rowid || p.accountId || p.departmentId || "", color: p.color || "", idx: 0 };
    }
  } catch (e) {}
  return { text: s, id: s, color: "", idx: 0 };
}

var VAR_COLOR_MAP = {
  "var(--color-text-title)": "#1f1f1f",
  "var(--color-text-primary)": "#262626",
  "var(--color-text-secondary)": "#8c8c8c",
  "var(--color-background-card)": "#ffffff",
  "var(--color-background)": "#ffffff",
  "var(--color-primary)": "#1677ff",
  "var(--color-border)": "#d9d9d9",
  "var(--color-border-secondary)": "#f0f0f0",
};

export function safeColor(raw, idx) {
  if (!raw) return "";
  if (typeof raw === "string" && raw.startsWith("var(--")) {
    if (VAR_COLOR_MAP[raw]) return VAR_COLOR_MAP[raw];
    return CP[(idx || 0) % CP.length];
  }
  if (typeof raw === "string" && raw.length >= 9 && raw.startsWith("#")) return raw.substring(0, 7);
  return raw;
}

export function extractTime(raw) {
  if (!raw) return null;
  var m = String(raw).match(/(\d{2}:\d{2})/);
  return m ? m[1] : null;
}

export function timeToMin(t) {
  var a = String(t).split(":").map(Number);
  return a[0] * 60 + a[1];
}

export function getFieldText(raw, control) { return parseField(raw, control).text; }

export function filterByFieldText(records, fieldId, control, expectedText) {
  return records.filter(function(r) {
    return getFieldText(r[fieldId], control) === expectedText;
  });
}

/**
 * 万能字段显示文本提取 — 不管什么字段类型，稳定返回文字
 * 覆盖明道云所有字段类型（2/6/9/10/11/14/15/16/26/27/29/30/32/36/46等）
 * @param {*} raw - record[fieldId] 的原始值
 * @param {Object|null} control - 字段的 controls 配置
 * @returns {string} 显示文本
 */
export function extractFieldText(raw, control) {
  if (raw === undefined || raw === null || raw === "") return "";

  var s = String(raw);

  // 纯文本/数字 → 直接返回
  if (!s.startsWith("[") && !s.startsWith("{")) return s;

  try {
    var p = JSON.parse(s);
    // JSON 数组
    if (Array.isArray(p)) {
      if (p.length === 0) return "";
      var first = p[0];
      // 对象数组（关联记录/成员/部门）
      if (typeof first === "object") {
        var t = first.name || first.fullname || first.departmentName || first.value || first.text || "";
        // sourcevalue 兜底（namefield 别名场景）
        if (!t && first.sourcevalue && typeof first.sourcevalue === "string") {
          try {
            var ssv = JSON.parse(first.sourcevalue);
            for (var sk in ssv) { if (ssv[sk] && String(ssv[sk]).trim()) { t = String(ssv[sk]); break; } }
          } catch (e2) {}
        }
        if (!t) t = first.sid || first.rowid || first.accountId || first.departmentId || "";
        return t;
      }
      // 字符串数组（选项/下拉 key）
      if (control && control.options) {
        var opt = control.options.find(function(o) { return String(o.key) === String(first) || String(o.value) === String(first); });
        return opt ? (opt.value || String(first)) : String(first);
      }
      return String(first);
    }
    // JSON 对象
    if (typeof p === "object" && p !== null) {
      return p.name || p.fullname || p.departmentName || p.value || p.text || p.title || "";
    }
  } catch (e) {}

  // 所有途径失败 → 返回原始字符串
  return s;
}

/**
 * 万能字段写入值组装 — 根据字段类型生成 mdye API 格式
 * 与 extractFieldText（读）成对，覆盖所有写入类型
 * @param {number} type - 字段类型编号（2/6/9/10/11/15/16/26/27/29/36/46）
 * @param {*} val - 写入的值
 * @returns {string} API 可接受的 value 字符串
 */
export function buildFieldValue(type, val) {
  if (val === undefined || val === null) return "";
  if (type === 29) return JSON.stringify([{ sid: val }]);
  if (type === 26) return JSON.stringify([{ accountId: val }]);
  if (type === 27) return JSON.stringify([{ departmentId: val }]);
  if (type === 9 || type === 11) return JSON.stringify([val]);
  if (type === 10) return JSON.stringify(Array.isArray(val) ? val : [val]);
  if (type === 8) return String(val);
  if (type === 14) return JSON.stringify(val);
  return String(val);
}

/**
 * 从嵌套 JSON 中提取 rowid / sid
 * 支持格式: "id", ["id"], ["{...}"], [{sid:"id",...}]
 * @param {*} val - 字段值
 * @returns {string} rowid 或 ""
 */
export function extractRowid(val) {
  if (!val || val === "") return "";
  if (typeof val === "string" && val.length < 50 && !val.startsWith("[") && !val.startsWith("{")) return val;
  try {
    var p = typeof val === "string" ? JSON.parse(val) : val;
    while (true) {
      if (Array.isArray(p) && p.length > 0) {
        var f = p[0];
        if (typeof f === "object") return f.sid || f.rowid || f._id || "";
        if (typeof f === "string") { try { var j = JSON.parse(f); if (typeof j === "object") { p = j; continue; } } catch (e2) { return f; } }
        return String(f);
      }
      if (typeof p === "object") return p.sid || p.rowid || p._id || "";
      break;
    }
  } catch (e) {}
  return "";
}

/**
 * 类型感知默认值提取 — 根据字段类型直接从 control 中提取默认值
 * 覆盖: 2/6/8/9/10/11/15/16/26/27/29/36/46
 * @param {Object} control - 字段的 controls 配置
 * @returns {string|string[]} 默认值，无默认返回 ""
 */
export function getDefaultValue(control) {
  var dv = control.defaultValue;
  if (typeof dv === "string" && (dv.startsWith("[") || dv.startsWith("{"))) {
    try { dv = JSON.parse(dv); } catch (e) {}
  }
  if (dv === undefined || dv === null) dv = "";

  var dsArr = null;
  if (control.advancedSetting && control.advancedSetting.defsource) {
    try {
      var dsRaw = control.advancedSetting.defsource;
      if (typeof dsRaw === "string") dsRaw = JSON.parse(dsRaw);
      if (Array.isArray(dsRaw) && dsRaw.length > 0) dsArr = dsRaw;
    } catch (e) {}
  }

  // type 10: 合并 defaultValue + defsource
  if (control.type === 10) {
    var keys = Array.isArray(dv) ? dv.slice() : (dv ? [dv] : []);
    if (dsArr) { dsArr.forEach(function(item) { if (item.staticValue && keys.indexOf(item.staticValue) < 0) keys.push(item.staticValue); }); }
    return keys.length > 0 ? keys : "";
  }

  // type 29: extractRowid → defsource 兜底
  if (control.type === 29) {
    if (dv) { var rid = extractRowid(dv); if (rid) return rid; }
    if (dsArr && dsArr[0] && dsArr[0].staticValue) { var r2 = extractRowid(dsArr[0].staticValue); if (r2) return r2; }
    return "";
  }

  // type 26: 成员 → extract accountId
  if (control.type === 26) {
    if (dv) {
      if (typeof dv === "string") return dv;
      if (Array.isArray(dv) && dv.length > 0) { var acc = typeof dv[0] === "string" ? dv[0] : (dv[0].accountId || ""); if (acc) return acc; }
      if (typeof dv === "object") return dv.accountId || "";
    }
    if (dsArr && dsArr[0] && dsArr[0].staticValue) {
      try { var sv26 = dsArr[0].staticValue; var o26 = JSON.parse(sv26); if (o26.accountId) return o26.accountId; return sv26; } catch (e) { return dsArr[0].staticValue; }
    }
    return "";
  }

  // type 27: 部门 → extract departmentId
  if (control.type === 27) {
    if (dv) {
      if (typeof dv === "string") return dv;
      if (Array.isArray(dv) && dv.length > 0) { var dep = typeof dv[0] === "string" ? dv[0] : (dv[0].departmentId || ""); if (dep) return dep; }
      if (typeof dv === "object") return dv.departmentId || "";
    }
    if (dsArr && dsArr[0] && dsArr[0].staticValue) {
      try { var sv27 = dsArr[0].staticValue; var o27 = JSON.parse(sv27); if (o27.departmentId) return o27.departmentId; return sv27; } catch (e) { return dsArr[0].staticValue; }
    }
    return "";
  }

  // type 9/11: dv → ds → options
  if (control.type === 9 || control.type === 11) {
    if (dv) return Array.isArray(dv) ? String(dv[0]) : String(dv);
    if (dsArr && dsArr[0] && dsArr[0].staticValue) return dsArr[0].staticValue;
    if (control.options) { var o = control.options.find(function(x) { return x.isDefault; }); if (o) return o.key; }
    return "";
  }

  // 通用: dv → ds
  if (dv) { return typeof dv === "string" ? dv : (Array.isArray(dv) ? (dv.length > 0 ? String(dv[0]) : "") : String(dv)); }
  if (dsArr && dsArr[0] && dsArr[0].staticValue) return dsArr[0].staticValue;
  return "";
}

/**
 * 系统字段跳过判断 — 创建记录时应排除的字段类型和 ID
 * @param {Object} control - 字段配置
 * @returns {boolean}
 */
var _skipTypes = [30,31,32,33,34,35,37,38,39,40,41,42,43,44,45,47,48,49,50];
export function isSkipControl(control) {
  if (_skipTypes.indexOf(control.type) >= 0) return true;
  var id = control.controlId;
  if (!id) return true;
  if (id[0] === "_" || id === "rowid" || id === "autoid" || id === "ctime" || id === "utime" || id === "ownerid") return true;
  return false;
}
