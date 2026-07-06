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
                <Card className="glass-panel" style={{ textAlign: 'center', borderRadius: 20, padding: '24px 16px' }}>
                  <Title level={4} style={{ color: 'var(--text-color)', margin: 0 }}>{c.name}</Title>
                  <Paragraph style={{ color: 'var(--theme-secondary)', fontWeight: 'bold', margin: '12px 0 4px 0' }}>{c.year}</Paragraph>
                  <Paragraph style={{ color: 'var(--text-color)', opacity: 0.8 }}>{c.department}</Paragraph>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      )}
    </motion.div>
  );
}