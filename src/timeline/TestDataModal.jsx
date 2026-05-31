import React, { useState } from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  width: 95%;
  max-width: 1200px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
  background: #fafafa;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  &:hover { background: #e8e8e8; color: #666; }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #333;
  font-weight: 600;
  border-left: 3px solid #1890ff;
  padding-left: 8px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const FormField = styled.div`
  flex: ${(props) => props.flex || 1};
  min-width: 120px;
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 6px 10px;
  font-size: 13px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #1890ff; }
`;

const Select = styled.select`
  width: 100%;
  padding: 6px 10px;
  font-size: 13px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-sizing: border-box;
  background: #fff;
  &:focus { outline: none; border-color: #1890ff; }
`;

// 表格样式
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`;

const Th = styled.th`
  padding: 8px 12px;
  text-align: left;
  background: #fafafa;
  border-bottom: 2px solid #e8e8e8;
  font-weight: 600;
  color: #333;
`;

const Td = styled.td`
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
`;

const TableRow = styled.tr`
  &:hover { background: #fafafa; }
`;

const ActionButton = styled.button`
  padding: 4px 12px;
  font-size: 12px;
  border: 1px solid ${(props) => props.borderColor || "#d9d9d9"};
  border-radius: 4px;
  background: ${(props) => props.bgColor || "#fff"};
  color: ${(props) => props.color || "#333"};
  cursor: pointer;
  margin-right: 8px;
  &:hover { border-color: #1890ff; color: #1890ff; }
`;

const AddButton = styled(ActionButton)`
  background: #52c41a;
  border-color: #52c41a;
  color: #fff;
  &:hover { background: #73d13d; border-color: #73d13d; color: #fff; }
`;

const DeleteButton = styled(ActionButton)`
  background: #ff4d4f;
  border-color: #ff4d4f;
  color: #fff;
  &:hover { background: #ff7875; border-color: #ff7875; color: #fff; }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #e8e8e8;
  background: #fafafa;
`;

const Button = styled.button`
  padding: 8px 16px;
  font-size: 13px;
  border: 1px solid ${(props) => props.borderColor || "#d9d9d9"};
  border-radius: 4px;
  background: ${(props) => props.bgColor || "#fff"};
  color: ${(props) => props.color || "#333"};
  cursor: pointer;
  &:hover { border-color: #1890ff; color: #1890ff; }
`;

const PrimaryButton = styled(Button)`
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
  &:hover { background: #40a9ff; border-color: #40a9ff; color: #fff; }
`;

export default function TestDataModal({ visible, onClose, testData, onSave }) {
  const [formData, setFormData] = useState(testData);

  // 当模态框打开时，同步最新数据
  React.useEffect(() => {
    if (visible) {
      setFormData(testData);
    }
  }, [visible, testData]);

  // 更新配置
  const handleConfigChange = (key, value) => {
    console.log('[TestDataModal] handleConfigChange:', key, '=', value);
    setFormData(prev => {
      const newConfig = { ...prev.config, [key]: value };
      console.log('[TestDataModal] 新 config:', newConfig);
      return {
        ...prev,
        config: newConfig
      };
    });
  };

  // 添加资源
  const addResource = () => {
    const newResource = {
      id: `r${Date.now()}`,
      accountId: `a${Date.now()}`,
      name: '新员工',
      departmentId: 'd1',
      departmentName: '技术部'
    };
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, newResource]
    }));
  };

  // 删除资源
  const deleteResource = (index) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  // 更新资源
  const updateResource = (index, field, value) => {
    setFormData(prev => {
      const newResources = prev.resources.map((res, i) => {
        if (i === index) {
          const updated = { ...res, [field]: value };
          
          // 如果修改了 departmentId，自动查找对应的部门名称
          if (field === 'departmentId') {
            // 从现有资源中查找该部门ID对应的名称
            const existingDept = prev.resources.find(r => r.departmentId === value);
            if (existingDept) {
              updated.departmentName = existingDept.departmentName;
            } else {
              // 如果是新部门，根据 ID 生成默认名称
              const deptNames = {
                'd1': '技术部',
                'd2': '产品部',
                'd3': '运营部'
              };
              updated.departmentName = deptNames[value] || value;
            }
          }
          
          return updated;
        }
        return res;
      });
      
      return {
        ...prev,
        resources: newResources
      };
    });
  };

  // 添加事件
  const addEvent = () => {
    const today = new Date().toISOString().split('T')[0];
    const newEvent = {
      id: `e${Date.now()}`,
      resourceId: formData.resources[0]?.id || '',
      start: `${today}T09:00:00`,
      end: `${today}T10:00:00`,
      title: '新事件',
      color: '#1890ff',
      isBackground: false
    };
    setFormData(prev => ({
      ...prev,
      events: [...prev.events, newEvent]
    }));
  };

  // 删除事件
  const deleteEvent = (index) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.filter((_, i) => i !== index)
    }));
  };

  // 更新事件
  const updateEvent = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.map((ev, i) => 
        i === index ? { ...ev, [field]: value } : ev
      )
    }));
  };

  const handleSave = () => {
    console.log('[TestDataModal] 准备保存，timeFormat:', formData.config.timeFormat);
    onSave(formData);
    onClose();
  };

  if (!visible) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>🧪 测试数据配置</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        
        <ModalBody>
          {/* 视图配置 */}
          <Section>
            <SectionTitle>视图配置参数</SectionTitle>
            <FormRow>
              <FormField>
                <Label>开始时间</Label>
                <Input type="time" value={formData.config.begintime}
                  onChange={(e) => handleConfigChange('begintime', e.target.value)} />
              </FormField>
              <FormField>
                <Label>结束时间</Label>
                <Input type="time" value={formData.config.endtime}
                  onChange={(e) => handleConfigChange('endtime', e.target.value)} />
              </FormField>
              <FormField>
                <Label>时间间隔（分钟）</Label>
                <Input type="number" value={formData.config.timejiange}
                  onChange={(e) => handleConfigChange('timejiange', parseInt(e.target.value))} />
              </FormField>
              <FormField>
                <Label>单格高度（px）</Label>
                <Input type="number" value={formData.config.slotHeight}
                  onChange={(e) => handleConfigChange('slotHeight', parseInt(e.target.value))} />
              </FormField>
            </FormRow>
            <FormRow>
              <FormField>
                <Label>列宽度（px）</Label>
                <Input type="number" value={formData.config.colWidth}
                  onChange={(e) => handleConfigChange('colWidth', parseInt(e.target.value))} />
              </FormField>
              <FormField>
                <Label>时间轴宽度（px）</Label>
                <Input type="number" value={formData.config.axisWidth}
                  onChange={(e) => handleConfigChange('axisWidth', parseInt(e.target.value))} />
              </FormField>
              <FormField>
                <Label>时间格式</Label>
                <Select value={formData.config.timeFormat || 'single'}
                  onChange={(e) => handleConfigChange('timeFormat', e.target.value)}>
                  <option value="single">单一时间 (08:00)</option>
                  <option value="range">区间时间 (08:00-08:30)</option>
                </Select>
              </FormField>
            </FormRow>
            <FormRow>
              <FormField>
                <Label>列头标签</Label>
                <Input value={formData.config.columnHeader}
                  onChange={(e) => handleConfigChange('columnHeader', e.target.value)} />
              </FormField>
              <FormField>
                <Label>行头标签</Label>
                <Input value={formData.config.rowHeader}
                  onChange={(e) => handleConfigChange('rowHeader', e.target.value)} />
              </FormField>
            </FormRow>
          </Section>

          {/* 资源数据表格 */}
          <Section>
            <SectionTitle>资源数据（表头）</SectionTitle>
            <Table>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>AccountID</Th>
                  <Th>姓名</Th>
                  <Th>部门ID</Th>
                  <Th>部门名称</Th>
                  <Th style={{width: '100px'}}>操作</Th>
                </tr>
              </thead>
              <tbody>
                {formData.resources.map((res, index) => (
                  <TableRow key={index}>
                    <Td><Input value={res.id} onChange={(e) => updateResource(index, 'id', e.target.value)} /></Td>
                    <Td><Input value={res.accountId} onChange={(e) => updateResource(index, 'accountId', e.target.value)} /></Td>
                    <Td><Input value={res.name} onChange={(e) => updateResource(index, 'name', e.target.value)} /></Td>
                    <Td><Input value={res.departmentId} onChange={(e) => updateResource(index, 'departmentId', e.target.value)} /></Td>
                    <Td><Input value={res.departmentName} onChange={(e) => updateResource(index, 'departmentName', e.target.value)} /></Td>
                    <Td>
                      <DeleteButton onClick={() => deleteResource(index)}>删除</DeleteButton>
                    </Td>
                  </TableRow>
                ))}
              </tbody>
            </Table>
            <div style={{marginTop: '12px'}}>
              <AddButton onClick={addResource}>+ 添加资源</AddButton>
            </div>
          </Section>

          {/* 事件数据表格 */}
          <Section>
            <SectionTitle>事件数据</SectionTitle>
            <Table>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>资源ID</Th>
                  <Th>标题</Th>
                  <Th>开始时间</Th>
                  <Th>结束时间</Th>
                  <Th>颜色</Th>
                  <Th style={{width: '80px'}}>背景事件</Th>
                  <Th style={{width: '100px'}}>操作</Th>
                </tr>
              </thead>
              <tbody>
                {formData.events.map((ev, index) => (
                  <TableRow key={index}>
                    <Td><Input value={ev.id} onChange={(e) => updateEvent(index, 'id', e.target.value)} /></Td>
                    <Td><Input value={ev.resourceId} onChange={(e) => updateEvent(index, 'resourceId', e.target.value)} /></Td>
                    <Td><Input value={ev.title} onChange={(e) => updateEvent(index, 'title', e.target.value)} /></Td>
                    <Td><Input type="datetime-local" value={ev.start.replace(' ', 'T').substring(0, 16)} 
                      onChange={(e) => updateEvent(index, 'start', e.target.value + ':00')} /></Td>
                    <Td><Input type="datetime-local" value={ev.end.replace(' ', 'T').substring(0, 16)} 
                      onChange={(e) => updateEvent(index, 'end', e.target.value + ':00')} /></Td>
                    <Td><Input type="color" value={ev.color} onChange={(e) => updateEvent(index, 'color', e.target.value)} 
                      style={{width: '60px', padding: '2px'}} /></Td>
                    <Td style={{textAlign: 'center'}}>
                      <input 
                        type="checkbox" 
                        checked={ev.isBackground || false}
                        onChange={(e) => updateEvent(index, 'isBackground', e.target.checked)}
                        style={{width: '18px', height: '18px', cursor: 'pointer'}}
                      />
                    </Td>
                    <Td>
                      <DeleteButton onClick={() => deleteEvent(index)}>删除</DeleteButton>
                    </Td>
                  </TableRow>
                ))}
              </tbody>
            </Table>
            <div style={{marginTop: '12px'}}>
              <AddButton onClick={addEvent}>+ 添加事件</AddButton>
            </div>
          </Section>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>取消</Button>
          <PrimaryButton onClick={handleSave}>保存并应用</PrimaryButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
}
