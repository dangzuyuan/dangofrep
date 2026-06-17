import React from "react";
import styled from "styled-components";

const HeaderRow = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
  width: ${(p) => p.$totalWidth}px;       /* 显式像素宽度，与 BodyRow 保持一致 */
  min-width: 100%;
`;

const SplitCorner = styled.div`
  width: ${(props) => props.axisWidth}px;
  min-width: ${(props) => props.axisWidth}px;
  position: sticky;
  left: 0;
  z-index: 11;
  background: #fafafa;
  display: grid;
  grid-template-rows: 1fr 1fr;
  border-right: 1px solid #e8e8e8;
  &::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(to bottom left, transparent calc(50% - 0.5px), #c8c8c8 50%, transparent calc(50% + 0.5px));
    pointer-events: none;
  }
`;

const CornerTop = styled.span`
  text-align: right;
  align-self: start;
  padding: 2px 4px;
  font-size: 12px;
  color: #666;
`;

const CornerBottom = styled.span`
  text-align: left;
  align-self: end;
  padding: 2px 4px;
  font-size: 12px;
  color: #666;
`;

const HeaderGroups = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const DeptRow = styled.div`
  display: flex;
  background: #f5f5f5;
  border-bottom: 1px solid #e8e8e8;
  overflow: hidden;
  flex-shrink: 0;
`;

const DeptCell = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #333;
  padding: 4px 2px;
  border-right: 1px solid #e8e8e8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const StaffRow = styled.div`
  display: flex;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  overflow: hidden;
  flex-shrink: 0;
`;

const StaffCell = styled.div`
  text-align: center;
  font-size: 12px;
  color: #333;
  padding: 4px 2px;
  border-right: 1px solid #e8e8e8;
  word-break: break-all;
  overflow: hidden;
  flex-shrink: 0;
  box-sizing: border-box;
`;

export default function TableHeader({
  departmentTree = [],
  columnHeader = "时间",
  rowHeader = "人员",
  columnsWidth = 0,
  colWidth = 72,
  axisWidth = 80,
  totalWidth = 0
}) {
  if (!departmentTree || departmentTree.length === 0) {
    return (
      <HeaderRow $totalWidth={totalWidth}>
        <SplitCorner axisWidth={axisWidth}>
          <CornerTop>{columnHeader}</CornerTop>
          <CornerBottom>{rowHeader}</CornerBottom>
        </SplitCorner>
        <HeaderGroups style={{ width: columnsWidth, minWidth: columnsWidth }}>
          <DeptRow style={{ width: columnsWidth, minWidth: columnsWidth }}>
            <DeptCell style={{ width: columnsWidth, minWidth: columnsWidth, maxWidth: columnsWidth }}>
              暂无数据
            </DeptCell>
          </DeptRow>
        </HeaderGroups>
      </HeaderRow>
    );
  }

  return (
    <HeaderRow $totalWidth={totalWidth}>
      <SplitCorner axisWidth={axisWidth}>
        <CornerTop>{columnHeader}</CornerTop>
        <CornerBottom>{rowHeader}</CornerBottom>
      </SplitCorner>
      <HeaderGroups style={{ width: columnsWidth, minWidth: columnsWidth }}>
        <DeptRow style={{ width: columnsWidth, minWidth: columnsWidth }}>
          {departmentTree.map((dept) => {
            const dw = dept.children.length * colWidth;
            return (
              <DeptCell
                key={dept.id}
                style={{
                  width: dw,
                  minWidth: dw,
                  maxWidth: dw,
                }}
              >
                {dept.name}
              </DeptCell>
            );
          })}
        </DeptRow>
        <StaffRow style={{ width: columnsWidth, minWidth: columnsWidth }}>
          {departmentTree.map((dept) =>
            dept.children.map((s) => (
              <StaffCell
                key={s.accountId}
                title={s.name}
                style={{
                  width: colWidth,
                  minWidth: colWidth,
                  maxWidth: colWidth,
                }}
              >
                {s.name}
              </StaffCell>
            ))
          )}
        </StaffRow>
      </HeaderGroups>
    </HeaderRow>
  );
}
