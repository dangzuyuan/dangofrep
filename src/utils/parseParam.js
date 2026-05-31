import { config, apis, api } from "mdye";

export function parseParam(raw) {
  if (raw === undefined || raw === null) return null;
  var v = raw;
  if (Array.isArray(v)) v = v[0];
  if (typeof v === "string") {
    var t = v.trim();
    if (t.startsWith("{") || t.startsWith("[")) { try { v = JSON.parse(t); } catch (e) { v = t; } }
  }
  if (v === null || v === undefined) return null;
  if (typeof v !== "string" && typeof v !== "object") return { cid: "", fids: [String(v)] };
  if (typeof v === "string") return { cid: "", fids: [v] };
  if (v.value && v.value.showControls) return { cid: v.value.cid || "", fids: v.value.showControls };
  if (v.controlId) return { cid: "", fids: [v.controlId] };
  var ks = Object.keys(v);
  if (ks.length > 0) { var fv = v[ks[0]]; if (typeof fv === "string") return { cid: "", fids: [fv] }; }
  return null;
}

export async function resolveWorksheet(relCid) {
  var res = await apis.worksheet.getWorksheetInfo({ worksheetId: config.worksheetId, getTemplate: true });
  var controls = res?.template?.controls || res?.data?.template?.controls || [];
  var f = controls.find(function(c) { return c.controlId === relCid; });
  return f?.dataSource || "";
}

export async function getRelationOpenView(relCid) {
  var res = await apis.worksheet.getWorksheetInfo({ worksheetId: config.worksheetId, getTemplate: true });
  var controls = res?.template?.controls || res?.data?.template?.controls || [];
  var f = controls.find(function(c) { return c.controlId === relCid; });
  if (f && f.advancedSetting && f.advancedSetting.openview) return f.advancedSetting.openview;
  return "";
}

export async function getViews(wsId) {
  var r = await apis.worksheet.getWorksheetInfo({ worksheetId: wsId });
  var views = r?.views || r?.data?.views || r?.template?.views || r?.data?.template?.views || [];
  if (views.length === 0) {
    r = await apis.worksheet.getWorksheetInfo({ worksheetId: wsId, getTemplate: true });
    views = r?.views || r?.data?.views || r?.template?.views || r?.data?.template?.views || [];
  }
  if (views.length === 0) {
    try {
      var v3 = await api.call("app", "getWorksheetStructure", { worksheet_id: wsId });
      views = v3?.data?.views || v3?.views || [];
    } catch (e) {}
  }
  return views.map(function(v) { return { viewId: v.viewId || v.id, name: v.name, type: v.type }; });
}

export function paramText(raw) {
  if (raw === undefined || raw === null) return "";
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw)) return raw.length > 0 ? String(raw[0]) : "";
  if (typeof raw === "object") return raw.value || raw.key || raw.name || "";
  return String(raw);
}
