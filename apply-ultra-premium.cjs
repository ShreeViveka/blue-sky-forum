const fs = require('fs');
const path = require('path');

const files = {
  'src/index.css': `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

:root {
  --theme-primary: #0A84FF; /* Premium Blue */
  --theme-secondary: #00e5ff;
  
  --bg-color: #f5f6fa;
  --text-color: #1d1d1f; /* Apple style charcoal */
  --header-bg: rgba(255, 255, 255, 0.4);
  --card-bg: rgba(255, 255, 255, 0.2);
  --border-color: rgba(255, 255, 255, 0.4);

  --font-family: 'Outfit', sans-serif;
}

[data-theme='dark'] {
  --theme-primary: #0A84FF; 
  --text-color: #f5f6fa;
  --header-bg: rgba(0, 0, 0, 0.4);
  --card-bg: rgba(0, 0, 0, 0.2);
  --border-color: rgba(255, 255, 255, 0.1);
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: var(--font-family);
  overflow-x: hidden;
}

/* Stunning Parallax Sky Background */
.sky-layer-base {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -3;
  background: linear-gradient(180deg, #0A84FF 0%, #87CEEB 100%);
}
[data-theme='dark'] .sky-layer-base {
  background: linear-gradient(180deg, #0a0a2a 0%, #1a1a3a 100%);
}

.sky-layer-clouds {
  position: fixed; top: 0; left: 0; width: 200vw; height: 100vh; z-index: -2;
  background-repeat: repeat-x;
  background-position: top;
  pointer-events: none;
}

/* SVG Cloud Patterns generated for Parallax */
.clouds-back {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 200'%3E%3Cpath fill='rgba(255,255,255,0.2)' d='M100 100a40 40 0 0 1 75-15 50 50 0 0 1 80 15 30 30 0 0 1 45 10H100zM500 120a30 30 0 0 1 50-10 40 40 0 0 1 70 10 20 20 0 0 1 30 5H500zM800 80a50 50 0 0 1 80-20 60 60 0 0 1 90 20 40 40 0 0 1 60 10H800z'/%3E%3C/svg%3E");
  background-size: 800px;
  animation: drift 100s linear infinite;
  top: 5%;
}
.clouds-mid {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 200'%3E%3Cpath fill='rgba(255,255,255,0.4)' d='M50 150a50 50 0 0 1 80-20 60 60 0 0 1 100 20 40 40 0 0 1 60 10H50zM450 100a40 40 0 0 1 70-15 50 50 0 0 1 85 15 30 30 0 0 1 45 10H450z'/%3E%3C/svg%3E");
  background-size: 1000px;
  animation: drift 70s linear infinite;
  top: 25%;
}
.clouds-front {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 200'%3E%3Cpath fill='rgba(255,255,255,0.6)' d='M200 180a60 60 0 0 1 100-30 70 70 0 0 1 120 30 50 50 0 0 1 75 15H200zM700 160a55 55 0 0 1 90-25 65 65 0 0 1 110 25 45 45 0 0 1 65 15H700z'/%3E%3C/svg%3E");
  background-size: 1200px;
  animation: drift 40s linear infinite;
  top: 50%;
}

@keyframes drift {
  from { transform: translateX(0); }
  to { transform: translateX(-50vw); }
}

* { box-sizing: border-box; }
a { color: var(--theme-primary); text-decoration: none; transition: color 0.3s; }
a:hover { color: #005bb5; }

.layout-content { padding: 24px 50px; flex: 1; display: flex; flex-direction: column; position: relative; z-index: 1; }
@media (max-width: 768px) { .layout-content { padding: 16px 20px; } }

/* True Ultra-Premium Glassmorphism */
.glass-panel {
  background: var(--card-bg) !important;
  backdrop-filter: blur(30px) saturate(1.5);
  -webkit-backdrop-filter: blur(30px) saturate(1.5);
  border: 1px solid var(--border-color) !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255,255,255,0.2) !important;
  border-radius: 24px !important; 
}

/* Standard Buttons - Cleaned up to default Ant Design logic */
.ant-btn {
  border-radius: 8px !important;
  font-weight: 600 !important;
}

/* Literal Cloud Button Implementation */
.cloud-btn-wrapper {
  display: inline-block;
  filter: drop-shadow(0 15px 25px rgba(10, 132, 255, 0.4));
  margin-top: 30px; /* Space for the top bumps */
}
.literal-cloud-btn {
  position: relative;
  background: white;
  color: #0A84FF;
  border-radius: 40px; 
  padding: 14px 36px;
  font-weight: 800;
  font-size: 1.2rem;
  border: none;
  cursor: pointer;
  z-index: 1;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.literal-cloud-btn::before, .literal-cloud-btn::after {
  content: '';
  position: absolute;
  background: white;
  border-radius: 50%;
  z-index: -1;
}
.literal-cloud-btn::before {
  width: 50px; height: 50px;
  top: -20px; left: 18%;
}
.literal-cloud-btn::after {
  width: 70px; height: 70px;
  top: -30px; right: 18%;
}
.cloud-btn-wrapper:hover .literal-cloud-btn {
  transform: translateY(-5px) scale(1.05);
}
.cloud-btn-wrapper:active .literal-cloud-btn {
  transform: translateY(2px) scale(0.95);
}

/* Custom Scrollbar */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--theme-primary);
}
  `,

  'src/components/CloudButton.jsx': `
import React from 'react';

export default function CloudButton({ children, onClick, style }) {
  return (
    <div className="cloud-btn-wrapper" style={style}>
      <button className="literal-cloud-btn" onClick={onClick}>
        {children}
      </button>
    </div>
  );
}
  `,

  'src/components/SkyBackground.jsx': `
import React from 'react';

export default function SkyBackground() {
  return (
    <>
      <div className="sky-layer-base"></div>
      <div className="sky-layer-clouds clouds-back"></div>
      <div className="sky-layer-clouds clouds-mid"></div>
      <div className="sky-layer-clouds clouds-front"></div>
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
import MagazineArchive from './pages/MagazineArchive';
import WordVault from './pages/WordVault';
import ContributorsPage from './pages/ContributorsPage';
import AboutPage from './pages/AboutPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import SkyBackground from './components/SkyBackground';

const { Content } = Layout;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState({ primary: '#0A84FF', secondary: '#00e5ff' });

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
        token: { colorPrimary: 'var(--theme-primary)', fontFamily: 'Outfit, sans-serif' },
      }}
    >
      <Router>
        <SkyBackground />
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

  'src/pages/HomePage.jsx': `
import React from 'react';
import { Typography, Card, Row, Col } from 'antd';
import { motion } from 'framer-motion';
import TiltCard from '../components/TiltCard';
import CloudButton from '../components/CloudButton';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const sentence = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { delay: 0.2, staggerChildren: 0.05 } },
};

const letter = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const navigate = useNavigate();
  const titleText = "Speak and Sparkle";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <div style={{ textAlign: 'center', padding: '120px 20px', marginBottom: '80px', position: 'relative' }}>
        <motion.div variants={sentence} initial="hidden" animate="visible">
          <Title level={1} style={{ fontSize: '5.5rem', margin: 0, fontWeight: 800, color: 'white', textShadow: '0 10px 40px rgba(0,0,0,0.2)', display: 'inline-block' }}>
            {titleText.split("").map((char, index) => (
              <motion.span key={char + "-" + index} variants={letter}>{char === " " ? "\\u00A0" : char}</motion.span>
            ))}
          </Title>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1 }}>
          <Paragraph style={{ fontSize: '1.5rem', maxWidth: '700px', margin: '24px auto', color: 'white', fontWeight: 300, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
            Welcome to the Blue Sky Forum Knowledge Hub. Dive into the ocean of English while being entertained.
          </Paragraph>
          
          {/* LITERAL CLOUD BUTTON */}
          <CloudButton onClick={() => navigate('/magazine')}>
            Explore Virtuoso Digest
          </CloudButton>
          
        </motion.div>
      </div>

      <Row gutter={[40, 40]}>
        <Col xs={24} md={12}>
          <TiltCard>
            <Card className="glass-panel" style={{ padding: '32px', height: '100%', border: 'none' }}>
              <Title level={4} style={{ color: 'var(--theme-primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>Word of the Week</Title>
              <Title level={1} style={{ margin: '16px 0', color: 'var(--text-color)', fontSize: '3rem' }}>Serendipity</Title>
              <Paragraph style={{ fontSize: '1.2rem', color: 'var(--text-color)', opacity: 0.8 }}>The occurrence and development of events by chance in a happy or beneficial way.</Paragraph>
            </Card>
          </TiltCard>
        </Col>
        <Col xs={24} md={12}>
          <TiltCard>
            <Card className="glass-panel" style={{ padding: '32px', height: '100%', border: 'none' }}>
              <Title level={4} style={{ color: 'var(--theme-primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>Latest Publication</Title>
              <div style={{ display: 'flex', gap: '30px', marginTop: 24 }}>
                <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80" alt="Cover" style={{ width: 140, borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }} />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Title level={3} style={{ color: 'var(--text-color)' }}>Virtuoso Digest</Title>
                  <Paragraph style={{ color: 'var(--text-color)', opacity: 0.7 }}>June 2026 Issue</Paragraph>
                  <div style={{ marginTop: 'auto' }}>
                    <CloudButton style={{ transform: 'scale(0.7)', transformOrigin: 'left bottom', marginTop: 0 }} onClick={() => navigate('/magazine')}>Read Now</CloudButton>
                  </div>
                </div>
              </div>
            </Card>
          </TiltCard>
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
