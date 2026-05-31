import { resolveWorksheet, getRelationOpenView, getViews } from "../utils/parseParam";
import { parseField, extractFieldText, extractTime, timeToMin, safeColor } from "../utils/parseField";
import { getControls, getFilteredRows, buildDateFilter } from "../utils/mdyeApi";

export async function loadSubEvents(subDateParam, subBeginParam, subEndParam, subDurParam, subHeaderParam, subDisplayParam, subBgParam, subFontParam, staffMap, currentDate, logArr) {
  var events = [];
  var logs = logArr || [];

  if (!subDateParam || !subBeginParam) { logs.push("【副事件】参数未配置，跳过"); return { events: events, logs: logs }; }

  var wsId = await resolveWorksheet(subDateParam.cid);
  if (!wsId) { logs.push("【副事件】无法解析目标工作表"); return { events: events, logs: logs }; }
  logs.push("【副事件】工作表 " + wsId.substring(0, 12) + "..");

  var openView = await getRelationOpenView(subDateParam.cid);
  var views = await getViews(wsId);
  var vId = openView || (views.length > 0 ? views[0].viewId : "");
  logs.push("【副事件】openView=" + (openView || "none") + " views=" + views.length + " vid=" + (vId || "none"));

  var controls = await getControls(wsId);
  var fc = buildDateFilter(subDateParam.fids[0], currentDate);
  var records = await getFilteredRows(wsId, fc, vId);
  logs.push("【副事件】记录数: " + records.length);

  var beginFieldId = subBeginParam.fids[0];
  var endFieldId = subEndParam && subEndParam.fids ? subEndParam.fids[0] : "";
  var durFieldId = subDurParam && subDurParam.fids ? subDurParam.fids[0] : "";
  var headerFieldId = subHeaderParam && subHeaderParam.fids ? subHeaderParam.fids[0] : "";
  var displayFieldId = subDisplayParam && subDisplayParam.fids ? subDisplayParam.fids[0] : "";
  var bgFieldId = subBgParam && subBgParam.fids ? subBgParam.fids[0] : "";
  var fontFieldId = subFontParam && subFontParam.fids ? subFontParam.fids[0] : "";

  var staffList = [];
  staffMap.forEach(function(v) { staffList.push(v); });

  var sm = 0, su = 0;
  for (var ri = 0; ri < records.length; ri++) {
    var rec = records[ri];

    var beginTime = extractTime(rec[beginFieldId]);
    if (!beginTime) continue;

    var durationMin = 0;
    if (durFieldId) { var dv = rec[durFieldId]; var dn = dv ? parseFloat(dv) : NaN; if (!isNaN(dn) && dn > 0) durationMin = dn; }
    if (!durationMin && endFieldId) { var t2 = extractTime(rec[endFieldId]); if (t2) durationMin = Math.max(1, timeToMin(t2) - timeToMin(beginTime)); }
    if (durationMin <= 0) continue;

    var displayVal = displayFieldId ? parseField(rec[displayFieldId], controls.find(function(c) { return c.controlId === displayFieldId; })) : null;
    var headerVal = headerFieldId ? parseField(rec[headerFieldId], controls.find(function(c) { return c.controlId === headerFieldId; })) : null;
    var accountId = headerVal ? (headerVal.id || "") : (displayVal ? (displayVal.id || "") : "");
    var matchName = headerVal ? headerVal.text : (displayVal ? displayVal.text : "");
    var staffInfo = accountId ? staffMap.get(accountId) : null;

    if (!staffInfo && matchName) {
      for (var si = 0; si < staffList.length; si++) {
        if (staffList[si].name === matchName) { staffInfo = staffList[si]; accountId = staffInfo.accountId; break; }
      }
    }
    if (!staffInfo) { su++; continue; }

    var bgVal = bgFieldId ? parseField(rec[bgFieldId], controls.find(function(c) { return c.controlId === bgFieldId; })) : null;
    var bgColor = safeColor(bgVal ? bgVal.color : "", bgVal ? bgVal.idx : 0) || "#4CAF50";
    var fontVal = fontFieldId ? parseField(rec[fontFieldId], controls.find(function(c) { return c.controlId === fontFieldId; })) : null;
    var fontColor = safeColor(fontVal ? fontVal.color : "", fontVal ? fontVal.idx : 0) || "#fff";

    sm++;
    events.push({
      rowid: rec.rowid || "",
      accountId: accountId,
      start: beginTime,
      dur: durationMin,
      title: displayFieldId ? extractFieldText(rec[displayFieldId], controls.find(function(c) { return c.controlId === displayFieldId; })) : (staffInfo ? staffInfo.name : ""),
      color: bgColor,
      fc: fontColor,
      type: "sub",
    });
  }

  logs.push("【副事件】完成: " + events.length + " (m" + sm + " u" + su + ")");
  return { events: events, logs: logs };
}
