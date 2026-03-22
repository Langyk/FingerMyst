import React from 'react';
import { Layout, Menu } from 'antd';
import {
  BankOutlined,
  FundOutlined,
  FileTextOutlined,
  PieChartOutlined,
  DollarOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

interface SidebarProps {
  selectedKey: string;
  onSelect: (key: string) => void;
}

const menuItems = [
  {
    key: 'broker',
    icon: <BankOutlined />,
    label: '证券汇总',
  },
  {
    key: 'bond',
    icon: <FileTextOutlined />,
    label: '债券基金',
  },
  {
    key: 'dividend',
    icon: <DollarOutlined />,
    label: '红利基金',
  },
  {
    key: 'etf',
    icon: <FundOutlined />,
    label: 'ETF基金',
  },
  {
    key: 'analysis',
    icon: <PieChartOutlined />,
    label: '数据分析',
  },
];

const Sidebar: React.FC<SidebarProps> = ({ selectedKey, onSelect }) => {
  return (
    <Sider
      width={200}
      style={{
        background: '#1e1e2f',
        minHeight: '100vh',
        borderRight: '1px solid #2d2d44',
      }}
    >
      {/* Logo区域 */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid #2d2d44',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <img src="/logo.svg" alt="logo" style={{ width: '36px', height: '36px' }} />
        <div>
          <div style={{ color: '#e9d5ff', fontSize: '14px', fontWeight: 600 }}>指典秘境</div>
          <div style={{ color: '#8b8b9e', fontSize: '10px' }}>FingerMyst</div>
        </div>
      </div>

      {/* 导航 */}
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        style={{
          background: 'transparent',
          borderRight: 'none',
          marginTop: '8px'
        }}
        items={menuItems}
        onClick={({ key }) => onSelect(key)}
      />
    </Sider>
  );
};

export default Sidebar;