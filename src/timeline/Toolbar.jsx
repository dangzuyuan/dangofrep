import React, { useCallback } from "react";
import styled from "styled-components";
import {
  COLOR_FAFAFA, COLOR_BORDER, COLOR_BORDER_INPUT, COLOR_WHITE,
  COLOR_TEXT_DIM, COLOR_TEXT, COLOR_BLUE,
  BTN_PREV_NEXT_BG, BTN_PREV_NEXT_BORDER, BTN_PREV_NEXT_TEXT,
  BTN_TODAY_BG, BTN_TODAY_BORDER, BTN_TODAY_TEXT,
  FONT_SIZE_11, FONT_SIZE_12, FONT_SIZE_13,
  LABEL_TODAY, LABEL_LOADING,
} from "./constants";

const ToolbarWrap = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: ${COLOR_FAFAFA};
  border-bottom: 1px solid ${COLOR_BORDER};
  gap: 8px;
  flex-shrink: 0;
`;

const ToolbarWrapMobile = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background: ${COLOR_FAFAFA};
  border-bottom: 1px solid ${COLOR_BORDER};
  gap: 4px;
  flex-shrink: 0;
`;

const DateInput = styled.input`
  padding: 4px 8px;
  font-size: 13px;
  border: 1px solid ${COLOR_BORDER_INPUT};
  border-radius: 4px;
`;

const DateInputMobile = styled.input`
  padding: 2px 2px;
  font-size: 11px;
  border: 1px solid ${COLOR_BORDER_INPUT};
  border-radius: 4px;
  max-width: 105px;
`;

const LoadingText = styled.span`
  font-size: ${FONT_SIZE_11}px;
  color: ${COLOR_TEXT_DIM};
`;

const NavBtn = styled.button`
  padding: 4px 10px;
  font-size: ${FONT_SIZE_13}px;
  cursor: pointer;
  border: 1px solid ${COLOR_BORDER_INPUT};
  border-radius: 4px;
  background: ${COLOR_WHITE};
  color: ${COLOR_TEXT};
  &:hover { border-color: ${COLOR_BLUE}; color: ${COLOR_BLUE}; }
`;

const NavBtnMobile = styled.button`
  padding: 2px 8px;
  font-size: ${FONT_SIZE_13}px;
  cursor: pointer;
  border: 1px solid ${COLOR_BORDER_INPUT};
  border-radius: 4px;
  background: ${COLOR_WHITE};
  color: ${COLOR_TEXT};
`;

const StatsText = styled.span`
  font-size: ${FONT_SIZE_11}px;
  color: ${COLOR_TEXT_DIM};
  white-space: nowrap;
`;

function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function Toolbar({
  currentDate,
  onDateChange,
  loading,
  allStaffCount,
  bookingCount,
  showDebug,
  onToggleDebug,
  isMobile,
  staffLabel,
  bookingLabel,
  onRefresh,
  // 测试功能
  onOpenTestModal,
  // 日志窗口
  onToggleLog,
}) {
  const goPrevDay = useCallback(() => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    onDateChange(formatDate(d));
  }, [currentDate, onDateChange]);

  const goNextDay = useCallback(() => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    onDateChange(formatDate(d));
  }, [currentDate, onDateChange]);

  const goToday = useCallback(() => {
    onDateChange(formatDate(new Date()));
  }, [onDateChange]);

  // ── 手机端压缩布局 ──
  if (isMobile) {
    return (
      <ToolbarWrapMobile>
        <NavBtnMobile
          style={{ background: BTN_PREV_NEXT_BG, borderColor: BTN_PREV_NEXT_BORDER, color: BTN_PREV_NEXT_TEXT }}
          onClick={goPrevDay}
        >
          ‹
        </NavBtnMobile>
        <DateInputMobile type="date" value={currentDate} onChange={(e) => onDateChange(e.target.value)} />
        <NavBtnMobile
          style={{ background: BTN_PREV_NEXT_BG, borderColor: BTN_PREV_NEXT_BORDER, color: BTN_PREV_NEXT_TEXT }}
          onClick={goNextDay}
        >
          ›
        </NavBtnMobile>
        <NavBtnMobile
          style={{ background: BTN_TODAY_BG, borderColor: BTN_TODAY_BORDER, color: BTN_TODAY_TEXT, fontSize: 11, padding: "2px 6px" }}
          onClick={goToday}
        >
          📅
        </NavBtnMobile>
        {loading && <LoadingText>{LABEL_LOADING}</LoadingText>}
        <NavBtnMobile
          style={{ marginLeft: "auto", fontSize: 14, padding: "2px 6px", background: COLOR_WHITE, border: "1px solid " + COLOR_BORDER_INPUT, borderRadius: 4 }}
          onClick={onRefresh}
        >
          🔄
        </NavBtnMobile>
        <StatsText>
           👥{allStaffCount} 📋{bookingCount}
        </StatsText>
        {/* 测试数据录入 */}
        <NavBtnMobile
          style={{ fontSize: 14, padding: "2px 6px", background: COLOR_WHITE, borderColor: "#ffd591" }}
          onClick={onOpenTestModal}
        >
          
        </NavBtnMobile>
        {/* 调试日志 */}
        <NavBtnMobile
          style={{ fontSize: 14, padding: "2px 6px", background: COLOR_WHITE, borderColor: "#40a9ff" }}
          onClick={onToggleLog}
        >
          ❓
        </NavBtnMobile>
      </ToolbarWrapMobile>
    );
  }

  // ── 桌面端完整布局 ──
  return (
    <ToolbarWrap>
      <NavBtn style={{ background: BTN_PREV_NEXT_BG, borderColor: BTN_PREV_NEXT_BORDER, color: BTN_PREV_NEXT_TEXT }} onClick={goPrevDay}>
        ‹ 前一天
      </NavBtn>
      <DateInput type="date" value={currentDate} onChange={(e) => onDateChange(e.target.value)} />
      <NavBtn style={{ background: BTN_PREV_NEXT_BG, borderColor: BTN_PREV_NEXT_BORDER, color: BTN_PREV_NEXT_TEXT }} onClick={goNextDay}>
        后一天 ›
      </NavBtn>
      <NavBtn style={{ background: BTN_TODAY_BG, borderColor: BTN_TODAY_BORDER, color: BTN_TODAY_TEXT }} onClick={goToday}>
        {LABEL_TODAY}
      </NavBtn>
      {loading && <LoadingText>{LABEL_LOADING}</LoadingText>}
      <StatsText>
         {staffLabel || "人员"}: {allStaffCount} | {bookingLabel || "预约"}: {bookingCount}
      </StatsText>
      
      {/* 测试数据录入按钮 */}
      <button
        style={{ 
          marginLeft: "auto", 
          fontSize: FONT_SIZE_11, 
          padding: "2px 8px", 
          cursor: "pointer",
          background: COLOR_WHITE,
          borderColor: "#ffd591",
          border: "1px solid #d9d9d9",
          borderRadius: 4
        }}
        onClick={onOpenTestModal}
      >
        🧪 测试
      </button>
      
      {/* 调试日志按钮 */}
      <button
        style={{ 
          marginLeft: "8px",
          fontSize: FONT_SIZE_13,
          fontWeight: "bold",
          padding: "4px 10px", 
          cursor: "pointer",
          background: COLOR_WHITE,
          borderColor: "#40a9ff",
          border: "1px solid #1890ff",
          borderRadius: 4,
          color: "#1890ff"
        }}
        onClick={onToggleLog}
        title="打开/关闭调试日志"
      >
        ❓
      </button>
      
      {/* 旧的调试日志切换（可选） */}
      {onToggleDebug && (
        <button
          style={{ marginLeft: "8px", fontSize: FONT_SIZE_11, padding: "2px 8px", cursor: "pointer" }}
          onClick={onToggleDebug}
        >
          {showDebug ? "隐藏日志" : "显示日志"}
        </button>
      )}
    </ToolbarWrap>
  );
}
