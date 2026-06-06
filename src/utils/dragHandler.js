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
  var operatorFieldId = opts.operatorFieldId;
  var beginFieldId = opts.beginFieldId;
  var endFieldId = opts.endFieldId;
  var durationFieldId = opts.durationFieldId;
  var dateFieldId = opts.dateFieldId;
  var statusFieldId = opts.statusFieldId;
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

      var controls = [];
      if (beginFieldId) {
        controls.push({ controlId: beginFieldId, type: CONTROL_TYPE_DATETIME, value: newStart });
      }
      if (durationFieldId) {
        controls.push({ controlId: durationFieldId, type: CONTROL_TYPE_NUMBER, value: String(duration) });
      }
      if (newResourceId !== oldAccountId && operatorFieldId) {
        var sid = staffIdMap[newResourceId] || newResourceId;
        controls.push({ controlId: operatorFieldId, type: CONTROL_TYPE_RELATION, value: buildFieldValue(CONTROL_TYPE_RELATION, sid) });
      }

      api.updateWorksheetRow({
        appId: appId,
        worksheetId: workbookId,
        rowId: ev.rowid || ev.id,
        newOldControl: controls,
      }).then(function() {
        onSaved && onSaved();
      }).catch(function(err) {
        console.error("onEventDrop 写入失败:", err);
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

      var controls = [];
      if (beginFieldId) {
        controls.push({ controlId: beginFieldId, type: CONTROL_TYPE_DATETIME, value: newStart });
      }
      if (durationFieldId) {
        controls.push({ controlId: durationFieldId, type: CONTROL_TYPE_NUMBER, value: String(duration) });
      }

      api.updateWorksheetRow({
        appId: appId,
        worksheetId: workbookId,
        rowId: ev.rowid || ev.id,
        newOldControl: controls,
      }).then(function() {
        onSaved && onSaved();
      }).catch(function(err) {
        console.error("onEventResize 写入失败:", err);
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

      var controls = [];
      if (operatorFieldId) {
        var sid = staffIdMap[resourceId] || resourceId;
        controls.push({ controlId: operatorFieldId, type: CONTROL_TYPE_RELATION, value: buildFieldValue(CONTROL_TYPE_RELATION, sid) });
      }
      if (beginFieldId) {
        var allCs = (controlsRef && controlsRef.current) || [];
        var bc = allCs.find(function(c) { return c.controlId === beginFieldId; });
        var beginVal = (bc && bc.type === 46) ? start : (currentDate + " " + start.substring(0, 5) + ":00");
        controls.push({ controlId: beginFieldId, type: bc ? bc.type : 16, value: beginVal });
      }
      if (dateFieldId && currentDate) {
        controls.push({ controlId: dateFieldId, type: CONTROL_TYPE_DATE, value: currentDate });
      }
      if (durationFieldId) {
        controls.push({ controlId: durationFieldId, type: CONTROL_TYPE_NUMBER, value: String(duration) });
      } else if (endFieldId) {
        var ec = (controlsRef && controlsRef.current || []).find(function(c) { return c.controlId === endFieldId; });
        var endVal = (ec && ec.type === 46) ? end : (currentDate + " " + end.substring(0, 5) + ":00");
        controls.push({ controlId: endFieldId, type: ec ? ec.type : 16, value: endVal });
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
      });
    },
  };
}
