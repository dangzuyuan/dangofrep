import React from "react";
import styled from "styled-components";
import {
  COLOR_DARK_BG, COLOR_TEXT_LIGHT,
  FONT_FAMILY_MONO, FONT_SIZE_11, Z_DEBUG_INFO,
} from "../utils/constants";

const DebugInfo = styled.pre`
  position: fixed;
  bottom: 40px;
  right: 10px;
  z-index: ${Z_DEBUG_INFO};
  max-width: 500px;
  max-height: 300px;
  overflow: auto;
  background: ${COLOR_DARK_BG};
  color: ${COLOR_TEXT_LIGHT};
  font-size: ${FONT_SIZE_11}px;
  padding: 10px;
  border-radius: 6px;
  font-family: ${FONT_FAMILY_MONO};
  white-space: pre-wrap;
  word-break: break-all;
`;

export default function DebugPanel({ logs }) {
  return <DebugInfo>{logs.join("\n")}</DebugInfo>;
}
