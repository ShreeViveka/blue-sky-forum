const fs = require('fs');
const path = require('path');

const files = {
  'src/index.css': `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;700&display=swap');

:root {
  --theme-primary: #00a8ff; /* Deep Sky Blue */
  --theme-secondary: #fbc531; /* Sun yellow */
  
  --bg-color: #f5f6fa;
  --text-color: #2f3640;
  --header-bg: rgba(255, 255, 255, 0.6);
  --card-bg: rgba(255, 255, 255, 0.65);
  --border-color: rgba(255, 255, 255, 0.6);

  --font-family: 'Cinzel', serif;
}

[data-theme='dark'] {
  --theme-primary: #192a56; /* Night sky */
  --theme-secondary: #f5f6fa; /* Moon white */
  --bg-color: #273c75;
  --text-color: #f5f6fa;
  --header-bg: rgba(39, 60, 117, 0.6);
  --card-bg: rgba(25, 42, 86, 0.6);
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

/* Vibrant Blue Sky Gradient Background */
body::before {
  content: "";
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: linear-gradient(180deg, #4facfe 0%, #00f2fe 100%);
  z-index: -2;
  pointer-events: none;
}
[data-theme='dark'] body::before {
  background: linear-gradient(180deg, #141e30 0%, #243b55 100%);
}

/* Floating Animated Clouds in Background */
body::after {
  content: "";
  position: fixed;
  top: -10%; left: -10%; width: 120vw; height: 120vh;
  background-image: 
    radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.4) 0%, transparent 20%),
    radial-gradient(ellipse at 80% 60%, rgba(255,255,255,0.3) 0%, transparent 25%),
    radial-gradient(ellipse at 50% 10%, rgba(255,255,255,0.5) 0%, transparent 15%);
  z-index: -1;
  pointer-events: none;
  animation: floatClouds 60s linear infinite alternate;
}

@keyframes floatClouds {
  0% { transform: translateX(-5%) translateY(2%); }
  100% { transform: translateX(5%) translateY(-2%); }
}

* { box-sizing: border-box; }
a { color: var(--theme-primary); text-decoration: none; transition: color 0.3s; }
a:hover { filter: brightness(1.2); text-shadow: 0 0 8px var(--theme-primary); }

.layout-content { padding: 24px 50px; flex: 1; display: flex; flex-direction: column; position: relative; z-index: 1; }
@media (max-width: 768px) { .layout-content { padding: 16px 20px; } }

/* Glassmorphism Cloud Panels */
.glass-panel {
  background: var(--card-bg) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-color) !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08) !important;
  border-radius: 24px !important; 
}

/* Global CLOUD BUTTONS Override */
.ant-btn {
  border-radius: 50px !important; /* Pill shape */
  font-weight: bold !important;
  border: none !important;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1), inset 0 -3px 5px rgba(0,0,0,0.05), inset 0 3px 5px rgba(255,255,255,0.4) !important;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}
.ant-btn:hover {
  transform: translateY(-3px) scale(1.05) !important;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15), inset 0 -3px 5px rgba(0,0,0,0.05), inset 0 3px 5px rgba(255,255,255,0.6) !important;
}
.ant-btn:active {
  transform: translateY(2px) scale(0.95) !important;
}

/* Primary Cloud Buttons */
.ant-btn-primary {
  background: linear-gradient(135deg, var(--theme-primary), #00f2fe) !important;
  color: white !important;
  box-shadow: 0 6px 20px rgba(0, 168, 255, 0.4), inset 0 -3px 5px rgba(0,0,0,0.1), inset 0 3px 5px rgba(255,255,255,0.3) !important;
}
[data-theme='dark'] .ant-btn-primary {
  background: linear-gradient(135deg, var(--theme-primary), #4facfe) !important;
}

/* Custom Webkit Scrollbar */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, var(--theme-primary), var(--theme-secondary));
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0,0,0,0.1);
}
::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, var(--theme-secondary), var(--theme-primary));
}

/* Ambient Float */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
}
.float-ambient { animation: float 6s ease-in-out infinite; }
.float-ambient-delay { animation: float 7s ease-in-out infinite; animation-delay: -2s; }

/* Stars/Raindrops */
.glitter-particle {
  position: fixed;
  pointer-events: none;
  border-radius: 50%;
  background: white;
  box-shadow: 0 0 15px 4px rgba(255,255,255,0.8);
  animation: twinkle 1.5s ease-out forwards;
  z-index: 9999;
}
@keyframes twinkle {
  0% { transform: scale(0) translateY(0); opacity: 1; }
  30% { transform: scale(1.2) translateY(5px); opacity: 0.9; }
  100% { transform: scale(0) translateY(30px); opacity: 0; }
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
import GlitterEffect from './components/GlitterEffect';

const { Content } = Layout;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false); // Changed to Light mode by default
  const [currentTheme, setCurrentTheme] = useState({ primary: '#00a8ff', secondary: '#fbc531' }); // Sky blue and sun yellow

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

  'src/components/GlitterEffect.jsx': `
import React, { useEffect, useState } from 'react';

export default function GlitterEffect() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (Math.random() > 0.15) return; // limit particles slightly more for stars
      const newParticle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 3 + 2,
        color: Math.random() > 0.5 ? 'white' : 'var(--theme-secondary)' // White or sunny yellow
      };
      
      setParticles(prev => [...prev.slice(-20), newParticle]);
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
            background: p.color,
            boxShadow: \`0 0 12px 3px \${p.color}\`
          }}
        />
      ))}
    </>
  );
}
  `
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.writeFileSync(fullPath, content.trim());
  console.log('Updated:', filePath);
}
