import { resolveWorksheet, getRelationOpenView, getViews, paramText } from "../utils/parseParam";
import { parseField, filterByFieldText } from "../utils/parseField";
import { getControls, getFilteredRows } from "../utils/mdyeApi";

export async function loadHeaderStaff(headerDisplayParam, headerGroupParam, headerFilterParam, headerConditionValue, logArr) {
  var staffMap = new Map();
  var logs = logArr || [];

  if (!headerDisplayParam || !headerDisplayParam.cid) { logs.push("【表头】headerDisplayParam 为空"); return { staffMap: staffMap, logs: logs }; }

  var wsId = await resolveWorksheet(headerDisplayParam.cid);
  if (!wsId) { logs.push("【表头】无法解析目标工作表"); return { staffMap: staffMap, logs: logs }; }
  logs.push("【表头】工作表 " + wsId.substring(0, 12) + "..");

  var openView = await getRelationOpenView(headerDisplayParam.cid);
  var views = await getViews(wsId);
  var vId = openView || (views.length > 0 ? views[0].viewId : "");
  logs.push("【表头】openView=" + (openView || "none") + " views=" + views.length + " vid=" + (vId || "none") + (vId ? "" : " ⚠"));

  var controls = await getControls(wsId);
  var records = await getFilteredRows(wsId, null, vId);
  logs.push("【表头】记录数: " + records.length);

  // 过滤字段解析（headerFilterField 可能指向不同工作表）
  var filterFieldId = "";
  var filterWsId = "";
  var filterControls = null;
  if (headerFilterParam && headerFilterParam.fids && headerFilterParam.fids[0] && headerConditionValue) {
    filterFieldId = headerFilterParam.fids[0];
    filterWsId = await resolveWorksheet(headerFilterParam.cid);
    filterControls = filterWsId === wsId ? controls : await getControls(filterWsId);
  }

  // 先过滤再提取
  if (filterFieldId && filterControls && headerConditionValue) {
    var filterControl = filterControls.find(function(c) { return c.controlId === filterFieldId; });
    if (filterControl) {
      var b4 = records.length;
      records = filterByFieldText(records, filterFieldId, filterControl, headerConditionValue);
      logs.push("【表头】过滤: " + filterControl.controlName + "=" + headerConditionValue + " " + b4 + "->" + records.length);
    }
  }

  var nameFieldId = headerDisplayParam.fids[0];
  var groupFieldId = headerGroupParam && headerGroupParam.fids ? headerGroupParam.fids[0] : "";

  for (var ri = 0; ri < records.length; ri++) {
    var rec = records[ri];
    var nameVal = parseField(rec[nameFieldId], controls.find(function(c) { return c.controlId === nameFieldId; }));
    var groupVal = groupFieldId ? parseField(rec[groupFieldId], controls.find(function(c) { return c.controlId === groupFieldId; })) : { text: "未分组", id: "" };

    var accountId = nameVal.id || nameVal.text;
    var name = nameVal.text;
    var departmentName = groupVal.text || "未分组";
    var departmentId = groupVal.id || departmentName;

    if (accountId && !staffMap.has(accountId)) {
      // 按名称去重（同部门同姓名只保留一条）
      var dup = false;
      if (name && departmentName) {
        staffMap.forEach(function(v) {
          if (v.name === name && v.departmentName === departmentName) dup = true;
        });
      }
      if (!dup) {
        staffMap.set(accountId, { accountId: accountId, rowid: rec.rowid || "", name: name, departmentId: departmentId, departmentName: departmentName });
      }
    }
  }

  // 保留视图返回的记录顺序（首见部门排在前面，即工作表视图中排序靠前的部门显示在最左边）
  var finalMap = staffMap;

  logs.push("【表头】完成: " + finalMap.size + " 人");
  return { staffMap: finalMap, logs: logs };
}
