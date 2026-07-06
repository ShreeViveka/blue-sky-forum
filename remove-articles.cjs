const fs = require('fs');
const path = require('path');

const files = {
  'src/App.jsx': `
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ConfigProvider, theme } from 'antd';
import AppHeader from './components/Layout/AppHeader';
import AppFooter from './components/Layout/AppFooter';
import HomePage from './pages/HomePage';
import MagazineArchive from './pages/MagazineArchive';
import WordVault from './pages/WordVault';
import ContributorsPage from './pages/ContributorsPage';
import AboutPage from './pages/AboutPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import GlitterEffect from './components/GlitterEffect';

const { Content } = Layout;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentTheme, setCurrentTheme] = useState({ primary: '#8a2be2', secondary: '#00d2ff' });

  useEffect(() => {
    if (isDarkMode) document.body.setAttribute('data-theme', 'dark');
    else document.body.removeAttribute('data-theme');
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-primary', currentTheme.primary);
    document.documentElement.style.setProperty('--theme-secondary', currentTheme.secondary);
  }, [currentTheme]);

  return (
    <ConfigProvider
      theme={{
        cssVar: true, hashed: false,
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: { colorPrimary: 'var(--theme-primary)', fontFamily: 'Cinzel, serif' },
      }}
    >
      <Router>
        <GlitterEffect />
        <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
          <AppHeader isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          <Content className="layout-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/magazine" element={<MagazineArchive />} />
              <Route path="/words" element={<WordVault />} />
              <Route path="/contributors" element={<ContributorsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Content>
          <AppFooter />
        </Layout>
      </Router>
    </ConfigProvider>
  );
}
export default App;
  `,

  'src/components/Layout/AppHeader.jsx': `
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
    { key: '/about', label: <Link to="/about">About</Link> },
  ];

  return (
    <Header className="glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '0 50px', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ color: 'var(--theme-primary)', fontWeight: '900', fontSize: '1.5rem', marginRight: '2rem', letterSpacing: '1px', textShadow: '0 0 10px var(--theme-primary)' }}>BSF</div>
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
  `,

  'src/lib/mockData.js': `
export let mockMagazines = [{ id: 1, title: 'Virtuoso Digest: Fantasy', year: 2026, month: 'June', cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23', pdf_url: '#' }];
export let mockWords = [{ id: 1, word: 'Serendipity', meaning: 'The occurrence and development of events by chance in a happy or beneficial way.', example: 'A fortunate stroke of serendipity.' }];
export let mockContributors = [
  { id: 1, name: 'John Doe', year: '3rd Year', department: 'Computer Science', role: 'Editor', avatar_url: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Jane Smith', year: '2nd Year', department: 'English', role: 'Writer', avatar_url: 'https://i.pravatar.cc/150?u=2' },
];

export const addMagazine = (d) => { mockMagazines = [...mockMagazines, { id: Date.now(), ...d }]; };
export const addWord = (d) => { mockWords = [...mockWords, { id: Date.now(), ...d }]; };
export const addContributor = (d) => { mockContributors = [...mockContributors, { id: Date.now(), ...d }]; };
  `,

  'src/lib/api.js': `
import { mockMagazines, mockWords, mockContributors, addMagazine, addWord, addContributor } from './mockData';
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));
export const api = {
  getMagazines: async () => { await delay(); return [...mockMagazines]; },
  getWords: async () => { await delay(); return [...mockWords]; },
  getContributors: async () => { await delay(); return [...mockContributors]; },
  addMagazine: async (d) => { await delay(); addMagazine(d); return true; },
  addWord: async (d) => { await delay(); addWord(d); return true; },
  addContributor: async (d) => { await delay(); addContributor(d); return true; },
};
  `,

  'src/components/GlobalSearch.jsx': `
import React, { useState } from 'react';
import { Input, Modal, List, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function GlobalSearch() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (val) => {
    setSearchTerm(val);
    if (!val) { setResults([]); return; }
    setLoading(true);
    const [magazines, words, contributors] = await Promise.all([api.getMagazines(), api.getWords(), api.getContributors()]);
    const lowerVal = val.toLowerCase();
    
    const matchedMags = magazines.filter(m => m.title.toLowerCase().includes(lowerVal)).map(m => ({ ...m, type: 'Magazine', link: '/magazine' }));
    const matchedWords = words.filter(w => w.word?.toLowerCase().includes(lowerVal)).map(w => ({ ...w, title: w.word, type: 'Word', link: '/words' }));
    const matchedConts = contributors.filter(c => c.name.toLowerCase().includes(lowerVal)).map(c => ({ ...c, title: c.name, type: 'Contributor', link: '/contributors' }));

    setResults([...matchedMags, ...matchedWords, ...matchedConts]);
    setLoading(false);
  };

  return (
    <>
      <Input prefix={<SearchOutlined />} placeholder="Global Search..." onClick={() => setIsModalOpen(true)} style={{ width: 200, marginRight: 16 }} />
      <Modal className="glass-panel" title="Global Search" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={600}>
        <Input autoFocus prefix={<SearchOutlined />} placeholder="Search..." size="large" value={searchTerm} onChange={(e) => handleSearch(e.target.value)} style={{ marginBottom: 16 }} />
        <List loading={loading} dataSource={results} renderItem={item => (
          <List.Item onClick={() => { setIsModalOpen(false); navigate(item.link); }} style={{ cursor: 'pointer' }}>
            <List.Item.Meta title={<span style={{ color: 'var(--text-color)' }}>{item.title}</span>} description={item.type === 'Word' ? item.meaning : item.department || item.month} />
            <Tag color="purple">{item.type}</Tag>
          </List.Item>
        )} />
      </Modal>
    </>
  );
}
  `,

  'src/pages/AdminDashboard.jsx': `
import React, { useState, useEffect } from 'react';
import { Typography, Tabs, Table, Button, Modal, Form, Input, message, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { api } from '../lib/api';

const { Title } = Typography;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('1');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  
  const [magazines, setMagazines] = useState([]);
  const [words, setWords] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [mags, wrds, conts] = await Promise.all([api.getMagazines(), api.getWords(), api.getContributors()]);
    setMagazines(mags); setWords(wrds); setContributors(conts);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (values) => {
    const hide = message.loading('Saving...', 0);
    try {
      if (activeTab === '1') await api.addMagazine({ title: values.title, month: 'New', year: 2026 });
      else if (activeTab === '2') await api.addWord({ word: values.title, meaning: 'New meaning' });
      else if (activeTab === '3') await api.addContributor({ name: values.title, year: '1st Year', department: 'Unknown', role: 'Member', avatar_url: 'https://i.pravatar.cc/150' });
      hide(); message.success('Added!'); setIsModalVisible(false); form.resetFields(); fetchData();
    } catch (e) { hide(); message.error('Failed.'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Title level={2} style={{ color: 'var(--text-color)' }}>Admin Dashboard</Title>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>Add New Item</Button>
      {loading ? <Spin /> : (
        <Tabs activeKey={activeTab} onChange={setActiveTab} className="glass-panel" style={{ padding: 24, borderRadius: 16 }} items={[
          { key: '1', label: 'Magazines', children: <Table dataSource={magazines} columns={[{ title: 'Title', dataIndex: 'title' }]} rowKey="id" pagination={false} /> },
          { key: '2', label: 'Words', children: <Table dataSource={words} columns={[{ title: 'Word', dataIndex: 'word' }]} rowKey="id" pagination={false} /> },
          { key: '3', label: 'Contributors', children: <Table dataSource={contributors} columns={[{ title: 'Name', dataIndex: 'name' }, { title: 'Department', dataIndex: 'department' }]} rowKey="id" pagination={false} /> }
        ]} />
      )}
      <Modal className="glass-panel" title="Add Item" open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="title" label={<span style={{ color: 'var(--text-color)' }}>Title / Name</span>} rules={[{ required: true }]}><Input /></Form.Item>
          <Button type="primary" htmlType="submit" block>Submit</Button>
        </Form>
      </Modal>
    </motion.div>
  );
}
  `
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.writeFileSync(fullPath, content.trim());
  console.log('Updated:', filePath);
}
