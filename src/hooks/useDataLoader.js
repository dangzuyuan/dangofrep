import { useState, useEffect, useRef } from "react";
import { env } from "mdye";
import { parseParam, paramText } from "../utils/parseParam";
import { loadHeaderStaff } from "../loaders/headerLoader";
import { loadSubEvents } from "../loaders/subEventLoader";
import { loadMainEvents } from "../loaders/mainEventLoader";

export default function useDataLoader(currentDate, refreshKey) {
  var _s = useState(new Map()), _e = useState([]), _l = useState(false), _g = useState([]);
  var staffMap = _s[0], setStaffMap = _s[1], events = _e[0], setEvents = _e[1];
  var loading = _l[0], setLoading = _l[1], logs = _g[0], setLogs = _g[1];
  var isSilentReload = useRef(false);
  var controlsRef = useRef([]);
  var loadingRef = useRef({ header: false, main: false, sub: false });

  useEffect(function() {
    if (!currentDate) return;
    var cancelled = false;
    var collected = [];
    var addLog = function(msg) { collected.push(msg); console.log(msg); };

    var loadData = async function() {
      if (!isSilentReload.current) setLoading(true);
      isSilentReload.current = false;

      var envParams = env || {};
      addLog("【开始加载】date=" + currentDate);

      var headerDisplayParam = parseParam(envParams.headerDisplayField);
      var headerGroupParam = parseParam(envParams.headerGroupField);
      var headerFilterParam = parseParam(envParams.headerFilterField);
      var headerConditionValue = paramText(envParams.Headerconditonvalue);

      var subDateParam = parseParam(envParams.subEventDateField);
      var subBeginParam = parseParam(envParams.subEventBeginTime);
      var subEndParam = parseParam(envParams.subEventEndTime);
      var subDurParam = parseParam(envParams.subEventTimeInterval);
      var subDisplayParam = parseParam(envParams.subEventDisplayContent);
      var subBgParam = parseParam(envParams.subEventBgColor);
      var subHeaderParam = parseParam(envParams.subEventHeaderField);
      var subFontParam = parseParam(envParams.subEventFontColor);

      var mainDateParam = parseParam(envParams.mainEventDateField);
      var mainBeginParam = parseParam(envParams.mainEventBeginTime);
      var mainEndParam = parseParam(envParams.mainEventEndTime);
      var mainDurParam = parseParam(envParams.mainEventDuration);
      var mainHeaderParam = parseParam(envParams.mainEventHeaderField);
      var mainDisplayParam = parseParam(envParams.mainEventDisplayContent);
      var mainBgParam = parseParam(envParams.mainEventBgColor);
      var mainFontParam = parseParam(envParams.mainEventFontColor);

      var hasSubEvents = !!(subDateParam && subBeginParam);

      var loadChain = async function(name, fn) {
        if (loadingRef.current[name]) return;
        loadingRef.current[name] = true;
        try { await fn(); }
        catch (e) { addLog("[" + name + "] fail: " + (e.message || e)); }
        finally { loadingRef.current[name] = false; }
      };

      var headerStaffMap = new Map();
      var subEvents = [];
      var mainEvents = [];
      var mainStaffMap = new Map();

      await loadChain("header", async function() {
        if (headerDisplayParam) {
          var result = await loadHeaderStaff(headerDisplayParam, headerGroupParam, headerFilterParam, headerConditionValue, collected);
          headerStaffMap = result.staffMap;
          addLog("【表头】员工=" + headerStaffMap.size);
        } else {
          addLog("【表头】headerDisplayField 未配置，跳过");
        }
      });

      await loadChain("sub", async function() {
        if (hasSubEvents) {
          var result = await loadSubEvents(subDateParam, subBeginParam, subEndParam, subDurParam, subHeaderParam, subDisplayParam, subBgParam, subFontParam, headerStaffMap, currentDate, collected);
          subEvents = result.events;
          addLog("【附属】事件=" + subEvents.length);
        } else {
          addLog("【附属】参数未配置，跳过");
        }
      });

      await loadChain("main", async function() {
        if (mainDateParam) {
          var result = await loadMainEvents(mainDateParam, mainBeginParam, mainEndParam, mainDurParam, mainHeaderParam, mainDisplayParam, mainBgParam, mainFontParam, headerStaffMap, currentDate, collected);
          mainEvents = result.events;
          mainStaffMap = result.mainStaffMap;
          controlsRef.current = result.controls;
          addLog("【主事件】事件=" + mainEvents.length + " 新增员工=" + mainStaffMap.size);
        } else {
          addLog("【主事件】mainEventDateField 未配置，跳过");
        }
      });

      if (cancelled) return;

      var finalStaffMap = new Map([].concat(
        Array.from(headerStaffMap.entries()),
        Array.from(mainStaffMap.entries())
      ));
      var finalEvents = [].concat(mainEvents, subEvents);

      setStaffMap(finalStaffMap);
      setEvents(finalEvents);
      addLog("【完成】员工=" + finalStaffMap.size + " 事件=" + finalEvents.length);
      setLoading(false);
      setLogs(function(p) { return p.concat(collected); });
    };

    loadData();
    return function() { cancelled = true; };
  }, [currentDate, refreshKey]);

  return { staffMap: staffMap, events: events, loading: loading, logs: logs, setLogs: setLogs, controlsRef: controlsRef, isSilentReload: isSilentReload };
}
