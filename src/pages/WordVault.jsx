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
  const [previewUrlMap, setPreviewUrlMap] = useState({});

  const extractStoragePath = (value) => {
    if (!value || typeof value !== 'string') return null;
    if (value.startsWith('uploads/')) return value;
    try {
      const url = new URL(value);
      const publicMatch = url.pathname.match(/\/storage\/v1\/object\/public\/(.+)/);
      if (publicMatch) return publicMatch[1];
      const objectMatch = url.pathname.match(/\/storage\/v1\/object\/(.+)/);
      if (objectMatch) return objectMatch[1];
    } catch {
      return null;
    }
    return null;
  };

  const resolveFileUrl = async (fileReference) => {
    const storagePath = extractStoragePath(fileReference);
    if (!storagePath) return fileReference;
    try {
      const { signedUrl } = await api.getSignedUrl({ bucket: 'uploads', path: storagePath, expiresIn: 300 });
      return signedUrl || fileReference;
    } catch (error) {
      console.error('Signed URL generation failed:', error);
      return fileReference;
    }
  };

  useEffect(() => {
    let mounted = true;
    const loadWords = async () => {
      const data = await api.getWords();
      if (!mounted) return;
      setWords(data);
      setFilteredWords(data);
      setLoading(false);

      const resolved = {};
      await Promise.all(data.map(async (item) => {
        if (item.pdf_file) {
          try {
            resolved[item.id] = await resolveFileUrl(item.pdf_file);
          } catch (e) {
            console.error('Word PDF preview failure', item.id, e);
          }
        }
      }));
      if (!mounted) return;
      setPreviewUrlMap(resolved);
    };

    loadWords();
    return () => { mounted = false; };
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
          <Paragraph style={{ color: 'var(--text-color)', fontStyle: 'italic' }}>&quot;{randomWord.example}&quot;</Paragraph>
        </Card>
      )}

      {loading ? <Spin size="large" /> : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
          dataSource={filteredWords}
          renderItem={item => (
            <List.Item>
              <Card 
                title={<span style={{ color: 'var(--text-color)' }}>{item.word || item.title}</span>} 
                style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                actions={item.pdf_file ? [
                  <Button type="link" size="small" href={previewUrlMap[item.id] || item.pdf_file} target="_blank">Open Full PDF</Button>
                ] : undefined}
              >
                {previewUrlMap[item.id] ? (
                  <div style={{ height: 240, marginBottom: 16, overflow: 'hidden', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                    <iframe
                      title={`word-preview-${item.id}`}
                      src={previewUrlMap[item.id]}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                    />
                  </div>
                ) : (
                  <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', color: 'var(--text-color)', borderRadius: 12, marginBottom: 16 }}>
                    <span>No preview available</span>
                  </div>
                )}

                <Paragraph style={{ color: 'var(--theme-primary)', fontWeight: 'bold', marginBottom: 8 }}>{item.word}</Paragraph>
                <Paragraph style={{ color: 'var(--text-color)', marginBottom: 8 }}><strong>Meaning:</strong> {item.meaning}</Paragraph>
                <Paragraph style={{ color: 'var(--text-color)', fontStyle: 'italic', marginBottom: 8 }}>&quot;{item.example}&quot;</Paragraph>
                {!item.word && !item.meaning && !item.example && (
                  <Paragraph style={{ color: 'var(--text-color)', opacity: 0.7 }}>This word entry has no manual metadata yet.</Paragraph>
                )}
              </Card>
            </List.Item>
          )}
        />
      )}
    </motion.div>
  );
}