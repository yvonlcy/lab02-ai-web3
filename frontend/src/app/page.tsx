'use client';

import { useState } from 'react';
import { Button, Input, Card, Avatar, Typography, message as antdMessage } from 'antd';
import { UserOutlined, SendOutlined, RobotFilled } from '@ant-design/icons';
import 'antd/dist/reset.css';

const { Title, Text } = Typography;

export default function Home() {
  const [account, setAccount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [contractMessage, setContractMessage] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      antdMessage.warning('Please install MetaMask');
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      if (Array.isArray(accounts) && accounts.length > 0 && typeof accounts[0] === 'string') {
        setAccount(accounts[0]);
        antdMessage.success('Wallet connected!');
      } else {
        antdMessage.error('No accounts found.');
      }
    } catch (error) {
      antdMessage.error('Error connecting wallet');
      console.error('Error connecting wallet:', error);
    }
  };

  const fetchMessage = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/blockchain-message');
      const data = await response.json();
      if (data.message) {
        setContractMessage(data.message);
      }
    } catch (error) {
      console.error('Error fetching message:', error);
    }
  };

  const generateAndStore = async () => {
    if (!window.ethereum || !account) {
      antdMessage.warning('Please connect your wallet first');
      return;
    }
    try {
      setLoading(true);
      setAiResponse('');
      // 1. Call backend AI API
      const aiRes = await fetch('http://localhost:3001/api/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: message }),
      });
      const aiData = await aiRes.json();
      setAiResponse(aiData.response);
      antdMessage.success('AI generated a response!');
      // 2. Store AI response on blockchain
      const response = await fetch('http://localhost:3001/api/update-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: aiData.response }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchMessage();
        antdMessage.success('Message stored on blockchain!');
      } else {
        antdMessage.error(data.error || 'Failed to update message');
      }
    } catch (error) {
      antdMessage.error('Error updating message');
      console.error('Error updating message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fce4ec 0%, #f3e8ff 50%, #e0f7fa 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Card
        style={{ maxWidth: 430, width: '100%', borderRadius: 16, boxShadow: '0 6px 24px #d1c4e980', background: 'rgba(255,255,255,0.95)' }}
        styles={{ body: { padding: 32 } }}
        variant="borderless"
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar
            size={72}
            style={{ background: 'linear-gradient(135deg, #f8bbd0 0%, #ce93d8 100%)', marginBottom: 12, boxShadow: '0 2px 8px #d1c4e9' }}
            icon={<RobotFilled style={{ fontSize: 36, color: '#fff' }} />}
          />
          <Title level={2} style={{ color: '#a259f7', marginBottom: 0, fontWeight: 800, fontFamily: 'cursive' }}>AI Web3 DApp</Title>
          <Text style={{ color: '#f06292', fontWeight: 500, fontSize: 18, marginBottom: 16 }}>AI Girlfriend ✨</Text>
          <Button
            type="primary"
            shape="round"
            icon={<UserOutlined />}
            onClick={connectWallet}
            style={{ marginBottom: 20, background: account ? '#81d4fa' : '#f06292', border: 'none' }}
            size="large"
          >
            {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
          </Button>
        </div>

        {account && (
          <div style={{ marginTop: 16 }}>
            <Text strong style={{ color: '#a259f7' }}>Enter your message:</Text>
            <Input
              style={{ marginTop: 8, marginBottom: 12, borderRadius: 8, fontSize: 16, background: '#f8bbd0', color: '#880e4f', border: '1px solid #f06292' }}
              placeholder="Ask AI to generate content..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              disabled={loading}
              maxLength={100}
              size="large"
            />
            <Button
              type="primary"
              shape="round"
              icon={<SendOutlined />}
              loading={loading}
              disabled={!message}
              onClick={generateAndStore}
              style={{ width: '100%', background: '#a259f7', border: 'none', fontWeight: 600, fontSize: 16 }}
              size="large"
            >
              {loading ? 'Processing...' : 'Generate & Store'}
            </Button>

            {aiResponse && (
              <div style={{ marginTop: 24, display: 'flex', alignItems: 'flex-start' }}>
                <Avatar style={{ background: 'linear-gradient(135deg, #f8bbd0 0%, #ce93d8 100%)', marginRight: 12 }} icon={<RobotFilled />} />
                <div style={{ background: '#fff0f6', color: '#ad1457', borderRadius: 16, padding: '14px 20px', maxWidth: 260, boxShadow: '0 2px 8px #f8bbd0' }}>
                  <div style={{ fontWeight: 700, marginBottom: 6, color: '#f06292' }}>AI Girl:</div>
                  <div style={{ fontSize: 16, lineHeight: 1.5 }}>{aiResponse}</div>
                </div>
              </div>
            )}

            <div style={{ marginTop: 28 }}>
              <Text strong style={{ color: '#a259f7', fontSize: 18 }}>Current Message (on-chain):</Text>
              <Card style={{ marginTop: 8, background: '#e1bee7', color: '#4a148c', borderRadius: 12, border: 'none', fontWeight: 600, fontSize: 16 }}>
                {contractMessage}
              </Card>
            </div>
          </div>
        )}
      </Card>
    </main>
  );
}
