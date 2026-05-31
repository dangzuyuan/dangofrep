export function adaptResources(staffMap) {
  var resources = [];
  staffMap.forEach(function(s) {
    resources.push({
      id: s.accountId,
      rowid: s.rowid || "",
      accountId: s.accountId,
      name: s.name,
      departmentId: s.departmentId || "",
      departmentName: s.departmentName || "",
    });
  });
  return resources;
}

export function adaptEvents(rawEvents) {
  if (!Array.isArray(rawEvents)) return [];

  return rawEvents
    .filter(function(ev) { return ev && ev.start; })
    .map(function(ev) {
      var startTime = ev.start;
      if (startTime && startTime.length === 5) startTime = startTime + ":00";

      var endTime = "";
      if (ev.dur !== undefined && ev.dur !== null && startTime) {
        var parts = startTime.split(":").map(Number);
        var endMin = parts[0] * 60 + parts[1] + Number(ev.dur);
        var eh = Math.floor(endMin / 60);
        var em = endMin % 60;
        endTime = String(eh).padStart(2, "0") + ":" + String(em).padStart(2, "0") + ":00";
      }

      return {
        id: ev.rowid || ev.id || "",
        resourceId: ev.accountId || ev.resourceId || "",
        startTime: startTime || "00:00:00",
        endTime: endTime || startTime || "00:30:00",
        title: ev.title || ev.name || "",
        color: ev.color || ev.bgColor || "#1890ff",
        fontColor: ev.fc || "#fff",
        isBackground: ev.type === "sub",
        _rowid: ev.rowid,
        _type: ev.type,
      };
    });
}

export function buildDepartmentTree(resources) {
  var tree = [];
  var deptMap = {};

  resources.forEach(function(s) {
    var did = s.departmentId || "unknown";
    var dname = s.departmentName || (did === "unknown" ? "未分组" : did);

    if (!deptMap[did]) {
      deptMap[did] = { id: did, name: dname, children: [] };
      tree.push(deptMap[did]);
    }
    deptMap[did].children.push(s);
  });

  tree.sort(function(a, b) { return a.name.localeCompare(b.name, "zh"); });
  tree.forEach(function(dept) {
    dept.children.sort(function(a, b) { return a.accountId.localeCompare(b.accountId); });
  });

  return tree;
}

export function adaptTableViewData(staffMap, rawEvents) {
  var resources = adaptResources(staffMap);
  var events = adaptEvents(rawEvents);
  var departmentTree = buildDepartmentTree(resources);
  return { resources: resources, events: events, departmentTree: departmentTree };
}
