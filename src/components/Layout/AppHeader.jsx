import React from 'react';
import { Layout, Menu, Switch } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import GlobalSearch from '../GlobalSearch';

const { Header } = Layout;

export default function AppHeader({ isDarkMode, setIsDarkMode }) {
  const location = useLocation();
  const items = [
    { key: '/', label: <Link to="/">Home</Link> },
    { key: '/magazine', label: <Link to="/magazine">Magazine</Link> },
    { key: '/words', label: <Link to="/words">Word Vault</Link> },
    { key: '/contributors', label: <Link to="/contributors">Contributors</Link> },
    { key: '/feedbacks', label: <Link to="/feedbacks">Feedbacks</Link> },
    { key: '/thought', label: <Link to="/thought">Thought</Link> },
    { key: '/about', label: <Link to="/about">About</Link> },
  ];

  return (
    <Header className="glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '0 50px', position: 'sticky', top: 0, zIndex: 100 }}>
      <img src="/college-logo.png" alt="College Logo" style={{ height: '45px', marginRight: '15px', filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.1))' }} />
      <div style={{ color: 'white', fontWeight: '900', fontSize: '1.5rem', marginRight: '2rem', letterSpacing: '1px', textShadow: '0 2px 0 rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.2)' }}>BSF</div>
      <Menu
        theme={isDarkMode ? 'dark' : 'light'}
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={items}
        style={{ flex: 1, minWidth: 0, background: 'transparent', borderBottom: 'none' }}
      />
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
        <GlobalSearch />
        <Switch checked={isDarkMode} onChange={setIsDarkMode} checkedChildren={<BulbFilled />} unCheckedChildren={<BulbOutlined />} />
      </div>
    </Header>
  );
}