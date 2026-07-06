const fs = require('fs');
const path = require('path');

const cssAdditions = `
/* Custom Webkit Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: var(--bg-color);
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, var(--theme-primary), var(--theme-secondary));
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
}
::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, var(--theme-secondary), var(--theme-primary));
}

/* Ambient Float */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
}
.float-ambient {
  animation: float 6s ease-in-out infinite;
}
.float-ambient-delay {
  animation: float 7s ease-in-out infinite;
  animation-delay: -2s;
}
`;

const files = {
  'src/components/TiltCard.jsx': `
import React from 'react';
import { useMotionValue, useTransform, motion, useSpring } from 'framer-motion';

export default function TiltCard({ children, className, style, ambientClass = "" }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className={\`\${className} \${ambientClass}\`}
      style={{
        ...style,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1200
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{ transform: "translateZ(30px)", height: "100%" }}>
        {children}
      </div>
    </motion.div>
  );
}
  `,

  'src/pages/HomePage.jsx': `
import React from 'react';
import { Typography, Card, Row, Col, Button } from 'antd';
import { motion } from 'framer-motion';
import { RocketOutlined } from '@ant-design/icons';
import TiltCard from '../components/TiltCard';

const { Title, Paragraph } = Typography;

const sentence = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.5,
      staggerChildren: 0.08,
    },
  },
};

const letter = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function HomePage() {
  const titleText = "Speak and Sparkle";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <div style={{ textAlign: 'center', padding: '100px 20px', marginBottom: '60px', position: 'relative' }}>
        
        {/* Typewriter Title */}
        <motion.div variants={sentence} initial="hidden" animate="visible">
          <Title level={1} style={{ fontSize: '5rem', margin: 0, fontWeight: 900, background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 10px 30px rgba(138,43,226,0.3)', display: 'inline-block' }}>
            {titleText.split("").map((char, index) => {
              return (
                <motion.span key={char + "-" + index} variants={letter}>
                  {char}
                </motion.span>
              )
            })}
          </Title>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: 1 }}>
          <Paragraph style={{ fontSize: '1.5rem', maxWidth: '700px', margin: '24px auto', color: 'var(--text-color)', opacity: 0.8 }}>
            Welcome to the Blue Sky Forum Knowledge Hub. Dive into the ocean of English while being entertained.
          </Paragraph>
          <Button type="primary" size="large" shape="round" icon={<RocketOutlined />} style={{ height: '56px', padding: '0 40px', fontSize: '1.2rem', boxShadow: '0 0 20px var(--theme-primary)' }}>
            Explore Virtuoso Digest
          </Button>
        </motion.div>
      </div>

      <Row gutter={[40, 40]}>
        <Col xs={24} md={12}>
          <TiltCard ambientClass="float-ambient">
            <Card className="glass-panel" style={{ borderRadius: '24px', padding: '24px', height: '100%' }}>
              <Title level={2} style={{ color: 'var(--theme-secondary)', textShadow: '0 0 10px var(--theme-secondary)' }}>Word of the Week</Title>
              <Title level={1} style={{ margin: '16px 0', color: 'var(--text-color)' }}>Serendipity</Title>
              <Paragraph style={{ fontSize: '1.2rem', color: 'var(--text-color)', opacity: 0.8 }}>The occurrence and development of events by chance in a happy or beneficial way.</Paragraph>
            </Card>
          </TiltCard>
        </Col>
        <Col xs={24} md={12}>
          <TiltCard ambientClass="float-ambient-delay">
            <Card className="glass-panel" style={{ borderRadius: '24px', padding: '24px', height: '100%' }}>
              <Title level={2} style={{ color: 'var(--theme-primary)', textShadow: '0 0 10px var(--theme-primary)' }}>Latest Publication</Title>
              <div style={{ display: 'flex', gap: '20px', marginTop: 20 }}>
                <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=150&q=80" alt="Cover" style={{ width: 100, borderRadius: 12, boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }} />
                <div>
                  <Title level={4} style={{ color: 'var(--text-color)' }}>Virtuoso Digest: Fantasy Issue</Title>
                  <Button type="primary" shape="round" style={{ marginTop: 12 }}>Read Now</Button>
                </div>
              </div>
            </Card>
          </TiltCard>
        </Col>
      </Row>
    </motion.div>
  );
}
  `,

  'src/pages/MagazineArchive.jsx': `
import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Spin, Button, Modal, message } from 'antd';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import TiltCard from '../components/TiltCard';

const { Title } = Typography;

export default function MagazineArchive() {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readingMag, setReadingMag] = useState(null);

  useEffect(() => {
    api.getMagazines().then(data => { setMagazines(data); setLoading(false); });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Title level={2} style={{ color: 'var(--text-color)', textAlign: 'center', marginBottom: 40, textShadow: '0 0 10px var(--theme-primary)' }}>Magazine Archive</Title>
      {loading ? <Spin size="large" style={{ display: 'block', margin: '0 auto' }}/> : (
        <Row gutter={[32, 32]}>
          {magazines.map((mag, i) => (
            <Col xs={24} sm={12} md={8} lg={6} key={mag.id}>
              <TiltCard ambientClass={i % 2 === 0 ? "float-ambient" : "float-ambient-delay"}>
                <Card
                  className="glass-panel"
                  hoverable
                  cover={<img alt={mag.title} src={mag.cover_image} style={{ height: 350, objectFit: 'cover' }} />}
                  style={{ borderRadius: '16px', overflow: 'hidden' }}
                  actions={[
                    <Button type="primary" size="small" onClick={() => setReadingMag(mag)}>Read</Button>,
                    <Button size="small" onClick={() => message.success('Download started (mock).')}>Download</Button>
                  ]}
                >
                  <Card.Meta 
                    title={<span style={{ color: 'var(--text-color)' }}>{mag.title}</span>} 
                    description={<span style={{ color: 'var(--text-color)', opacity: 0.7 }}>{mag.month} {mag.year}</span>} 
                  />
                </Card>
              </TiltCard>
            </Col>
          ))}
        </Row>
      )}

      <Modal className="glass-panel" title={readingMag ? readingMag.title : 'Reading Magazine'} open={!!readingMag} onCancel={() => setReadingMag(null)} footer={null} width={800}>
        <div style={{ textAlign: 'center', padding: '40px 0', borderRadius: '8px' }}>
          <img src={readingMag?.cover_image} alt="Magazine Cover" style={{ maxHeight: '400px', boxShadow: '0 10px 30px var(--theme-primary)' }} />
          <Title level={4} style={{ marginTop: 24, color: 'var(--text-color)' }}>PDF Flipbook Viewer Here</Title>
        </div>
      </Modal>
    </motion.div>
  );
}
  `
};

// Update CSS
const cssPath = path.join(__dirname, 'src/index.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');
if (!cssContent.includes('::-webkit-scrollbar')) {
  fs.writeFileSync(cssPath, cssContent + '\\n' + cssAdditions);
  console.log('Updated: src/index.css');
}

// Write components
for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.writeFileSync(fullPath, content.trim());
  console.log('Updated:', filePath);
}
