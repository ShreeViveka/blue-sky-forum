const fs = require('fs');
const path = require('path');

const files = {
  'src/pages/MagazineArchive.jsx': `
import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Spin, Button, Modal } from 'antd';
import { motion } from 'framer-motion';
import { api } from '../lib/api';

const { Title } = Typography;

export default function MagazineArchive() {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMagazines().then(data => {
      setMagazines(data);
      setLoading(false);
    });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Title level={2} style={{ color: 'var(--text-color)' }}>Magazine Archive</Title>
      {loading ? <Spin size="large" /> : (
        <Row gutter={[24, 24]}>
          {magazines.map(mag => (
            <Col xs={24} sm={12} md={8} lg={6} key={mag.id}>
              <Card
                hoverable
                cover={<img alt={mag.title} src={mag.cover_image} style={{ height: 300, objectFit: 'cover' }} />}
                style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                actions={[
                  <Button type="primary" size="small">Read</Button>,
                  <Button size="small">Download</Button>
                ]}
              >
                <Card.Meta 
                  title={<span style={{ color: 'var(--text-color)' }}>{mag.title}</span>} 
                  description={<span style={{ color: 'var(--text-color)', opacity: 0.7 }}>{mag.month} {mag.year}</span>} 
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </motion.div>
  );
}
  `,
  'src/pages/WordVault.jsx': `
import React, { useEffect, useState } from 'react';
import { Typography, Input, Card, List, Spin, Button } from 'antd';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { SearchOutlined, RetweetOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function WordVault() {
  const [words, setWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [randomWord, setRandomWord] = useState(null);

  useEffect(() => {
    api.getWords().then(data => {
      setWords(data);
      setFilteredWords(data);
      setLoading(false);
    });
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setSearchTerm(val);
    setFilteredWords(words.filter(w => w.word?.toLowerCase().includes(val) || w.title?.toLowerCase().includes(val)));
  };

  const generateRandom = () => {
    if(words.length > 0) {
      const rand = words[Math.floor(Math.random() * words.length)];
      setRandomWord(rand);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Title level={2} style={{ color: 'var(--text-color)' }}>Word Vault</Title>
      <Input
        prefix={<SearchOutlined />}
        placeholder="Search for a word..."
        value={searchTerm}
        onChange={handleSearch}
        size="large"
        style={{ marginBottom: 24, maxWidth: 400 }}
      />
      <Button type="primary" icon={<RetweetOutlined />} onClick={generateRandom} style={{ marginBottom: 24, marginLeft: 16 }}>
        Random Word
      </Button>

      {randomWord && (
        <Card title="Random Word" style={{ marginBottom: 24, background: 'var(--card-bg)', borderColor: 'var(--theme-primary)' }}>
          <Title level={3} style={{ color: 'var(--theme-primary)' }}>{randomWord.word || randomWord.title}</Title>
          <Paragraph style={{ color: 'var(--text-color)' }}><strong>Meaning:</strong> {randomWord.meaning}</Paragraph>
          <Paragraph style={{ color: 'var(--text-color)', fontStyle: 'italic' }}>"{randomWord.example}"</Paragraph>
        </Card>
      )}

      {loading ? <Spin size="large" /> : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
          dataSource={filteredWords}
          renderItem={item => (
            <List.Item>
              <Card title={<span style={{ color: 'var(--text-color)' }}>{item.word || item.title}</span>} style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                <p style={{ color: 'var(--text-color)' }}>{item.meaning}</p>
              </Card>
            </List.Item>
          )}
        />
      )}
    </motion.div>
  );
}
  `,
  'src/pages/ArticlesPage.jsx': `
import React, { useEffect, useState } from 'react';
import { Typography, List, Card, Spin, Tag } from 'antd';
import { motion } from 'framer-motion';
import { api } from '../lib/api';

const { Title, Paragraph } = Typography;

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getArticles().then(data => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Title level={2} style={{ color: 'var(--text-color)' }}>Articles</Title>
      {loading ? <Spin size="large" /> : (
        <List
          itemLayout="vertical"
          size="large"
          dataSource={articles}
          renderItem={item => (
            <List.Item key={item.id} style={{ background: 'var(--card-bg)', marginBottom: 24, padding: 24, borderRadius: 8, border: '1px solid var(--border-color)' }}>
              <List.Item.Meta
                title={<a href="#" style={{ color: 'var(--theme-primary)', fontSize: '1.25rem' }}>{item.title}</a>}
                description={
                  <span>
                    <Tag color="blue">{item.category}</Tag>
                    <span style={{ color: 'var(--text-color)', opacity: 0.7 }}>By {item.author} on {item.created_at}</span>
                  </span>
                }
              />
              <Paragraph style={{ color: 'var(--text-color)' }}>{item.content}</Paragraph>
            </List.Item>
          )}
        />
      )}
    </motion.div>
  );
}
  `,
  'src/pages/NoticesPage.jsx': `
import React, { useEffect, useState } from 'react';
import { Typography, List, Spin, Badge } from 'antd';
import { motion } from 'framer-motion';
import { api } from '../lib/api';

const { Title } = Typography;

export default function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNotices().then(data => {
      setNotices(data);
      setLoading(false);
    });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Title level={2} style={{ color: 'var(--text-color)' }}>Notices & Announcements</Title>
      {loading ? <Spin size="large" /> : (
        <List
          itemLayout="horizontal"
          dataSource={notices}
          renderItem={item => (
            <List.Item style={{ background: 'var(--card-bg)', marginBottom: 16, padding: '16px 24px', borderRadius: 8, border: '1px solid var(--border-color)', borderLeft: item.priority === 'high' ? '4px solid red' : '4px solid var(--theme-primary)' }}>
              <List.Item.Meta
                title={<span style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>{item.title}</span>}
                description={<span style={{ color: 'var(--text-color)', opacity: 0.8 }}>{item.content}</span>}
              />
              <div style={{ color: 'var(--text-color)', opacity: 0.6 }}>{item.created_at}</div>
            </List.Item>
          )}
        />
      )}
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
