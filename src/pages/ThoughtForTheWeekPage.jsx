import React, { useState, useEffect } from 'react';
import { Typography, Button, Modal, Form, Input, message, Spin } from 'antd';
import { motion } from 'framer-motion';
import { EditOutlined } from '@ant-design/icons';
import { api } from '../lib/api';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

// Sample thoughts (can be moved to Supabase later)
const THOUGHTS = [
  {
    id: 1,
    text: 'Every word you speak is a seed planted in the minds of others. Choose them wisely, for they grow into forests of understanding.',
    author: 'Blue Sky Forum',
  },
  {
    id: 2,
    text: 'The power of language lies not just in what we say, but in the silence we give to let words settle into hearts.',
    author: 'Blue Sky Forum',
  },
  {
    id: 3,
    text: 'A single word, perfectly placed, can change the trajectory of a conversation. Master the art of timing.',
    author: 'Blue Sky Forum',
  },
  {
    id: 4,
    text: 'The best communicators are not those who speak the most, but those who listen the deepest.',
    author: 'Blue Sky Forum',
  },
];

export default function ThoughtForTheWeekPage() {
  const [currentThought, setCurrentThought] = useState(THOUGHTS[0]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = await api.getCurrentUser();
        setIsAdmin(!!user);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setAuthChecked(true);
      }
    };
    checkAdmin();

    // Load persisted thought (if table exists) otherwise rotate locally
    const loadThought = async () => {
      try {
        const remote = await api.getThought();
        if (remote && remote.text) {
          setCurrentThought({ text: remote.text, author: remote.author || 'Blue Sky Forum' });
          return;
        }
      } catch (err) {
        console.warn('Could not load remote thought:', err?.message || err);
      }

      // Fallback: rotate thought weekly
      const weekNumber = Math.floor((new Date().getTime() / (1000 * 60 * 60 * 24 * 7)) % THOUGHTS.length);
      setCurrentThought(THOUGHTS[weekNumber]);
    };
    loadThought();
  }, []);

  const handleEditClick = () => {
    form.setFieldsValue({
      text: currentThought.text,
      author: currentThought.author,
    });
    setIsEditModalVisible(true);
  };

  const handleSave = async (values) => {
    try {
      setLoading(true);
      // Persist updated thought so all users see it
      const updated = await api.upsertThought({ text: values.text, author: values.author });
      if (updated) {
        setCurrentThought({ text: updated.text, author: updated.author });
      } else {
        setCurrentThought({ ...currentThought, text: values.text, author: values.author });
      }
      message.success('Thought updated successfully!');
      setIsEditModalVisible(false);
    } catch (error) {
      console.error('Update error:', error);
      message.error('Failed to update thought.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{ padding: '60px 0 100px' }}
    >
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: 80 }}>
        <Title
          level={1}
          style={{
            fontSize: '4.5rem',
            color: 'white',
            fontWeight: 800,
            margin: 0,
            textShadow: '0 4px 0 rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.2)',
          }}
        >
          Thought for the Week
        </Title>
        <Paragraph
          style={{
            fontSize: '1.2rem',
            color: 'rgba(255,255,255,0.85)',
            opacity: 0.9,
            marginTop: 16,
            textShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          Inspiring words to elevate your journey this week
        </Paragraph>
      </div>

      {/* Main Thought Card */}
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 20px 60px',
        }}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <div
            className="glass-panel"
            style={{
              padding: '100px 80px',
              borderRadius: '40px',
              textAlign: 'center',
              boxShadow: '0 30px 60px rgba(0,0,0,0.15), 0 50px 80px rgba(0,0,0,0.08), 0 0 60px rgba(10,132,255,0.15)',
              position: 'relative',
              zIndex: 10,
              border: '2px solid rgba(10,132,255,0.3)',
            }}
          >
            {/* Glow background effect */}
            <div
              style={{
                position: 'absolute',
                top: '-50%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(10,132,255,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                zIndex: -1,
              }}
            />

            {/* Thought Icon */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{
                fontSize: '5.5rem',
                marginBottom: 32,
                color: 'var(--theme-primary)',
                filter: 'drop-shadow(0 0 20px var(--theme-primary))',
              }}
            >
              💡
            </motion.div>

            {/* Thought Text */}
            <Title
              level={1}
              style={{
                color: 'white',
                fontSize: '3.2rem',
                lineHeight: 2,
                marginBottom: 40,
                fontWeight: 700,
                textShadow: '0 3px 10px rgba(0,0,0,0.2)',
                letterSpacing: '0.5px',
              }}
            >
              {currentThought.text}
            </Title>

            {/* Author */}
            <Paragraph
              style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '1.3rem',
                marginBottom: 12,
                fontStyle: 'italic',
              }}
            >
              — {currentThought.author}
            </Paragraph>

            {/* Admin Edit Button */}
            {authChecked && isAdmin && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ marginTop: 50 }}
              >
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEditClick}
                  style={{
                    borderRadius: 28,
                    paddingLeft: 32,
                    paddingRight: 32,
                    height: 50,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: '0 8px 25px rgba(10,132,255,0.4)',
                  }}
                >
                  Edit This Week's Thought
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Past Thoughts Section */}

      {/* Edit Modal */}
      <Modal
        title="Edit Thought for the Week"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={() => form.submit()}
        okText="Save"
        cancelText="Cancel"
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="text"
            label="Thought"
            rules={[{ required: true, message: 'Please enter the thought' }]}
          >
            <TextArea rows={5} placeholder="Enter this week's thought..." />
          </Form.Item>
          <Form.Item
            name="author"
            label="Author"
            rules={[{ required: true, message: 'Please enter the author' }]}
          >
            <Input placeholder="e.g., Blue Sky Forum" />
          </Form.Item>
          {/* week field removed per request */}
        </Form>
      </Modal>
    </motion.div>
  );
}
