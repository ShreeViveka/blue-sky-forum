const fs = require('fs');
const path = require('path');

const files = {
  'src/index.css': fs.readFileSync(path.join(__dirname, 'src/index.css'), 'utf8') + `

/* Infinite Marquee for Feedbacks */
.marquee-container {
  width: 100vw;
  margin-left: -50px; /* Offset layout padding */
  overflow: hidden;
  position: relative;
  display: flex;
}
@media (max-width: 768px) {
  .marquee-container { margin-left: -20px; }
}
.marquee-content {
  display: flex;
  gap: 40px;
  width: max-content;
  animation: marqueeScroll 40s linear infinite;
  padding: 10px 50px;
}
.marquee-content:hover {
  animation-play-state: paused;
}
@keyframes marqueeScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-50% - 20px)); } /* -50% minus half the gap */
}
`,

  'src/pages/HomePage.jsx': `
import React from 'react';
import { Typography, Card, Row, Col } from 'antd';
import { motion } from 'framer-motion';
import TiltCard from '../components/TiltCard';
import CloudButton from '../components/CloudButton';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const sentence = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { delay: 0.2, staggerChildren: 0.05 } },
};

const letter = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stories = [
  { name: 'Alice', dep: 'Computer Science', text: 'Blue Sky Forum gave me the confidence to ace my tech interviews! The vocabulary sessions are game-changing.' },
  { name: 'Bob', dep: 'Mechanical Engineering', text: 'Speak and Sparkle is real. I went from being completely stage-frightened to hosting our college fest!' },
  { name: 'Charlie', dep: 'Information Technology', text: 'Publishing my poem in Virtuoso Digest was the highlight of my entire semester. Highly recommended!' },
  { name: 'Diana', dep: 'Civil Engineering', text: 'The peer group here is incredibly supportive. It is the best place to make friends and improve your English.' },
  { name: 'Evan', dep: 'Electronics', text: 'The brainstorming sessions are brilliant. They really force you to think on your feet and articulate clearly.' }
];
const duplicatedStories = [...stories, ...stories];

export default function HomePage() {
  const navigate = useNavigate();
  const titleText = "Speak and Sparkle";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <div style={{ textAlign: 'center', padding: '120px 20px', marginBottom: '80px', position: 'relative' }}>
        <motion.div variants={sentence} initial="hidden" animate="visible">
          <Title level={1} style={{ fontSize: '5.5rem', margin: 0, fontWeight: 800, color: 'white', textShadow: '0 10px 40px rgba(0,0,0,0.2)', display: 'inline-block' }}>
            {titleText.split("").map((char, index) => (
              <motion.span key={char + "-" + index} variants={letter}>{char === " " ? "\\u00A0" : char}</motion.span>
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
              <Title level={1} style={{ margin: '16px 0', color: 'var(--text-color)', fontSize: '3rem' }}>Serendipity</Title>
              <Paragraph style={{ fontSize: '1.2rem', color: 'var(--text-color)', opacity: 0.8 }}>The occurrence and development of events by chance in a happy or beneficial way.</Paragraph>
            </Card>
          </TiltCard>
        </Col>
        <Col xs={24} md={12}>
          <TiltCard>
            <Card className="glass-panel" style={{ padding: '32px', height: '100%', border: 'none' }}>
              <Title level={4} style={{ color: 'var(--theme-primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>Latest Publication</Title>
              <div style={{ display: 'flex', gap: '30px', marginTop: 24 }}>
                <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80" alt="Cover" style={{ width: 140, borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }} />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Title level={3} style={{ color: 'var(--text-color)' }}>Virtuoso Digest</Title>
                  <Paragraph style={{ color: 'var(--text-color)', opacity: 0.7 }}>June 2026 Issue</Paragraph>
                  <div style={{ marginTop: 'auto' }}>
                    <CloudButton style={{ transform: 'scale(0.7)', transformOrigin: 'left bottom', marginTop: 0 }} onClick={() => navigate('/magazine')}>Read Now</CloudButton>
                  </div>
                </div>
              </div>
            </Card>
          </TiltCard>
        </Col>
      </Row>

      {/* Feedbacks & Stories Marquee */}
      <div style={{ marginTop: '120px', paddingBottom: '60px' }}>
        <Title level={2} style={{ color: 'var(--text-color)', textAlign: 'center', marginBottom: '60px', fontSize: '2.5rem', fontWeight: 800 }}>
          Feedbacks & Success Stories
        </Title>
        <div className="marquee-container">
          <div className="marquee-content">
            {duplicatedStories.map((story, idx) => (
              <div key={idx} className="glass-panel" style={{ width: '400px', padding: '30px', borderRadius: '24px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                <Paragraph style={{ fontSize: '1.2rem', color: 'var(--text-color)', fontStyle: 'italic', flex: 1, lineHeight: 1.6 }}>
                  "{story.text}"
                </Paragraph>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '20px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <Title level={5} style={{ margin: 0, color: 'var(--theme-primary)' }}>{story.name}</Title>
                    <span style={{ color: 'var(--text-color)', opacity: 0.7, fontSize: '0.9rem' }}>{story.dep}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
  `,

  'src/pages/AboutPage.jsx': `
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
          <Title level={1} style={{ fontSize: '4.5rem', color: 'var(--theme-primary)', fontWeight: 800, textShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            About Us
          </Title>
          <Title level={2} style={{ fontSize: '2rem', color: 'var(--text-color)', fontStyle: 'italic', opacity: 0.9 }}>
            "Speak and Sparkle"
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
  `
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.writeFileSync(fullPath, content.trim());
  console.log('Updated:', filePath);
}
