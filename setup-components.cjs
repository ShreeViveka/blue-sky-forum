const fs = require('fs');
const path = require('path');

const files = {
  'src/components/Layout/AppHeader.jsx': `
import React from 'react';
import { Layout, Menu, Switch } from 'antd';
import { Link } from 'react-router-dom';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';

const { Header } = Layout;

export default function AppHeader({ isDarkMode, setIsDarkMode }) {
  const items = [
    { key: '1', label: <Link to="/">Home</Link> },
    { key: '2', label: <Link to="/magazine">Magazine</Link> },
    { key: '3', label: <Link to="/words">Word Vault</Link> },
    { key: '4', label: <Link to="/articles">Articles</Link> },
    { key: '5', label: <Link to="/notices">Notices</Link> },
    { key: '6', label: <Link to="/about">About</Link> },
  ];

  return (
    <Header style={{ display: 'flex', alignItems: 'center', background: 'var(--header-bg)', padding: '0 50px', borderBottom: '1px solid var(--border-color)' }}>
      <div className="demo-logo" style={{ color: 'var(--theme-primary)', fontWeight: 'bold', fontSize: '1.2rem', marginRight: '2rem' }}>KnowledgeHub</div>
      <Menu
        theme={isDarkMode ? 'dark' : 'light'}
        mode="horizontal"
        defaultSelectedKeys={['1']}
        items={items}
        style={{ flex: 1, minWidth: 0, background: 'transparent', borderBottom: 'none' }}
      />
      <div style={{ marginLeft: 'auto' }}>
        <Switch
          checked={isDarkMode}
          onChange={setIsDarkMode}
          checkedChildren={<BulbFilled />}
          unCheckedChildren={<BulbOutlined />}
        />
      </div>
    </Header>
  );
}
  `,
  'src/components/Layout/AppFooter.jsx': `
import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

export default function AppFooter() {
  return (
    <Footer style={{ textAlign: 'center', background: 'var(--header-bg)', color: 'var(--text-color)' }}>
      Knowledge Hub ©{new Date().getFullYear()} Created by Student Club
    </Footer>
  );
}
  `,
  'src/pages/HomePage.jsx': `
import React from 'react';
import { Typography, Card, Row, Col } from 'antd';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Title level={1} style={{ color: 'var(--text-color)' }}>Welcome to Knowledge Hub</Title>
        <Paragraph style={{ color: 'var(--text-color)', fontSize: '1.2rem' }}>
          Your premium digital magazine and resource center.
        </Paragraph>
      </div>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card title="Latest Magazine" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <p style={{ color: 'var(--text-color)' }}>Read our latest monthly issue.</p>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Word of the Week" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <Title level={3} style={{ color: 'var(--theme-primary)' }}>Serendipity</Title>
            <p style={{ color: 'var(--text-color)' }}>The occurrence and development of events by chance in a happy or beneficial way.</p>
          </Card>
        </Col>
      </Row>
    </motion.div>
  );
}
  `,
  'src/pages/ArticlesPage.jsx': `import React from 'react'; export default function ArticlesPage() { return <div>Articles</div>; }`,
  'src/pages/MagazineArchive.jsx': `import React from 'react'; export default function MagazineArchive() { return <div>Magazine Archive</div>; }`,
  'src/pages/WordVault.jsx': `import React from 'react'; export default function WordVault() { return <div>Word Vault</div>; }`,
  'src/pages/NoticesPage.jsx': `import React from 'react'; export default function NoticesPage() { return <div>Notices</div>; }`,
  'src/pages/AboutPage.jsx': `import React from 'react'; export default function AboutPage() { return <div>About</div>; }`,
  'src/pages/AdminDashboard.jsx': `import React from 'react'; export default function AdminDashboard() { return <div>Admin Dashboard</div>; }`,
  'src/pages/NotFound.jsx': `import React from 'react'; export default function NotFound() { return <div>404 Not Found</div>; }`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.writeFileSync(fullPath, content.trim());
  console.log('Created:', filePath);
}
