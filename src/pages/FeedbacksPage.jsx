import React, { useState, useEffect } from 'react';
import { Typography, Form, Input, Select, Button, Rate, message, Card, Row, Col, Empty, Popconfirm } from 'antd';
import { motion } from 'framer-motion';
import { SendOutlined, HeartOutlined, DeleteOutlined } from '@ant-design/icons';
import { api } from '../lib/api';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const departments = [
  'Artificial Intelligence and Data Science',
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Biomedical Engineering',
  'Biotechnology Engineering'];

const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function FeedbacksPage() {
  const [form] = Form.useForm();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const loadFeedbacks = async () => {
    try {
      setFetching(true);
      const data = await api.getFeedbacks();
      setFeedbacks(data);
    } catch (error) {
      console.error('Feedback load error:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteFeedback(id);
      message.success('Feedback deleted successfully');
      loadFeedbacks();
    } catch (error) {
      console.error('Failed to delete feedback:', error);
      message.error('Failed to delete feedback');
    }
  };

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
  }, []);

  useEffect(() => {
    if (authChecked) {
      loadFeedbacks();
    }
  }, [authChecked, isAdmin]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await api.addFeedback(values);
      setSubmitted(true);
      form.resetFields();
      message.success('Thank you for your feedback!');
      await loadFeedbacks();
    } catch (error) {
      console.error('Feedback submit error:', error);
      message.error(error?.message || 'Unable to submit feedback. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ padding: '40px 0' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 60, marginTop: 20 }}>
        <Title level={1} style={{ fontSize: '4rem', color: 'white', fontWeight: 800, margin: 0, textShadow: '0 4px 0 rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.2)' }}>
          Share Your Story
        </Title>
        <Paragraph style={{ fontSize: '1.3rem', color: 'white', opacity: 0.9, marginTop: 12, textShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          Your feedback helps Blue Sky Forum grow. Let us know how we made a difference!
        </Paragraph>
      </div>

      {/* Centered Form */}
      <div style={{ maxWidth: '750px', margin: '0 auto', padding: '0 20px 80px', position: 'relative', zIndex: 1000, pointerEvents: 'auto' }}>
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
            pointerEvents: 'auto',
            position: 'relative',
            zIndex: 1000,
          }}
        >
          <div className="glass-panel" style={{
            padding: '60px',
            borderRadius: '32px',
            boxShadow: '0 30px 60px rgba(0,0,0,0.15), 0 50px 80px rgba(0,0,0,0.08)',
            pointerEvents: 'auto',
            position: 'relative',
            zIndex: 1000,
          }}>
            <Title level={3} style={{ color: 'white', marginBottom: 30, textShadow: '0 3px 0 rgba(0,0,0,0.1), 0 6px 15px rgba(0,0,0,0.15)' }}>
              Submit Feedback
            </Title>

            {submitted ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '5rem', marginBottom: 20 }}>🌟</div>
                <Title level={3} style={{ color: 'white', textShadow: '0 3px 10px rgba(0,0,0,0.2)' }}>Thank You!</Title>
                <Paragraph style={{ color: 'white', fontSize: '1.1rem', opacity: 0.9 }}>
                  Your feedback has been received. It means the world to us!
                </Paragraph>
                <Button type="primary" style={{ marginTop: 16, borderRadius: 50 }} onClick={() => setSubmitted(false)}>Submit Another</Button>
              </motion.div>
            ) : (
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Form.Item name="name" label={<span style={{ color: 'white', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>Your Name</span>} rules={[{ required: true, message: 'Please enter your name' }]} style={{ pointerEvents: 'auto' }}>
                    <Input placeholder="e.g. Priya R." size="large" style={{ borderRadius: 12, background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.5)', color: 'white' }} />
                  </Form.Item>
                  <Form.Item name="year" label={<span style={{ color: 'white', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>Year</span>} rules={[{ required: true, message: 'Please select your year' }]} style={{ pointerEvents: 'auto' }}>
                    <Select placeholder="Select year" size="large" style={{ borderRadius: 12 }} getPopupContainer={() => document.body}>
                      {years.map(y => <Option key={y} value={y}>{y}</Option>)}
                    </Select>
                  </Form.Item>
                </div>

                <Form.Item name="department" label={<span style={{ color: 'white', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>Department</span>} rules={[{ required: true, message: 'Please select your department' }]} style={{ pointerEvents: 'auto' }}>
                  <Select placeholder="Select department" size="large" getPopupContainer={() => document.body}>
                    {departments.map(d => <Option key={d} value={d}>{d}</Option>)}
                  </Select>
                </Form.Item>

                <Form.Item name="event" label={<span style={{ color: 'white', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>What did you enjoy most?</span>} style={{ pointerEvents: 'auto' }}>
                  <Select placeholder="Select activity (optional)" size="large" getPopupContainer={() => document.body}>
                    <Option value="vocab">Vocabulary Enrichment Sessions</Option>
                    <Option value="digest">Virtuoso Digest Publication</Option>
                    <Option value="events">Events &amp; Competitions</Option>
                    
                    <Option value="overall">Overall Club Experience</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="rating" label={<span style={{ color: 'white', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>Overall Rating</span>} rules={[{ required: true, message: 'Please rate your experience' }]} style={{ pointerEvents: 'auto' }}>
                  <Rate character={<HeartOutlined />} style={{ color: '#ff6b6b', fontSize: '2rem' }} />
                </Form.Item>

                <Form.Item name="message" label={<span style={{ color: 'white', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>Your Feedback</span>} rules={[{ required: true, message: 'Please write your feedback' }, { min: 20, message: 'Please write at least 20 characters' }]} style={{ pointerEvents: 'auto' }}>
                  <TextArea rows={5} placeholder="Tell us how Blue Sky Forum helped you, what you loved, or any suggestions..." style={{ borderRadius: 12, fontSize: '1rem', background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.5)', color: 'white' }} />
                </Form.Item>

                <Form.Item name="story" label={<span style={{ color: 'white', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>Share Your Story</span>} style={{ pointerEvents: 'auto' }}>
                  <TextArea rows={4} placeholder="Share a story that connected with you..." style={{ borderRadius: 12, fontSize: '1rem', background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.5)', color: 'white' }} />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SendOutlined />}
                    size="large"
                    block
                    style={{ borderRadius: 50, height: 56, fontSize: '1.1rem', fontWeight: 700, background: 'linear-gradient(135deg, #0A84FF, #00e5ff)', border: 'none', boxShadow: '0 8px 25px rgba(10,132,255,0.4), 0 3px 0 rgba(0,0,0,0.1)' }}
                  >
                    Submit Feedback
                  </Button>
                </Form.Item>
              </Form>
            )}
          </div>
        </motion.div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 20px 80px' }}>
        {authChecked ? (
          isAdmin ? (
            <>
              <Title level={2} style={{ color: 'white', marginBottom: 24, textAlign: 'center' }}>Community Feedback (Admin View)</Title>
              {feedbacks.length === 0 && !fetching ? (
                <Empty description="No feedback submitted yet" style={{ color: 'white', padding: '80px 0' }} />
              ) : (
                <Row gutter={[24, 24]}>
                  {feedbacks.map((item) => (
                    <Col xs={24} sm={12} key={item.id}>
                      <Card
                        bordered={false}
                        style={{ borderRadius: 24, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(14px)' }}
                        bodyStyle={{ color: 'white' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Title level={4} style={{ color: 'white', marginBottom: 8 }}>{item.name}</Title>
                          <Popconfirm
                            title="Delete this feedback?"
                            description="Are you sure you want to delete this feedback?"
                            onConfirm={() => handleDelete(item.id)}
                            okText="Yes"
                            cancelText="No"
                            okButtonProps={{ danger: true }}
                          >
                            <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                          </Popconfirm>
                        </div>
                        <Paragraph style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 8 }}>{item.message}</Paragraph>
                        <Paragraph type="secondary" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
                          {item.year} • {item.department}
                        </Paragraph>
                        {item.event && (
                          <Paragraph style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 4 }}>Enjoyed: {item.event}</Paragraph>
                        )}
                        {item.story && (
                          <Paragraph style={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', marginBottom: 4 }}>
                            "{item.story}"
                          </Paragraph>
                        )}
                        {item.rating != null && (
                          <Paragraph style={{ color: 'rgba(255,255,255,0.65)' }}>Rating: {item.rating}/5</Paragraph>
                        )}
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </>
          ) : (
            <>
              <Title level={2} style={{ color: 'white', marginBottom: 24, textAlign: 'center' }}>Community Stories</Title>
              {feedbacks.filter(f => f.story && f.story.trim() !== '').length === 0 && !fetching ? (
                <Empty description="No stories shared yet. Be the first!" style={{ color: 'white', padding: '80px 0' }} />
              ) : (
                <Row gutter={[24, 24]}>
                  {feedbacks.filter(f => f.story && f.story.trim() !== '').map((item) => (
                    <Col xs={24} sm={12} key={item.id}>
                      <Card
                        bordered={false}
                        style={{ borderRadius: 24, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(14px)' }}
                        bodyStyle={{ color: 'white' }}
                      >
                        <Title level={4} style={{ color: 'white', marginBottom: 8 }}>{item.name}</Title>
                        <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', marginBottom: 16, fontSize: '1.1rem' }}>
                          "{item.story}"
                        </Paragraph>
                        <Paragraph type="secondary" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 0 }}>
                          {item.year} • {item.department}
                        </Paragraph>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </>
          )
        ) : (
          <Paragraph style={{ color: 'rgba(255,255,255,0.75)', textAlign: 'center', padding: '80px 0' }}>
            Loading...
          </Paragraph>
        )}
      </div>
    </motion.div>
  );
}
