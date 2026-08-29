import React, { useState, useEffect } from 'react';
import {
  Typography,
  Tabs,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Spin,
  Popconfirm,
  Upload,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  MailOutlined,
  LockOutlined,
  LogoutOutlined,
  CloudOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { api } from '../lib/api';

const { Title, Paragraph } = Typography;
const { Option } = Select;

// -------------------------------------------------------------
// Beautiful Premium Admin Login Card Component
// -------------------------------------------------------------
function AdminLogin() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      await api.login(values.email, values.password);
      message.success('Welcome back, Admin!');
    } catch (err) {
      console.error(err);
      message.error(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '20px' }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '40px 30px',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '3rem', color: 'var(--theme-primary)', filter: 'drop-shadow(0 0 10px var(--theme-primary))' }}>
            <CloudOutlined />
          </div>
          <Title level={2} style={{ color: 'var(--text-color)', margin: '12px 0 4px 0' }}>Admin Login</Title>
          <Paragraph style={{ color: 'var(--text-color)', opacity: 0.6, fontSize: '0.9rem' }}>
            Secure Portal for Blue Sky Forum
          </Paragraph>
        </div>

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: 'var(--theme-primary)' }} />}
              placeholder="Admin Email"
              size="large"
              style={{
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-color)',
                border: '1px solid var(--border-color)',
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'var(--theme-primary)' }} />}
              placeholder="Password"
              size="large"
              style={{
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-color)',
                border: '1px solid var(--border-color)',
              }}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            style={{
              borderRadius: '12px',
              height: '48px',
              fontWeight: 'bold',
              marginTop: '16px',
            }}
          >
            Sign In
          </Button>
        </Form>
      </motion.div>
    </div>
  );
}

// -------------------------------------------------------------
// Admin Dashboard Component
// -------------------------------------------------------------
export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState('1');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const STORAGE_BUCKET = 'uploads';
  const [magazines, setMagazines] = useState([]);
  const [words, setWords] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [coverPdfFileList, setCoverPdfFileList] = useState([]);
  const [magazinePdfFileList, setMagazinePdfFileList] = useState([]);
  const [wordPdfFileList, setWordPdfFileList] = useState([]);

  // Authenticate session and subscription
  useEffect(() => {
    api.getSession().then((currSession) => {
      setSession(currSession);
      setCheckingAuth(false);
    });

    const subscription = api.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setCheckingAuth(false);
    });

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);

  const fetchData = async () => {
    if (!session) return;
    setLoadingData(true);
    try {
      const [mags, wrds, conts] = await Promise.all([
        api.getMagazines(),
        api.getWords(),
        api.getContributors(),
      ]);
      setMagazines(mags);
      setWords(wrds);
      setContributors(conts);
    } catch (err) {
      console.error(err);
      message.error('Error fetching dashboard data.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  const uploadFile = async (fileList, folder) => {
    if (!fileList || fileList.length === 0) return null;
    const file = fileList[0].originFileObj;
    if (!file) return null;

    const safeName = `${folder}_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const path = `${folder}/${safeName}`;
    await api.uploadFileToStorage({ bucket: STORAGE_BUCKET, path, file });
    const { publicUrl } = await api.getPublicUrl({ bucket: STORAGE_BUCKET, path });
    return publicUrl;
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      message.success('Logged out successfully.');
    } catch (err) {
      message.error('Error during sign out.');
    }
  };

  const handleSubmit = async (values) => {
    const hide = message.loading('Saving...', 0);
    try {
      if (activeTab === '1') {
        let coverPdfUrl = values.cover_pdf || null;
        let magazinePdfUrl = values.magazine_pdf || null;

        const uploadedCover = await uploadFile(coverPdfFileList, 'covers');
        if (uploadedCover) coverPdfUrl = uploadedCover;

        const uploadedMagazine = await uploadFile(magazinePdfFileList, 'magazines');
        if (uploadedMagazine) magazinePdfUrl = uploadedMagazine;

        const payload = {
          title: values.title,
          month: values.month,
          year: parseInt(values.year, 10),
          cover_pdf: coverPdfUrl,
          magazine_pdf: magazinePdfUrl,
        };
        await api.addMagazine(payload);
      } else if (activeTab === '2') {
        let pdfFileUrl = values.pdf_file || null;
        const uploadedWordPdf = await uploadFile(wordPdfFileList, 'words');
        if (uploadedWordPdf) pdfFileUrl = uploadedWordPdf;

        const payload = {
          word: values.word,
          meaning: values.meaning,
          example: values.example || '',
          pdf_file: pdfFileUrl,
        };
        await api.addWord(payload);
      } else if (activeTab === '3') {
        const payload = {
          name: values.name,
          year: values.year,
          department: values.department,
        };
        await api.addContributor(payload);
      }
      hide();
      message.success('Added successfully!');
      setIsModalVisible(false);
      setCoverPdfFileList([]);
      setMagazinePdfFileList([]);
      setWordPdfFileList([]);
      form.resetFields();
      fetchData();
    } catch (e) {
      hide();
      console.error(e);
      message.error(e.message || 'Failed to add item.');
    }
  };

  const handleDelete = async (id, type) => {
    const hide = message.loading('Deleting...', 0);
    try {
      if (type === 'magazine') await api.deleteMagazine(id);
      else if (type === 'word') await api.deleteWord(id);
      else if (type === 'contributor') await api.deleteContributor(id);
      hide();
      message.success('Deleted successfully!');
      fetchData();
    } catch (e) {
      hide();
      console.error(e);
      message.error('Failed to delete item. Make sure you are authorized.');
    }
  };

  const renderDeleteAction = (id, type) => (
    <Popconfirm
      title="Are you sure you want to delete this?"
      onConfirm={() => handleDelete(id, type)}
      okText="Yes"
      cancelText="No"
    >
      <Button type="primary" danger icon={<DeleteOutlined />} size="small">
        Delete
      </Button>
    </Popconfirm>
  );

  // Authentication Loading state
  if (checkingAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Not authenticated state
  if (!session) {
    return <AdminLogin />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ color: 'var(--text-color)', margin: 0 }}>Admin Dashboard</Title>
          <Paragraph style={{ color: 'var(--text-color)', opacity: 0.7, margin: 0 }}>
            Logged in as: <span style={{ color: 'var(--theme-secondary)', fontWeight: 'bold' }}>{session.user?.email}</span>
          </Paragraph>
        </div>
        <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
          Sign Out
        </Button>
      </div>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 16, height: '40px', borderRadius: '8px' }}
      >
        Add New {activeTab === '1' ? 'Magazine' : activeTab === '2' ? 'Word' : 'Contributor'}
      </Button>

      {loadingData ? (
        <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
      ) : (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="glass-panel"
          style={{ padding: 24, borderRadius: 16 }}
          items={[
            {
              key: '1',
              label: 'Magazines',
              children: (
                <Table
                  dataSource={magazines}
                  columns={[
                    { title: 'Title', dataIndex: 'title' },
                    { title: 'Month', dataIndex: 'month' },
                    { title: 'Year', dataIndex: 'year' },
                    { title: 'Action', key: 'action', render: (_, r) => renderDeleteAction(r.id, 'magazine') },
                  ]}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
            {
              key: '2',
              label: 'Words',
              children: (
                <Table
                  dataSource={words}
                  columns={[
                    { title: 'Word', dataIndex: 'word' },
                    { title: 'Meaning', dataIndex: 'meaning' },
                    { title: 'Example', dataIndex: 'example' },
                    { title: 'Action', key: 'action', render: (_, r) => renderDeleteAction(r.id, 'word') },
                  ]}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
            {
              key: '3',
              label: 'Contributors',
              children: (
                <Table
                  dataSource={contributors}
                  columns={[
                    { title: 'Name', dataIndex: 'name' },
                    { title: 'Department', dataIndex: 'department' },
                    { title: 'Year', dataIndex: 'year' },
                    { title: 'Action', key: 'action', render: (_, r) => renderDeleteAction(r.id, 'contributor') },
                  ]}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
          ]}
        />
      )}

      <Modal
        className="glass-panel"
        title={`Add New ${activeTab === '1' ? 'Magazine' : activeTab === '2' ? 'Word' : 'Contributor'}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} preserve={false}>
          {activeTab === '1' && (
            <>
              <Form.Item name="title" label={<span style={{ color: 'var(--text-color)' }}>Magazine Title</span>} rules={[{ required: true, message: 'Title is required' }]}>
                <Input placeholder="e.g. Virtuoso Digest: Volume 2" />
              </Form.Item>
              <Form.Item name="month" label={<span style={{ color: 'var(--text-color)' }}>Publication Month</span>} rules={[{ required: true, message: 'Month is required' }]}>
                <Select placeholder="Select month">
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                    <Option key={m} value={m}>{m}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="year" label={<span style={{ color: 'var(--text-color)' }}>Publication Year</span>} rules={[{ required: true, message: 'Year is required' }]}>
                <InputNumber style={{ width: '100%' }} min={2000} max={2100} defaultValue={new Date().getFullYear()} />
              </Form.Item>
              <Form.Item label={<span style={{ color: 'var(--text-color)' }}>Upload Cover PDF (Optional)</span>}>
                <Upload
                  accept=".pdf"
                  beforeUpload={() => false}
                  fileList={coverPdfFileList}
                  onChange={({ fileList }) => setCoverPdfFileList(fileList.slice(-1))}
                  onRemove={() => setCoverPdfFileList([])}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Select Cover PDF</Button>
                </Upload>
              </Form.Item>

              <Form.Item label={<span style={{ color: 'var(--text-color)' }}>Upload Magazine PDF (Optional)</span>}>
                <Upload
                  accept=".pdf"
                  beforeUpload={() => false}
                  fileList={magazinePdfFileList}
                  onChange={({ fileList }) => setMagazinePdfFileList(fileList.slice(-1))}
                  onRemove={() => setMagazinePdfFileList([])}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Select Magazine PDF</Button>
                </Upload>
              </Form.Item>

            </>
          )}

          {activeTab === '2' && (
            <>
              <Form.Item name="word" label={<span style={{ color: 'var(--text-color)' }}>Word / Term</span>} rules={[{ required: true, message: 'Word is required' }]}>
                <Input placeholder="e.g. Serendipity" />
              </Form.Item>
              <Form.Item name="meaning" label={<span style={{ color: 'var(--text-color)' }}>Meaning / Definition</span>} rules={[{ required: true, message: 'Meaning is required' }]}>
                <Input.TextArea rows={3} placeholder="Provide definition..." />
              </Form.Item>
              <Form.Item name="example" label={<span style={{ color: 'var(--text-color)' }}>Example Sentence (Optional)</span>}>
                <Input.TextArea rows={2} placeholder="e.g. A fortunate stroke of serendipity." />
              </Form.Item>
              <Form.Item label={<span style={{ color: 'var(--text-color)' }}>Upload Word PDF (Optional)</span>}>
                <Upload
                  accept=".pdf"
                  beforeUpload={() => false}
                  fileList={wordPdfFileList}
                  onChange={({ fileList }) => setWordPdfFileList(fileList.slice(-1))}
                  onRemove={() => setWordPdfFileList([])}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Select PDF</Button>
                </Upload>
              </Form.Item>

            </>
          )}

          {activeTab === '3' && (
            <>
              <Form.Item name="name" label={<span style={{ color: 'var(--text-color)' }}>Contributor Name</span>} rules={[{ required: true, message: 'Name is required' }]}> 
                <Input placeholder="e.g. Alice Johnson" />
              </Form.Item>
              <Form.Item name="year" label={<span style={{ color: 'var(--text-color)' }}>College Year</span>} rules={[{ required: true, message: 'College year is required' }]}> 
                <Select placeholder="Select Year">
                  <Option value="1st Year">1st Year</Option>
                  <Option value="2nd Year">2nd Year</Option>
                  <Option value="3rd Year">3rd Year</Option>
                  <Option value="4th Year">4th Year</Option>
                </Select>
              </Form.Item>
              <Form.Item name="department" label={<span style={{ color: 'var(--text-color)' }}>Department</span>} rules={[{ required: true, message: 'Department is required' }]}> 
                <Input placeholder="e.g. Computer Science & Engineering" />
              </Form.Item>
            </>
          )}

          <Button type="primary" htmlType="submit" size="large" block style={{ height: '48px', fontWeight: 'bold', borderRadius: '12px' }}>
            Submit Entry
          </Button>
        </Form>
      </Modal>
    </motion.div>
  );
}
