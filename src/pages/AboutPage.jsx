import React from 'react';
import { Typography, Row, Col } from 'antd';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

export default function AboutPage() {
  const features = [
    { title: "Vibrant Discussions", desc: "Arrangement of Meetings to discuss vibrant areas of publication of creative thinking.", icon: "🌟" },
    { title: "Peer Publishing", desc: "Encourage students to publish and make their writing public.", icon: "📖" },
    { title: "Competitions", desc: "Events organized to demonstrate communicative skills and compete.", icon: "🏆" },
    { title: "Ocean of English", desc: "Stand out from normal by diving into English while being entertained.", icon: "🌊" },
    { title: "Virtuoso Digest", desc: "Publication of students’ literary works every month.", icon: "📰" },
    { title: "Vocabulary Enrichment", desc: "Enriching vocabulary with a new word every Wednesday.", icon: "📚" },
    { title: "Fluency Mastery", desc: "Improving the overall fluency in expressing yourself in English.", icon: "🗣️" }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ padding: '40px 0' }}>

      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: 80, marginTop: 40 }}>
        <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: 0.8 }}>

          <Title level={1} style={{ fontSize: '4.5rem', color: 'white', fontWeight: 800, textShadow: '0 10px 30px rgba(0,0,0,0.1)', marginTop: 0 }}>
            About Us
          </Title>

        </motion.div>
      </div>

      {/* Mission Section */}
      <motion.div initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <div className="glass-panel" style={{ padding: '60px', borderRadius: '32px', marginBottom: 100, border: '1px solid var(--border-color)' }}>
          <Row justify="center">
            <Col xs={24} md={20} lg={16} style={{ textAlign: 'center' }}>
              <Title level={3} style={{ color: 'var(--theme-primary)', marginBottom: 24, fontSize: '2rem' }}>Our Mission</Title>
              <Paragraph style={{ fontSize: '1.4rem', lineHeight: '1.8', color: 'var(--text-color)', marginBottom: 24 }}>
                Blue Sky Forum is an informal creative engaging extra-curricular platform that motivates and encourages potential writers, thinkers, speakers and other artists through fun-filled and joyful events as well as brainstorming sessions.
              </Paragraph>
              <Paragraph style={{ fontSize: '1.4rem', lineHeight: '1.8', color: 'var(--text-color)' }}>
                It ensures the overall development of the art of communication making the students confident and competent enough to crack any interview. And the forum also provides the limelight to showcase individual’s English prowess.
              </Paragraph>
            </Col>
          </Row>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div style={{ padding: '0 20px', marginBottom: 80 }}>
        <Title level={2} style={{ textAlign: 'center', color: 'var(--text-color)', marginBottom: 60, fontSize: '2.5rem', fontWeight: 800 }}>
          Significant Features
        </Title>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          {features.map((f, i) => (
            <motion.div key={i} initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }} whileHover={{ y: -10 }} style={{ height: '100%' }}>
              <div className="glass-panel" style={{ padding: '40px 30px', height: '100%', borderRadius: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: 20, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }}>
                  {f.icon}
                </div>
                <Title level={4} style={{ color: 'var(--theme-primary)', fontSize: '1.5rem', marginBottom: 16 }}>
                  {f.title}
                </Title>
                <Paragraph style={{ fontSize: '1.1rem', color: 'var(--text-color)', opacity: 0.8, lineHeight: 1.6, margin: 0 }}>
                  {f.desc}
                </Paragraph>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}