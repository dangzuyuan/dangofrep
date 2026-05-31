import { config, apis } from "mdye";

export async function getControls(wsId) {
  var r = await apis.worksheet.getWorksheetInfo({ worksheetId: wsId, getTemplate: true });
  return r?.template?.controls || r?.data?.template?.controls || [];
}

export async function getFilteredRows(wsId, fc, viewId) {
  var params = { worksheetId: wsId, pageSize: 1000, pageIndex: 1, notGetTotal: true, filterControls: fc || [], appId: config.appId };
  if (viewId) params.viewId = viewId;
  var r = await apis.worksheet.getFilterRows(params);
  return r?.data || [];
}

export function buildDateFilter(ctrlId, date) {
  return [{ controlId: ctrlId, dataType: 15, spliceType: 1, filterType: 17, dateRange: 18, dateRangeType: 3, value: date, values: [], isDynamicsource: false, dynamicSource: [] }];
}
