/**
 * 拖拽回调处理器 — 将 TimeCalendar 回调转换为明道云 API 调用
 * mdye 0.1.x API: api.updateWorksheetRow / api.addWorksheetRow / api.deleteWorksheetRow
 */

import { buildFieldValue, extractRowid, getDefaultValue, isSkipControl } from "./parseField";
import {
  CONTROL_TYPE_DATETIME,
  CONTROL_TYPE_NUMBER,
  CONTROL_TYPE_RELATION,
  CONTROL_TYPE_DATE,
} from "./constants";

export function createDragHandler(opts) {
  var api = opts.api;
  var utils = opts.utils;
  var config = opts.config;
  var operatorFieldId = (opts.operatorFieldId || "").trim();
  var beginFieldId = (opts.beginFieldId || "").trim();
  var endFieldId = (opts.endFieldId || "").trim();
  var durationFieldId = (opts.durationFieldId || "").trim();
  var dateFieldId = (opts.dateFieldId || "").trim();
  var onError = opts.onError;    /* 可选：失败回调 function(err) */
  var statusFieldId = (opts.statusFieldId || "").trim();
  var events = opts.events;
  var onSaved = opts.onSaved;
  var controlsRef = opts.controlsRef;
  var staffIdMap = opts.staffIdMap || {};
  var currentDate = opts.currentDate || "";

  var workbookId = config.worksheetId;
  var appId = config.appId;
  var viewId = config.viewId;

  return {
    onEventClick: function(event) {
      if (!event._rowid && !event.id) return;
      var rowid = event._rowid || event.id;
      utils.openRecordInfo({ appId: appId, worksheetId: workbookId, viewId: viewId, recordId: rowid });
    },

    onEventDrop: function(data) {
      var eventId = data.eventId;
      var newResourceId = data.newResourceId;
      var newStart = data.newStart;
      var newEnd = data.newEnd;
      var sh = parseInt(newStart.split(":")[0], 10);
      var sm = parseInt(newStart.split(":")[1], 10);
      var eh = parseInt(newEnd.split(":")[0], 10);
      var em = parseInt(newEnd.split(":")[1], 10);
      var duration = eh * 60 + em - (sh * 60 + sm);

      var ev = (events || []).find(function(e) { return (e.rowid || e.id) === eventId; });
      if (!ev) return;

      var oldAccountId = ev.accountId;
      ev.start = newStart.substring(0, 5);
      ev.dur = duration;
      if (newResourceId !== oldAccountId) ev.accountId = newResourceId;

      /* ⚡修复：统一使用 buildTimeControls 组装时间字段 */
      var controls = buildTimeControls(newStart, newEnd, duration, {
        beginFieldId: beginFieldId,
        endFieldId: endFieldId,
        durationFieldId: durationFieldId
      });
      if (newResourceId !== oldAccountId && operatorFieldId) {
        var sid = staffIdMap[newResourceId] || newResourceId;
        controls.push({ controlId: operatorFieldId, type: CONTROL_TYPE_RELATION, value: buildFieldValue(CONTROL_TYPE_RELATION, sid) });
      }

      controls = filterValidControls(controls);
      api.updateWorksheetRow({
        appId: appId,
        worksheetId: workbookId,
        rowId: ev.rowid || ev.id,
        newOldControl: controls,
      }).then(function() {
        onSaved && onSaved();
      }).catch(function(err) {
        console.error("onEventDrop 写入失败:", err);
        if (onError) onError(err);
      });
    },

    onEventResize: function(data) {
      var eventId = data.eventId;
      var newStart = data.newStart;
      var newEnd = data.newEnd;
      var sh = parseInt(newStart.split(":")[0], 10);
      var sm = parseInt(newStart.split(":")[1], 10);
      var eh = parseInt(newEnd.split(":")[0], 10);
      var em = parseInt(newEnd.split(":")[1], 10);
      var duration = eh * 60 + em - (sh * 60 + sm);

      var ev = (events || []).find(function(e) { return (e.rowid || e.id) === eventId; });
      if (!ev) return;

      ev.start = newStart.substring(0, 5);
      ev.dur = duration;

      /* ⚡修复：统一使用 buildTimeControls 组装时间字段 */
      var controls = buildTimeControls(newStart, newEnd, duration, {
        beginFieldId: beginFieldId,
        endFieldId: endFieldId,
        durationFieldId: durationFieldId
      });

      controls = filterValidControls(controls);
      api.updateWorksheetRow({
        appId: appId,
        worksheetId: workbookId,
        rowId: ev.rowid || ev.id,
        newOldControl: controls,
      }).then(function() {
        onSaved && onSaved();
      }).catch(function(err) {
        console.error("onEventResize 写入失败:", err);
        if (onError) onError(err);
      });
    },

    onSelectSlot: function(data) {
      var resourceId = data.resourceId;
      var start = data.start;
      var end = data.end;
      var sh = parseInt(start.split(":")[0], 10);
      var sm = parseInt(start.split(":")[1], 10);
      var eh = parseInt(end.split(":")[0], 10);
      var em = parseInt(end.split(":")[1], 10);
      var duration = eh * 60 + em - (sh * 60 + sm);

      /* ⚡修复：统一使用 buildTimeControls 组装时间字段 */
      var controls = buildTimeControls(start, end, duration, {
        beginFieldId: beginFieldId,
        endFieldId: endFieldId,
        durationFieldId: durationFieldId
      });
      if (operatorFieldId) {
        var sid = staffIdMap[resourceId] || resourceId;
        controls.push({ controlId: operatorFieldId, type: CONTROL_TYPE_RELATION, value: buildFieldValue(CONTROL_TYPE_RELATION, sid) });
      }

      if (dateFieldId && currentDate) {
        controls.push({ controlId: dateFieldId, type: CONTROL_TYPE_DATE, value: currentDate });
      }


      // 携带所有带默认值的字段（来源：devtest/SKILL_RELATION.md 第四部分）
       var allControls = (controlsRef && controlsRef.current) || [];
      var explicitIds = [operatorFieldId, beginFieldId, endFieldId, durationFieldId, dateFieldId];
      for (var ci = 0; ci < allControls.length; ci++) {
        var c = allControls[ci];
        if (isSkipControl(c)) continue;
        if (explicitIds.indexOf(c.controlId) >= 0) continue;
        var dv = getDefaultValue(c);
        if (!dv && dv !== 0 && dv !== false) continue;
        controls.push({ controlId: c.controlId, type: c.type, value: buildFieldValue(c.type, dv) });
       }

      controls = filterValidControls(controls);
      api.addWorksheetRow({
        appId: appId,
        worksheetId: workbookId,
        receiveControls: controls,
      }).then(function(resp) {
        onSaved && onSaved();
        var newRowid = (resp && resp.data && resp.data.rowid) || (resp && resp.data && resp.data[0]) || "";
        if (newRowid) {
          utils.openRecordInfo({ appId: appId, worksheetId: workbookId, viewId: viewId, recordId: newRowid });
        }
      }).catch(function(err) {
        console.error("onSelectSlot 写入失败:", err);
      });
    },

    onEventDelete: function(event) {
      var rowid = (event && event._rowid) || (event && event.rowid) || event;
      if (!rowid || typeof rowid !== "string") return;
      if (!window.confirm("确认删除该记录？")) return;

      api.deleteWorksheetRow({
        appId: appId,
        worksheetId: workbookId,
        rowIds: [rowid],
      }).then(function() {
        onSaved && onSaved();
      }).catch(function(err) {
        console.error("onEventDelete 写入失败:", err);
        if (onError) onError(err);
      });
    },
  };
}

/* ============================================================
 * 工具函数：参数过滤 + 时间字段组装
 * ============================================================ */

/**
 * 校验时间字符串是否合法
 * @param {string} str - 时间字符串 "HH:mm" 或 "HH:mm:ss"
 * @returns {boolean}
 */
function isValidTimeString(str) {
  if (!str || typeof str !== "string") return false;
  var m = str.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return false;
  var h = parseInt(m[1], 10);
  var min = parseInt(m[2], 10);
  var s = m[3] !== undefined ? parseInt(m[3], 10) : 0;
  return h >= 0 && h <= 23 && min >= 0 && min <= 59 && s >= 0 && s <= 59;
}

/**
 * 过滤空值 controls，防止空字段写入明道云接口报错
 * 过滤规则：controlId 为空/空格、value 为 undefined/null/空白字符串/空数组
 * @param {Array} controls
 * @returns {Array}
 */
function filterValidControls(controls) {
  return controls.filter(function(c) {
    if (!c) return false;
    if (!c.controlId || c.controlId.trim() === "") return false;
    if (c.value === undefined || c.value === null) return false;
    if (typeof c.value === "string" && c.value.trim() === "") return false;
    if (Array.isArray(c.value) && c.value.length === 0) return false;
    return true;
  });
}

/**
 * 统一组装时间字段 controls
 * - beginFieldId：必传（fieldId 非空时）
 * - durationFieldId：仅当 Number.isInteger(duration) && duration > 0 时传
 * - endFieldId：仅当 fieldId 非空 && end 为有效时间字符串时传
 * 注：外层 API 调用前应统一执行 filterValidControls，本函数不做过滤
 * @param {string} begin - 开始时间 "HH:mm:ss"
 * @param {string} end - 结束时间 "HH:mm:ss"
 * @param {number} duration - 时长（分钟）
 * @param {Object} fieldIds - { beginFieldId, endFieldId, durationFieldId }
 * @returns {Array}
 */
function buildTimeControls(begin, end, duration, fieldIds) {
  var controls = [];

  /* beginFieldId：必传 */
  if (fieldIds.beginFieldId) {
    controls.push({
      controlId: fieldIds.beginFieldId,
      type: CONTROL_TYPE_DATETIME,
      value: begin
    });
  }

  /* durationFieldId：仅正整数有效时传 */
  if (fieldIds.durationFieldId && Number.isInteger(duration) && duration > 0) {
    controls.push({
      controlId: fieldIds.durationFieldId,
      type: CONTROL_TYPE_NUMBER,
      value: String(duration)
    });
  }

  /* endFieldId：仅有效时间字符串时传 */
  if (fieldIds.endFieldId && isValidTimeString(end)) {
    controls.push({
      controlId: fieldIds.endFieldId,
      type: CONTROL_TYPE_DATETIME,
      value: end
    });
  }

  return controls;
}
