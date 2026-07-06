import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ConfigProvider, theme } from 'antd';
import AppHeader from './components/Layout/AppHeader';
import AppFooter from './components/Layout/AppFooter';
import HomePage from './pages/HomePage';
import MagazineArchive from './pages/MagazineArchive';
import WordVault from './pages/WordVault';
import ContributorsPage from './pages/ContributorsPage';
import FeedbacksPage from './pages/FeedbacksPage';
import AboutPage from './pages/AboutPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import ThoughtForTheWeekPage from './pages/ThoughtForTheWeekPage';
import SkyBackground from './components/SkyBackground';
import SnowEffect from './components/SnowEffect';

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
        token: { colorPrimary: 'var(--theme-primary)', fontFamily: 'Poppins, sans-serif' },
      }}
    >
      <Router>
        <SkyBackground />
        <SnowEffect />
        <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
          <AppHeader isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          <Content className="layout-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/magazine" element={<MagazineArchive />} />
              <Route path="/words" element={<WordVault />} />
              <Route path="/contributors" element={<ContributorsPage />} />
              <Route path="/feedbacks" element={<FeedbacksPage />} />
              <Route path="/thought" element={<ThoughtForTheWeekPage />} />
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