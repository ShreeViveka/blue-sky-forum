import React, { useEffect, useState } from 'react';
import { Typography, Card, Row, Col, Spin } from 'antd';
import { motion } from 'framer-motion';
import TiltCard from '../components/TiltCard';
import CloudButton from '../components/CloudButton';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

const { Title, Paragraph } = Typography;

const sentence = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { delay: 0.2, staggerChildren: 0.05 } },
};

const letter = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const [latestWord, setLatestWord] = useState(null);
  const [latestMagazine, setLatestMagazine] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const titleText = "Speak and Sparkle";

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [words, mags] = await Promise.all([api.getWords(), api.getMagazines()]);
        if (!mounted) return;
        if (words && words.length) setLatestWord(words[0]);
        if (mags && mags.length) setLatestMagazine(mags[0]);
      } catch (err) {
        console.warn('Home load error:', err?.message || err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <div style={{ textAlign: 'center', padding: '80px 20px 120px', marginBottom: '80px', position: 'relative' }}>
        {/* Club Logo Circle */}
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, type: 'spring', stiffness: 120 }}>
          <img src="/club-logo.png" alt="Blue Sky Forum" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '4px solid rgba(255,255,255,0.6)', boxShadow: '0 15px 40px rgba(0,0,0,0.2)', marginBottom: '30px', background: 'white' }} />
        </motion.div>

        <motion.div variants={sentence} initial="hidden" animate="visible">
          <Title level={1} style={{ fontSize: '5.5rem', margin: 0, fontWeight: 800, color: 'white', textShadow: '0 10px 40px rgba(0,0,0,0.2)', display: 'inline-block' }}>
            {titleText.split("").map((char, index) => (
              <motion.span key={char + "-" + index} variants={letter}>{char === " " ? "\u00A0" : char}</motion.span>
            ))}
          </Title>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1 }}>
          <Paragraph style={{ fontSize: '1.5rem', maxWidth: '700px', margin: '24px auto', color: 'white', fontWeight: 300, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
            Welcome to the Blue Sky Forum Knowledge Hub. Dive into the ocean of English while being entertained.
          </Paragraph>
          
          {/* LITERAL CLOUD BUTTON */}
          <CloudButton onClick={() => navigate('/magazine')}>
            Explore Virtuoso Digest
          </CloudButton>
          
        </motion.div>
      </div>

      <Row gutter={[40, 40]}>
        <Col xs={24} md={12}>
          <TiltCard>
            <Card className="glass-panel" style={{ padding: '32px', height: '100%', border: 'none' }}>
              <Title level={4} style={{ color: 'var(--theme-primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>Word of the Week</Title>
              {loading ? (
                <Spin />
              ) : latestWord ? (
                <>
                  <Title level={1} style={{ margin: '16px 0', color: 'var(--text-color)', fontSize: '3rem' }}>{latestWord.word}</Title>
                  <Paragraph style={{ fontSize: '1.2rem', color: 'var(--text-color)', opacity: 0.8 }}>{latestWord.meaning}</Paragraph>
                </>
              ) : (
                <>
                  <Title level={1} style={{ margin: '16px 0', color: 'var(--text-color)', fontSize: '3rem' }}>Serendipity</Title>
                  <Paragraph style={{ fontSize: '1.2rem', color: 'var(--text-color)', opacity: 0.8 }}>The occurrence and development of events by chance in a happy or beneficial way.</Paragraph>
                </>
              )}
            </Card>
          </TiltCard>
        </Col>
        <Col xs={24} md={12}>
          <TiltCard>
            <Card className="glass-panel" style={{ padding: '32px', height: '100%', border: 'none' }}>
              <Title level={4} style={{ color: 'var(--theme-primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>Latest Publication</Title>
              {loading ? (
                <Spin />
              ) : latestMagazine ? (
                <div style={{ display: 'flex', gap: '30px', marginTop: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                    <Title level={3} style={{ color: 'var(--text-color)' }}>{latestMagazine.title || 'Virtuoso Digest'}</Title>
                    <Paragraph style={{ color: 'var(--text-color)', opacity: 0.7 }}>{(latestMagazine.month ? `${latestMagazine.month} ` : '') + (latestMagazine.year || '')}</Paragraph>
                    <div style={{ marginTop: 'auto' }}>
                      <CloudButton style={{ transform: 'scale(0.7)', transformOrigin: 'left bottom', marginTop: 0 }} onClick={() => navigate('/magazine')}>Read Now</CloudButton>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '30px', marginTop: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                    <Title level={3} style={{ color: 'var(--text-color)' }}>Virtuoso Digest</Title>
                    <Paragraph style={{ color: 'var(--text-color)', opacity: 0.7 }}>June 2026 Issue</Paragraph>
                    <div style={{ marginTop: 'auto' }}>
                      <CloudButton style={{ transform: 'scale(0.7)', transformOrigin: 'left bottom', marginTop: 0 }} onClick={() => navigate('/magazine')}>Read Now</CloudButton>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </TiltCard>
        </Col>
      </Row>
    </motion.div>
  );
}