import React, { useState, useEffect, useCallback, useMemo } from "react";
import { env, api, apis, utils, config } from "mdye";
import styled from "styled-components";
import TimeCalendar from "./timeline/TimeCalendar";
import Toolbar from "./components/Toolbar";
import DebugPanel from "./components/DebugPanel";
import useDataLoader from "./hooks/useDataLoader";
import useAutoRefresh from "./hooks/useAutoRefresh";
import { adaptTableViewData } from "./utils/adapters";
import { parseParam } from "./utils/parseParam";
import { createDragHandler } from "./utils/dragHandler";
import {
  DEFAULT_BEGINTIME,
  DEFAULT_ENDTIME,
  DEFAULT_TIME_INTERVAL,
  DEFAULT_ROW_HEADER,
  DEFAULT_COL_HEADER,
  COL_WIDTH,
  COL_WIDTH_MOBILE,
  AXIS_WIDTH,
  MOBILE_BREAKPOINT,
  COLOR_WHITE,
  FONT_FAMILY_SYSTEM,
} from "./utils/constants";

const AppWrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${COLOR_WHITE};
  font-family: ${FONT_FAMILY_SYSTEM};
`;

// Error Boundary — 防止子组件崩溃导致整个插件白屏
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }
  render() {
    if (this.state.hasError) {
      return React.createElement('div', {
        style: {
          padding: '40px',
          textAlign: 'center',
          fontFamily: FONT_FAMILY_SYSTEM,
          color: '#333',
        }
      },
        React.createElement('div', { style: { fontSize: '32px', marginBottom: '16px' } }, '⚠️'),
        React.createElement('div', { style: { fontSize: '16px', marginBottom: '8px' } }, '插件加载失败'),
        React.createElement('div', { style: { fontSize: '12px', color: '#999' } },
          this.state.error && this.state.error.message ? this.state.error.message : '未知错误'
        )
      );
    }
    return this.props.children;
  }
}

export default function App() {
  var envParams = env || {};

  var begintime = envParams.beginTime || DEFAULT_BEGINTIME;
  var endtime = envParams.endTime || DEFAULT_ENDTIME;
  var timejiange = Number(envParams.timeInterval) || DEFAULT_TIME_INTERVAL;
  var rowHeader = envParams.rowHeader || DEFAULT_ROW_HEADER;
  var columnHeader = envParams.columnHeader || DEFAULT_COL_HEADER;

  var timeFormat = "single";
  if (envParams.showstyle) {
    try {
      var sv = envParams.showstyle;
      var p = typeof sv === "string" && sv.startsWith("[") ? JSON.parse(sv)[0] : sv;
      if (String(p).indexOf("区间") >= 0) timeFormat = "range";
    } catch (e) {}
  }

  var forceMobile = envParams.forceMobile === "true" || envParams.forceMobile === "1";

  var [currentDate, setCurrentDate] = useState(function() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  });
  var [showDebug, setShowDebug] = useState(false);
  var [refreshKey, setRefreshKey] = useState(0);

  var [isMobile, setIsMobile] = useState(function() {
    return forceMobile || window.innerWidth < MOBILE_BREAKPOINT;
  });

  useEffect(function() {
    if (forceMobile) return;
    var check = function() {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    window.addEventListener("resize", check);
    return function() { window.removeEventListener("resize", check); };
  }, [forceMobile]);

  var colWidth = Number(envParams.colWidth) || (isMobile ? COL_WIDTH_MOBILE : COL_WIDTH);
  var axisWidth = Number(envParams.axisWidth) || (isMobile ? 60 : AXIS_WIDTH);
  var slotHeight = Number(envParams.slotHeight) || (isMobile
    ? Math.max(24, (window.innerHeight * 0.6) / Math.ceil(((Number(endtime.split(":")[0]) * 60 + Number(endtime.split(":")[1])) - (Number(begintime.split(":")[0]) * 60 + Number(begintime.split(":")[1]))) / timejiange))
    : 30);

  var { staffMap, events, loading, logs, isSilentReload, controlsRef } =
    useDataLoader(currentDate, refreshKey);

  useAutoRefresh(isSilentReload, setRefreshKey);

  var tableViewData = useMemo(function() {
    return adaptTableViewData(staffMap, events);
  }, [staffMap, events]);

  var allStaffCount = useMemo(function() {
    var count = 0;
    tableViewData.departmentTree.forEach(function(d) { count += d.children.length; });
    return count;
  }, [tableViewData.departmentTree]);

  var handleRefresh = useCallback(function() {
    isSilentReload.current = true;
    setRefreshKey(function(k) { return k + 1; });
  }, []);

  useEffect(function() {
    window.__openRecord = function(rowid) {
      utils.openRecordInfo({ appId: config.appId, worksheetId: config.worksheetId, viewId: config.viewId, recordId: rowid });
    };
    return function() { delete window.__openRecord; };
  }, []);

  var mainDateParam = parseParam(envParams.mainEventDateField);
  var mainBeginParam = parseParam(envParams.mainEventBeginTime);
  var mainEndParam = parseParam(envParams.mainEventEndTime);
  var mainDurParam = parseParam(envParams.mainEventDuration);
  var mainHeaderParam = parseParam(envParams.mainEventHeaderField);
  var mainDisplayParam = parseParam(envParams.mainEventDisplayContent);
  var mainBgParam = parseParam(envParams.mainEventBgColor);

  var effOperatorFieldId = mainHeaderParam ? mainHeaderParam.fids[0] : (mainDisplayParam ? mainDisplayParam.fids[0] : "");
  var effBeginFieldId = mainBeginParam ? mainBeginParam.fids[0] : "";
  var effEndFieldId = mainEndParam ? mainEndParam.fids[0] : "";
  var effDurationFieldId = mainDurParam ? mainDurParam.fids[0] : "";
  var normDateFieldId = mainDateParam ? mainDateParam.fids[0] : "";
  var normStatusFieldId = mainBgParam ? mainBgParam.fids[0] : "";

  var dragHandlers = useMemo(function() {
    var idMap = {};
    tableViewData.resources.forEach(function(r) { idMap[r.accountId] = r.rowid || r.accountId; });
    return createDragHandler({
      api: api,
      apis: apis,
      utils: utils,
      config: config,
      operatorFieldId: effOperatorFieldId,
      beginFieldId: effBeginFieldId,
      endFieldId: effEndFieldId,
      durationFieldId: effDurationFieldId,
      dateFieldId: normDateFieldId,
      statusFieldId: normStatusFieldId,
      events: events,
      onSaved: handleRefresh,
      controlsRef: controlsRef,
      staffIdMap: idMap,
      currentDate: currentDate,
    });
  }, [effOperatorFieldId, effBeginFieldId, effDurationFieldId, normDateFieldId, normStatusFieldId, events, handleRefresh]);

  return (
    <ErrorBoundary>
    <AppWrap>
      <Toolbar
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        loading={loading}
        allStaffCount={allStaffCount}
        bookingCount={tableViewData.events.filter(function(ev) { return ev.isBackground !== true; }).length}
        showDebug={showDebug}
        onToggleDebug={function() { setShowDebug(!showDebug); }}
        isMobile={isMobile}
        staffLabel={columnHeader}
        bookingLabel={columnHeader}
        onRefresh={handleRefresh}
      />
      <TimeCalendar
        resources={tableViewData.resources}
        events={tableViewData.events}
        departmentTree={tableViewData.departmentTree}
        begintime={begintime}
        endtime={endtime}
        timejiange={timejiange}
        slotHeight={slotHeight}
        colWidth={colWidth}
        axisWidth={axisWidth}
        columnHeader={columnHeader}
        rowHeader={rowHeader}
        timeFormat={timeFormat}
        onEventClick={dragHandlers.onEventClick}
        onEventDrop={dragHandlers.onEventDrop}
        onEventResize={dragHandlers.onEventResize}
        onSelectSlot={dragHandlers.onSelectSlot}
      />
      {showDebug && <DebugPanel logs={logs} />}
    </AppWrap>
    </ErrorBoundary>
  );
}
