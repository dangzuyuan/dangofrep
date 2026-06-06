// ============================================================
// constants.js — 预约排班视图插件全局常量
// ============================================================

// ---------- 布局尺寸 ----------
export const AXIS_WIDTH = 80;
export const COL_WIDTH = 72;
export const ROW_HEIGHT = 600;
export const MIN_SLOT_HEIGHT = 24;
export const AVAIL_SUBTRACT = 120;
export const STAFF_COL_STRIP_HEIGHT = 6;
export const STAFF_HUE_MULTIPLIER = 36;

// ---------- 时间轴 ----------
export const AXIS_LINE_HEIGHT = 14;
export const AXIS_LINE_GAP = 2;
export const AXIS_PADDING_LEFT = 4;
export const AXIS_PADDING_TOP = 1;

// ---------- 预约条 ----------
export const BAR_LEFT = 2;
export const BAR_WIDTH_SUBTRACT = 4;
export const BAR_BORDER_RADIUS = 4;
export const BAR_FONT_SIZE = 11;
export const DRAG_HANDLE_HEIGHT = 12;
export const DRAG_HANDLE_HEIGHT_MOBILE = 14;

// ---------- 拖拽预览条 ----------
export const PREVIEW_BAR_ID = "drag-preview-bar";
export const PREVIEW_BAR_LEFT = 2;
export const PREVIEW_BAR_WIDTH_SUB = 4;
export const PREVIEW_BAR_Z = 20;
export const PREVIEW_BAR_BORDER_RADIUS = 4;
export const PREVIEW_BAR_OPACITY = 0.7;

// ---------- Z-Index 层级 ----------
export const Z_HEADER_ROW = 10;
export const Z_SPLIT_CORNER = 11;
export const Z_BODY_AXIS_CELL = 5;
export const Z_DEBUG_INFO = 999;
export const Z_LOG_PANEL = 1000;
export const Z_BAR_MAIN = 3;
export const Z_BAR_SUB = 1;
export const Z_GRID_BG = 2;
export const Z_DRAG_HANDLE = 3;
export const Z_DRAG_MOVE_HANDLE = 2;
export const Z_BAR_TITLE = 4;

// ---------- 默认时间 ----------
export const DEFAULT_BEGINTIME = "08:00";
export const DEFAULT_ENDTIME = "23:00";
export const DEFAULT_TIME_INTERVAL = 15;

// ---------- 时长限制 ----------
export const DEFAULT_MIN_DURATION = 15;
export const DEFAULT_MAX_DURATION = 480;
export const DEFAULT_FALLBACK_DURATION = 30;

// ---------- 默认标签 ----------
export const DEFAULT_ROW_HEADER = "人员";
export const DEFAULT_COL_HEADER = "时间";
export const DEFAULT_BOARD_TYPE = "staff";
export const ROOM_BOARD_TYPE = "room";
export const AXIS_LABEL = "人员/时间";
export const EMPTY_LABEL = "暂无数据";
export const DEFAULT_DEPT_NAME = "未分组";

// ---------- 按钮/提示文字 ----------
export const LABEL_PREV_DAY = "< 前一天";
export const LABEL_NEXT_DAY = "后一天 >";
export const LABEL_TODAY = "今天";
export const LABEL_LOADING = "加载中...";
export const LABEL_HIDE_LOG = "隐藏日志";
export const LABEL_SHOW_LOG = "显示日志";
export const LABEL_CLOSE_LOG = "关闭日志";
export const LABEL_DEBUG_LOG = "调试日志";
export const LABEL_NO_LOG = "暂无日志";
export const CONFIRM_DELETE = "确认删除该预约记录？";

// ---------- 事件类型 ----------
export const EVENT_TYPE_MAIN = "main";
export const EVENT_TYPE_SUB = "sub";
export const EVENT_TYPE_OPERATE = "main"; // @deprecated 旧名兼容

// ---------- 拖拽模式 ----------
export const DRAG_MODE_CREATE = "create";
export const DRAG_MODE_TOP = "top";
export const DRAG_MOVE = "move";
export const DRAG_MODE_BOTTOM = "bottom";

// ---------- MD 事件监听 ----------
export const EMITTER_NEW_RECORD = "new-record";
export const EMITTER_DELETE_RECORD = "delete-record";
export const EMITTER_UPDATE_RECORD = "update-record";

// ---------- Data 属性 ----------
export const ATTR_ROWID = "data-rowid";
export const ATTR_TYPE = "data-type";
export const ATTR_STAFF_IDX = "data-staff-idx";
export const ATTR_ACCOUNTID = "data-accountid";

// ---------- 分页 ----------
export const PAGE_SIZE = 1000;
export const PAGE_INDEX = 1;

// ---------- 筛选控件类型 ----------
export const FILTER_DATA_TYPE = 15;
export const FILTER_SPLICE_TYPE = 1;
export const FILTER_FILTER_TYPE = 17;
export const FILTER_DATE_RANGE = 18;
export const FILTER_DATE_RANGE_TYPE = 3;

// ---------- 控件类型 ----------
export const DEFAULT_CONTROL_TYPE = 1;
export const STATIC_VALUE_TYPE = 0;

// 明道云字段类型编号（用于 dragHandler/parseField 写入值组装）
export const CONTROL_TYPE_TEXT = 2;
export const CONTROL_TYPE_NUMBER = 6;
export const CONTROL_TYPE_DATE = 15;
export const CONTROL_TYPE_DATETIME = 16;
export const CONTROL_TYPE_RELATION = 29;
export const CONTROL_TYPE_MEMBER = 26;
export const CONTROL_TYPE_DEPT = 27;
export const CONTROL_TYPE_OPTIONS = 9;
export const CONTROL_TYPE_MULTI_OPTIONS = 10;
export const CONTROL_TYPE_CHECKBOX = 11;

// ---------- 默认颜色 ----------
export const DEFAULT_EVENT_COLOR = "#1890ff";
export const DEFAULT_OPERATE_COLOR = "#2196F3";
export const DEFAULT_PREVIEW_COLOR = "#52c41a";

// ---------- 色板 ----------
export const COLOR_PALETTE = [
  "#1890ff", "#52c41a", "#faad14", "#f5222d",
  "#722ed1", "#13c2c2", "#eb2f96", "#fa8c16",
  "#2f54eb", "#a0d911", "#fa541c", "#1b9a59",
];

// ---------- UI 颜色 Token ----------
export const COLOR_WHITE = "#fff";
export const COLOR_FAFAFA = "#fafafa";
export const COLOR_F5F5F5 = "#f5f5f5";
export const COLOR_DARK_BG = "#1e1e1e";
export const COLOR_DARK_BG2 = "#2d2d2d";
export const COLOR_BORDER = "#e8e8e8";
export const COLOR_BORDER_INPUT = "#d9d9d9";
export const COLOR_BORDER_LIGHT = "#f0f0f0";
export const COLOR_BORDER_DIM = "#333";
export const COLOR_GRID_LINE = "#c8c8c8";
export const COLOR_TEXT_DIM = "#999";
export const COLOR_TEXT = "#333";
export const COLOR_TEXT_MEDIUM = "#666";
export const COLOR_TEXT_LIGHT = "#d4d4d4";
export const COLOR_BLUE = "#1890ff";

// ---------- 导航按钮颜色 ----------
export const BTN_PREV_NEXT_BG = "#e6f4ff";
export const BTN_PREV_NEXT_BORDER = "#91caff";
export const BTN_PREV_NEXT_TEXT = "#1677ff";
export const BTN_TODAY_BG = "#f6ffed";
export const BTN_TODAY_BORDER = "#b7eb8f";
export const BTN_TODAY_TEXT = "#389e0d";

// ---------- 字体 ----------
export const FONT_FAMILY_SYSTEM = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
export const FONT_FAMILY_MONO = '"Consolas", "Courier New", monospace';
export const FONT_SIZE_11 = 11;
export const FONT_SIZE_12 = 12;
export const FONT_SIZE_13 = 13;

// ---------- 杂项 ----------
export const NOT_FOUND = -1;
export const COLOR_SUBSTRING_LENGTH = 7;
export const LOG_SAMPLE_COUNT = 3;
export const DEPT_NAME_MAX_LENGTH = 50;
export const TIME_SUBSTRING_LENGTH = 5;
export const PAD_LENGTH = 2;
export const COL_WIDTH_CHECK_DELAY = 200;

// ---------- 响应式 ----------
export const MOBILE_BREAKPOINT = 768;
export const COL_WIDTH_MOBILE = 56;
export const LONG_PRESS_MS = 600;
export const TOUCH_THRESHOLD_PX = 5;
export const PREVIEW_BAR_MIN_HEIGHT = 20;
export const LONG_PRESS_ACTIVATE_MS = 400;
export const TOUCH_TAP_MS = 300;
export const TOUCH_PRESS_MS = 600;
export const TOUCH_MOVE_THRESHOLD = 10;
export const TOUCH_ZONE_EDGE_RATIO = 0.15;
export const FAB_SIZE = 56;
export const FAB_MARGIN = 16;
export const FAB_Z = 100;

// ---------- 正则 ----------
export const TIME_REGEX = /\d{1,2}:\d{2}/;
export const TIME_EXTRACT_REGEX = /(\d{1,2}:\d{2}(?::\d{2})?)/;
export const DATE_EXTRACT_REGEX = /(\d{4}-\d{1,2}-\d{1,2})/;
export const CHINESE_NAME_REGEX = /^[\u4e00-\u9fa5]{2,4}$/;
export const UUID_REGEX = /^[0-9a-f-]{36}$/;
