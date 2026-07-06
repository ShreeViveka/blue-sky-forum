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