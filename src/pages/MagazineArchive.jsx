import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Spin, Button, Modal, message } from 'antd';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import TiltCard from '../components/TiltCard';

const { Title, Paragraph } = Typography;

export default function MagazineArchive() {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readingMag, setReadingMag] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loadingMagazineUrl, setLoadingMagazineUrl] = useState(false);
  const [coverPreviewMap, setCoverPreviewMap] = useState({});

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const data = await api.getMagazines();
      if (!mounted) return;
      setMagazines(data);
      setLoading(false);

      // resolve cover preview signed URLs
      for (const mag of data) {
        if (mag.cover_pdf) {
          try {
            const url = await resolveFileUrl(mag.cover_pdf);
            if (!mounted) return;
            setCoverPreviewMap((m) => ({ ...m, [mag.id]: url }));
          } catch (e) {
            console.error('Cover preview load failed for', mag.id, e);
          }
        }
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

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

  const openMagazine = async (magazineReference) => {
    if (!magazineReference) return;
    setLoadingMagazineUrl(true);
    try {
      const url = await resolveFileUrl(magazineReference);
      window.open(url, '_blank');
    } finally {
      setLoadingMagazineUrl(false);
    }
  };

  const downloadMagazine = async (magazineReference) => {
    if (!magazineReference) return;
    setLoadingMagazineUrl(true);
    try {
      const url = await resolveFileUrl(magazineReference);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = '';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } finally {
      setLoadingMagazineUrl(false);
    }
  };

  const previewMagazine = async (magazineReference) => {
    if (!magazineReference) return;
    setLoadingMagazineUrl(true);
    try {
      const url = await resolveFileUrl(magazineReference);
      setPreviewUrl(url);
      setReadingMag({ title: 'Preview Magazine' });
    } finally {
      setLoadingMagazineUrl(false);
    }
  };

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
                  style={{ borderRadius: '16px', overflow: 'hidden' }}
                  cover={
                    coverPreviewMap[mag.id] ? (
                      <div style={{ height: 220, overflow: 'hidden' }}>
                        <iframe
                          title={`cover-${mag.id}`}
                          src={coverPreviewMap[mag.id]}
                          style={{ width: '100%', height: 220, border: 'none' }}
                        />
                      </div>
                    ) : (
                      <div style={{ height: 220, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(255,255,255,0.08)', color: 'var(--text-color)', fontWeight: 700 }}>
                        Cover PDF
                      </div>
                    )
                  }
                  actions={[
                    mag.magazine_pdf ? <Button type="link" size="small" onClick={() => previewMagazine(mag.magazine_pdf)} loading={loadingMagazineUrl}>View</Button> : null,
                    mag.magazine_pdf ? <Button type="link" size="small" onClick={() => downloadMagazine(mag.magazine_pdf)} loading={loadingMagazineUrl}>Download</Button> : null,
                  ].filter(Boolean)}
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

      <Modal className="glass-panel" title={readingMag ? readingMag.title : 'Preview Magazine'} open={!!readingMag} onCancel={() => { setReadingMag(null); setPreviewUrl(null); }} footer={null} width={1200} bodyStyle={{ height: '80vh', padding: 0 }} style={{ top: 20 }}>
        <div style={{ height: '100%', position: 'relative', background: 'rgba(255,255,255,0.03)', borderRadius: 16, overflow: 'hidden' }}>
          {previewUrl ? (
            <iframe
              title="Magazine Preview"
              src={previewUrl}
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, padding: 24 }}>
              <Title level={4} style={{ margin: 0, color: 'var(--text-color)' }}>Loading preview...</Title>
              <Spin />
            </div>
          )}
        </div>
      </Modal>
    </motion.div>
  );
}