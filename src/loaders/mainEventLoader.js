import { config } from "mdye";
import { parseField, extractFieldText, extractTime, timeToMin, safeColor } from "../utils/parseField";
import { getControls, getFilteredRows, buildDateFilter } from "../utils/mdyeApi";

export async function loadMainEvents(mainDateParam, mainBeginParam, mainEndParam, mainDurParam, mainHeaderParam, mainDisplayParam, mainBgParam, mainFontParam, headerStaffMap, currentDate, logArr) {
  var events = [];
  var mainStaffMapResult = new Map();
  var logs = logArr || [];

  if (!mainDateParam || !mainDateParam.fids[0]) { logs.push("【主事件】日期参数缺失"); return { events: events, mainStaffMap: mainStaffMapResult, logs: logs }; }

  var wsId = config.worksheetId;
  var vId = config.viewId;
  logs.push("【主事件】wsId=" + (wsId || "?").substring(0, 12) + " viewId=" + (vId || "none"));

  var controls = await getControls(wsId);
  var fc = buildDateFilter(mainDateParam.fids[0], currentDate);
  if (config.filters && config.filters.filterControls) {
    fc = fc.concat(config.filters.filterControls);
  }

  var records = await getFilteredRows(wsId, fc, vId);
  logs.push("【主事件】记录数: " + records.length);

  var beginFieldId = mainBeginParam ? mainBeginParam.fids[0] : "";
  var endFieldId = mainEndParam && mainEndParam.fids ? mainEndParam.fids[0] : "";
  var durFieldId = mainDurParam && mainDurParam.fids ? mainDurParam.fids[0] : "";
  var displayFieldId = mainDisplayParam && mainDisplayParam.fids ? mainDisplayParam.fids[0] : "";
  var headerFieldId = mainHeaderParam && mainHeaderParam.fids ? mainHeaderParam.fids[0] : "";
  var bgFieldId = mainBgParam && mainBgParam.fids ? mainBgParam.fids[0] : "";
  var fontFieldId = mainFontParam && mainFontParam.fids ? mainFontParam.fids[0] : "";

  var staffList = [];
  headerStaffMap.forEach(function(v) { staffList.push(v); });

  var mm = 0, mu = 0;
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
    var staffInfo = accountId ? headerStaffMap.get(accountId) : null;

    if (!staffInfo && matchName) {
      for (var si = 0; si < staffList.length; si++) {
        if (staffList[si].name === matchName) { staffInfo = staffList[si]; accountId = staffInfo.accountId; break; }
      }
    }

    if (!staffInfo && accountId) {
      mainStaffMapResult.set(accountId, {
        accountId: accountId, name: matchName || (displayVal ? displayVal.text : ""), departmentId: "", departmentName: "未分组",
      });
      staffList.push({ accountId: accountId, name: matchName || "", departmentId: "", departmentName: "未分组" });
    }

    var bgVal = bgFieldId ? parseField(rec[bgFieldId], controls.find(function(c) { return c.controlId === bgFieldId; })) : null;
    var bgColor = safeColor(bgVal ? bgVal.color : "", bgVal ? bgVal.idx : 0) || "#2196F3";
    var fontVal = fontFieldId ? parseField(rec[fontFieldId], controls.find(function(c) { return c.controlId === fontFieldId; })) : null;
    var fontColor = safeColor(fontVal ? fontVal.color : "", fontVal ? fontVal.idx : 0) || "#fff";

    mm++;
    events.push({
      rowid: rec.rowid || "",
      accountId: accountId,
      start: beginTime,
      dur: durationMin,
      title: displayFieldId ? extractFieldText(rec[displayFieldId], controls.find(function(c) { return c.controlId === displayFieldId; })) : "",
      color: bgColor,
      fc: fontColor,
      type: "main",
    });
  }

  logs.push("【主事件】完成: " + events.length + " (m" + mm + " u" + mu + ")");
  return { events: events, mainStaffMap: mainStaffMapResult, logs: logs, controls: controls };
}
