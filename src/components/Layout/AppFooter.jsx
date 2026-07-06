import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

export default function AppFooter() {
  return (
    <Footer style={{ textAlign: 'center', background: 'transparent', color: 'var(--text-color)', opacity: 0.9, padding: '40px 20px' }}>
      <div style={{ opacity: 0.8 }}>Knowledge Hub ©{new Date().getFullYear()} Created by Blue Sky Forum</div>
    </Footer>
  );
}