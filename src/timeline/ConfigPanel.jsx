import React, { useState } from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 320px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 1000;
  overflow: hidden;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #e8e8e8;
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  
  &:hover {
    background: #e8e8e8;
    color: #666;
  }
`;

const PanelBody = styled.div`
  padding: 16px;
  max-height: 70vh;
  overflow-y: auto;
`;

const FormField = styled.div`
  margin-bottom: 12px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  color: #666;
  font-weight: 600;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
  
  &:focus {
    outline: none;
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
  
  &:focus {
    outline: none;
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
  }
`;

const ApplyButton = styled.button`
  width: 100%;
  padding: 8px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 8px;
  
  &:hover {
    background: #40a9ff;
  }
  
  &:active {
    background: #096dd9;
  }
`;

const ToggleButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 8px 16px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  
  &:hover {
    background: #40a9ff;
  }
`;

export default function ConfigPanel({ config, onConfigChange }) {
  const [visible, setVisible] = useState(false);
  const [tempConfig, setTempConfig] = useState(config);

  const handleInputChange = (key, value) => {
    setTempConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = () => {
    onConfigChange(tempConfig);
    setVisible(false);
  };

  return (
    <>
      {!visible && (
        <ToggleButton onClick={() => setVisible(true)}>
          ⚙️ 参数设置
        </ToggleButton>
      )}
      
      {visible && (
        <PanelContainer>
          <PanelHeader>
            <PanelTitle>时间视图参数设置</PanelTitle>
            <CloseButton onClick={() => setVisible(false)}>×</CloseButton>
          </PanelHeader>
          <PanelBody>
            <FormField>
              <FormLabel>起始时间</FormLabel>
              <FormInput
                type="text"
                value={tempConfig.begintime}
                onChange={(e) => handleInputChange('begintime', e.target.value)}
                placeholder="例如: 07:00"
              />
            </FormField>
            
            <FormField>
              <FormLabel>结束时间</FormLabel>
              <FormInput
                type="text"
                value={tempConfig.endtime}
                onChange={(e) => handleInputChange('endtime', e.target.value)}
                placeholder="例如: 23:00"
              />
            </FormField>
            
            <FormField>
              <FormLabel>时间步长（分钟）</FormLabel>
              <FormSelect
                value={tempConfig.timejiange}
                onChange={(e) => handleInputChange('timejiange', Number(e.target.value))}
              >
                <option value={15}>15 分钟</option>
                <option value={30}>30 分钟</option>
                <option value={60}>60 分钟</option>
              </FormSelect>
            </FormField>
            
            <FormField>
              <FormLabel>网格行高（px）</FormLabel>
              <FormInput
                type="number"
                value={tempConfig.rowHeight}
                onChange={(e) => handleInputChange('rowHeight', Number(e.target.value))}
                placeholder="例如: 600"
              />
            </FormField>
            
            <FormField>
              <FormLabel>列宽（px）</FormLabel>
              <FormInput
                type="number"
                value={tempConfig.colWidth}
                onChange={(e) => handleInputChange('colWidth', Number(e.target.value))}
                placeholder="例如: 72"
              />
            </FormField>
            
            <FormField>
              <FormLabel>时间轴宽度（px）</FormLabel>
              <FormInput
                type="number"
                value={tempConfig.axisWidth}
                onChange={(e) => handleInputChange('axisWidth', Number(e.target.value))}
                placeholder="例如: 80"
              />
            </FormField>
            
            <FormField>
              <FormLabel>表头 - 列标题</FormLabel>
              <FormInput
                type="text"
                value={tempConfig.columnHeader}
                onChange={(e) => handleInputChange('columnHeader', e.target.value)}
                placeholder="例如: 时间"
              />
            </FormField>
            
            <FormField>
              <FormLabel>表头 - 行标题</FormLabel>
              <FormInput
                type="text"
                value={tempConfig.rowHeader}
                onChange={(e) => handleInputChange('rowHeader', e.target.value)}
                placeholder="例如: 人员"
              />
            </FormField>
            
            <ApplyButton onClick={handleApply}>
              应用设置
            </ApplyButton>
          </PanelBody>
        </PanelContainer>
      )}
    </>
  );
}
