const fs = require('fs');
const path = require('path');

const files = {
  'src/index.css': `
:root {
  --theme-primary: #8a2be2; /* Fantasy purple */
  --theme-secondary: #00d2ff; /* Magical blue */
  
  --bg-color: #ffffff;
  --text-color: #333333;
  --header-bg: rgba(255, 255, 255, 0.7);
  --card-bg: rgba(255, 255, 255, 0.6);
  --border-color: rgba(255, 255, 255, 0.3);

  --font-family: 'Outfit', 'Inter', sans-serif;
}

[data-theme='dark'] {
  --theme-primary: #b388ff;
  --theme-secondary: #00e5ff;
  
  --bg-color: #0b0c10;
  --text-color: #e0e0e0;
  --header-bg: rgba(11, 12, 16, 0.7);
  --card-bg: rgba(20, 22, 28, 0.6);
  --border-color: rgba(255, 255, 255, 0.1);
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: var(--font-family);
  transition: background-color 0.5s ease, color 0.5s ease;
  overflow-x: hidden;
}

/* Fantasy Background Mesh Gradient */
body::before {
  content: "";
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: radial-gradient(circle at 15% 50%, rgba(138, 43, 226, 0.15), transparent 50%),
              radial-gradient(circle at 85% 30%, rgba(0, 210, 255, 0.15), transparent 50%);
  z-index: -1;
  pointer-events: none;
}

* { box-sizing: border-box; }
a { color: var(--theme-primary); text-decoration: none; transition: color 0.3s; }
a:hover { filter: brightness(1.2); text-shadow: 0 0 8px var(--theme-primary); }

.layout-content { padding: 24px 50px; flex: 1; display: flex; flex-direction: column; position: relative; z-index: 1; }
@media (max-width: 768px) { .layout-content { padding: 16px 20px; } }

/* Glassmorphism utility */
.glass-panel {
  background: var(--card-bg) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-color) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
}

/* Glitter Particles */
.glitter-particle {
  position: fixed;
  pointer-events: none;
  border-radius: 50%;
  background: white;
  box-shadow: 0 0 10px 2px var(--theme-primary);
  animation: sparkle 1s linear forwards;
  z-index: 9999;
}

@keyframes sparkle {
  0% { transform: scale(0) translateY(0); opacity: 1; }
  50% { transform: scale(1.5) translateY(-10px); opacity: 0.8; }
  100% { transform: scale(0) translateY(-20px); opacity: 0; }
}
  `,

  'src/components/GlitterEffect.jsx': `
import React, { useEffect, useState } from 'react';

export default function GlitterEffect() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    let timeout;
    const handleMouseMove = (e) => {
      if (Math.random() > 0.3) return; // limit particles
      const newParticle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 4 + 2,
        color: Math.random() > 0.5 ? 'var(--theme-primary)' : 'var(--theme-secondary)'
      };
      
      setParticles(prev => [...prev.slice(-20), newParticle]); // keep max 20
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {particles.map(p => (
        <div 
          key={p.id}
          className="glitter-particle"
          style={{
            left: p.x, top: p.y,
            width: p.size, height: p.size,
            boxShadow: \`0 0 8px 2px \${p.color}\`
          }}
        />
      ))}
    </>
  );
}
  `,

  'src/App.jsx': `
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ConfigProvider, theme } from 'antd';
import AppHeader from './components/Layout/AppHeader';
import AppFooter from './components/Layout/AppFooter';
import HomePage from './pages/HomePage';
import ArticlesPage from './pages/ArticlesPage';
import MagazineArchive from './pages/MagazineArchive';
import WordVault from './pages/WordVault';
import ContributorsPage from './pages/ContributorsPage';
import AboutPage from './pages/AboutPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import GlitterEffect from './components/GlitterEffect';

const { Content } = Layout;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true); // default to dark fantasy
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
        token: { colorPrimary: 'var(--theme-primary)', fontFamily: 'Outfit, Inter, sans-serif' },
      }}
    >
      <Router>
        <GlitterEffect />
        <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
          <AppHeader isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          <Content className="layout-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/articles" element={<ArticlesPage />} />
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
    { key: '/articles', label: <Link to="/articles">Articles</Link> },
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
export let mockArticles = [{ id: 1, title: 'The Art of Communication', content: 'Content goes here...', author: 'Alice', category: 'Speaking', featured: true, created_at: '2026-06-01' }];
export let mockContributors = [
  { id: 1, name: 'John Doe', year: '3rd Year', department: 'Computer Science', role: 'Editor', avatar_url: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Jane Smith', year: '2nd Year', department: 'English', role: 'Writer', avatar_url: 'https://i.pravatar.cc/150?u=2' },
];

export const addMagazine = (d) => { mockMagazines = [...mockMagazines, { id: Date.now(), ...d }]; };
export const addWord = (d) => { mockWords = [...mockWords, { id: Date.now(), ...d }]; };
export const addArticle = (d) => { mockArticles = [...mockArticles, { id: Date.now(), ...d }]; };
export const addContributor = (d) => { mockContributors = [...mockContributors, { id: Date.now(), ...d }]; };
  `,

  'src/lib/api.js': `
import { mockMagazines, mockWords, mockArticles, mockContributors, addMagazine, addWord, addArticle, addContributor } from './mockData';
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));
export const api = {
  getMagazines: async () => { await delay(); return [...mockMagazines]; },
  getWords: async () => { await delay(); return [...mockWords]; },
  getArticles: async () => { await delay(); return [...mockArticles]; },
  getContributors: async () => { await delay(); return [...mockContributors]; },
  addMagazine: async (d) => { await delay(); addMagazine(d); return true; },
  addWord: async (d) => { await delay(); addWord(d); return true; },
  addArticle: async (d) => { await delay(); addArticle(d); return true; },
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
    const [magazines, words, articles, contributors] = await Promise.all([api.getMagazines(), api.getWords(), api.getArticles(), api.getContributors()]);
    const lowerVal = val.toLowerCase();
    
    const matchedMags = magazines.filter(m => m.title.toLowerCase().includes(lowerVal)).map(m => ({ ...m, type: 'Magazine', link: '/magazine' }));
    const matchedWords = words.filter(w => w.word?.toLowerCase().includes(lowerVal)).map(w => ({ ...w, title: w.word, type: 'Word', link: '/words' }));
    const matchedArticles = articles.filter(a => a.title.toLowerCase().includes(lowerVal)).map(a => ({ ...a, type: 'Article', link: '/articles' }));
    const matchedConts = contributors.filter(c => c.name.toLowerCase().includes(lowerVal)).map(c => ({ ...c, title: c.name, type: 'Contributor', link: '/contributors' }));

    setResults([...matchedMags, ...matchedWords, ...matchedArticles, ...matchedConts]);
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

  'src/pages/ContributorsPage.jsx': `
import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Spin, Avatar } from 'antd';
import { motion } from 'framer-motion';
import { api } from '../lib/api';

const { Title, Paragraph } = Typography;

export default function ContributorsPage() {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getContributors().then(data => { setContributors(data); setLoading(false); });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Title level={2} style={{ color: 'var(--text-color)', textAlign: 'center', marginBottom: 40, textShadow: '0 0 10px var(--theme-primary)' }}>Our Brilliant Minds</Title>
      {loading ? <Spin size="large" style={{ display: 'block', margin: '0 auto' }}/> : (
        <Row gutter={[32, 32]}>
          {contributors.map(c => (
            <Col xs={24} sm={12} md={8} lg={6} key={c.id}>
              <motion.div whileHover={{ y: -15, scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Card className="glass-panel" style={{ textAlign: 'center', borderRadius: 20 }}>
                  <Avatar src={c.avatar_url} size={100} style={{ border: '4px solid var(--theme-secondary)', marginBottom: 16, boxShadow: '0 0 20px var(--theme-primary)' }} />
                  <Title level={4} style={{ color: 'var(--text-color)', margin: 0 }}>{c.name}</Title>
                  <Paragraph style={{ color: 'var(--theme-secondary)', fontWeight: 'bold', margin: '4px 0' }}>{c.role}</Paragraph>
                  <Paragraph style={{ color: 'var(--text-color)', opacity: 0.8 }}>{c.year} • {c.department}</Paragraph>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      )}
    </motion.div>
  );
}
  `,

  'src/pages/AboutPage.jsx': `
import React from 'react';
import { Typography, Card, List } from 'antd';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

export default function AboutPage() {
  const features = [
    "Arrangement of Meetings to discuss vibrant areas of publication of creative thinking.",
    "Encourage students (Peer Group) to publish and make their writing public.",
    "Events and competitions are organized to provide students with a platform to demonstrate their communicative skills and compete with their peers.",
    "Stand out from normal by diving into the ocean of English while being entertained.",
    "Publication of students’ English literary works in “VIRTUOSO DIGEST” every month.",
    "Enriching vocabulary with a new word every Wednesday with “WE with VE (Vocabulary Enrichment)”.",
    "Improving the overall fluency in expressing yourself in English."
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card className="glass-panel" style={{ borderRadius: 24, padding: '24px' }}>
        <Title level={1} style={{ textAlign: 'center', color: 'var(--theme-primary)', textShadow: '0 0 15px var(--theme-primary)' }}>Blue Sky Forum</Title>
        <Title level={3} style={{ textAlign: 'center', color: 'var(--theme-secondary)', fontStyle: 'italic', marginBottom: 32 }}>"Speak and Sparkle"</Title>
        
        <Paragraph style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-color)', opacity: 0.9 }}>
          Blue Sky Forum is an informal creative engaging extra-curricular platform that motivates and encourages potential writers, thinkers, speakers and other artists through fun-filled and joyful events as well as brainstorming sessions. It ensures the overall development of the art of communication making the students confident and competent enough to crack any interview. And the forum also provides the limelight to showcase individual’s English prowess.
        </Paragraph>

        <Title level={3} style={{ color: 'var(--text-color)', marginTop: 40, borderBottom: '2px solid var(--theme-secondary)', paddingBottom: 8 }}>Significant Features</Title>
        <List
          dataSource={features}
          renderItem={item => (
            <List.Item style={{ borderBottom: 'none', padding: '12px 0' }}>
              <Typography.Text style={{ color: 'var(--text-color)', fontSize: '1.1rem' }}><span style={{ color: 'var(--theme-secondary)', marginRight: 12 }}>✦</span> {item}</Typography.Text>
            </List.Item>
          )}
        />
      </Card>
    </motion.div>
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
  `,

  'src/pages/HomePage.jsx': `
import React from 'react';
import { Typography, Card, Row, Col, Button } from 'antd';
import { motion } from 'framer-motion';
import { RocketOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <div style={{ textAlign: 'center', padding: '100px 20px', marginBottom: '60px', position: 'relative' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 1.5 }}>
          <Title level={1} style={{ fontSize: '5rem', margin: 0, fontWeight: 900, background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 10px 30px rgba(138,43,226,0.3)' }}>
            Speak and Sparkle
          </Title>
          <Paragraph style={{ fontSize: '1.5rem', maxWidth: '700px', margin: '24px auto', color: 'var(--text-color)', opacity: 0.8 }}>
            Welcome to the Blue Sky Forum Knowledge Hub. Dive into the ocean of English while being entertained.
          </Paragraph>
          <Button type="primary" size="large" shape="round" icon={<RocketOutlined />} style={{ height: '56px', padding: '0 40px', fontSize: '1.2rem', boxShadow: '0 0 20px var(--theme-primary)' }}>
            Explore Virtuoso Digest
          </Button>
        </motion.div>
      </div>

      <Row gutter={[40, 40]}>
        <Col xs={24} md={12}>
          <motion.div whileHover={{ y: -15, scale: 1.02 }} transition={{ type: 'spring', stiffness: 200 }}>
            <Card className="glass-panel" style={{ borderRadius: '24px', padding: '24px', height: '100%' }}>
              <Title level={2} style={{ color: 'var(--theme-secondary)', textShadow: '0 0 10px var(--theme-secondary)' }}>Word of the Week</Title>
              <Title level={1} style={{ margin: '16px 0', color: 'var(--text-color)' }}>Serendipity</Title>
              <Paragraph style={{ fontSize: '1.2rem', color: 'var(--text-color)', opacity: 0.8 }}>The occurrence and development of events by chance in a happy or beneficial way.</Paragraph>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} md={12}>
          <motion.div whileHover={{ y: -15, scale: 1.02 }} transition={{ type: 'spring', stiffness: 200 }}>
            <Card className="glass-panel" style={{ borderRadius: '24px', padding: '24px', height: '100%' }}>
              <Title level={2} style={{ color: 'var(--theme-primary)', textShadow: '0 0 10px var(--theme-primary)' }}>Latest Publication</Title>
              <div style={{ display: 'flex', gap: '20px', marginTop: 20 }}>
                <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=150&q=80" alt="Cover" style={{ width: 100, borderRadius: 12, boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }} />
                <div>
                  <Title level={4} style={{ color: 'var(--text-color)' }}>Virtuoso Digest: Fantasy Issue</Title>
                  <Button type="primary" shape="round" style={{ marginTop: 12 }}>Read Now</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>
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
