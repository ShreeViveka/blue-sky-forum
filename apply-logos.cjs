const fs = require('fs');
const path = require('path');

const files = {
  'src/components/Layout/AppHeader.jsx': fs.readFileSync(path.join(__dirname, 'src/components/Layout/AppHeader.jsx'), 'utf8')
    .replace(
      `<div style={{ color: 'var(--theme-primary)', fontWeight: '900', fontSize: '1.5rem', marginRight: '2rem', letterSpacing: '1px', textShadow: '0 0 10px var(--theme-primary)' }}>BSF</div>`,
      `<img src="/club-logo.png" alt="BSF Logo" style={{ height: '45px', marginRight: '15px', filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.1))' }} />
      <div style={{ color: 'var(--theme-primary)', fontWeight: '900', fontSize: '1.5rem', marginRight: '2rem', letterSpacing: '1px', textShadow: '0 0 10px var(--theme-primary)' }}>BSF</div>`
    ),

  'src/components/Layout/AppFooter.jsx': `
import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

export default function AppFooter() {
  return (
    <Footer style={{ textAlign: 'center', background: 'transparent', color: 'var(--text-color)', opacity: 0.9, padding: '60px 20px 40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
        <img src="/college-logo.png" alt="Mepco Schlenk Engineering College" style={{ height: '60px', filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.1))' }} />
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--theme-primary)' }}>Mepco Schlenk Engineering College</div>
          <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Affiliated Institution</div>
        </div>
      </div>
      <div style={{ opacity: 0.8 }}>Knowledge Hub ©{new Date().getFullYear()} Created by Blue Sky Forum</div>
    </Footer>
  );
}
  `,

  'src/pages/AboutPage.jsx': fs.readFileSync(path.join(__dirname, 'src/pages/AboutPage.jsx'), 'utf8')
    .replace(
      `<Title level={1} style={{ fontSize: '4.5rem', color: 'var(--theme-primary)', fontWeight: 800, textShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>`,
      `<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', marginBottom: '20px' }}>
            <img src="/college-logo.png" alt="Mepco Schlenk" style={{ height: '90px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }} />
            <img src="/club-logo.png" alt="Blue Sky Forum" style={{ height: '110px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }} />
          </div>
          <Title level={1} style={{ fontSize: '4.5rem', color: 'var(--theme-primary)', fontWeight: 800, textShadow: '0 10px 30px rgba(0,0,0,0.1)', marginTop: 0 }}>`
    )
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.writeFileSync(fullPath, content.trim());
  console.log('Updated:', filePath);
}
