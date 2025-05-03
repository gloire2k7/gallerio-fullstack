import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Paper, TextField, Button, Avatar, CircularProgress } from '@mui/material';
import { artistService, collectorService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Conversation = ({ userId, currentUser, isArtist }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const service = isArtist ? artistService : collectorService;
  const [prevMessagesLength, setPrevMessagesLength] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    fetchConversation();
    const interval = setInterval(fetchConversation, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [userId, currentUser, navigate]);

  const fetchConversation = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError('');
    try {
      const data = await service.getConversation(userId);
      setMessages(data);
    } catch (err) {
      setError('Failed to load conversation.');
      console.error('Error fetching conversation:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (messages.length > prevMessagesLength) {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setPrevMessagesLength(messages.length);
  }, [messages.length, prevMessagesLength]);

  const handleSend = async () => {
    if (!newMessage.trim() || !currentUser) return;
    try {
      await service.sendMessage(userId, newMessage);
      setNewMessage('');
      fetchConversation();
    } catch (err) {
      setError('Failed to send message.');
      console.error('Error sending message:', err);
    }
  };

  if (!currentUser) {
    return null;
  }

  if (loading && messages.length === 0) {
    return <Box className="flex justify-center items-center h-64"><CircularProgress /></Box>;
  }

  if (error) {
    return (
      <Box className="p-4">
        <Typography color="error">{error}</Typography>
        <Button onClick={fetchConversation} className="mt-2">
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box className="flex flex-col h-[60vh]">
      <Box className="flex-1 overflow-y-auto px-2 py-2 bg-cream rounded" style={{ minHeight: 0 }}>
        {messages.length === 0 ? (
          <Typography className="text-brown/70 text-center mt-8">No messages yet.</Typography>
        ) : (
          messages.map((msg) => {
            const isSent = msg.sender.id === currentUser.id;
            return (
              <Box key={msg.id} className={`flex mb-2 ${isSent ? 'justify-end' : 'justify-start'}`}>
                {!isSent && (
                  <Avatar
                    src={msg.sender.profilePhoto || undefined}
                    alt={msg.sender.firstName}
                    sx={{ width: 32, height: 32, mr: 1 }}
                  />
                )}
                <Paper
                  elevation={2}
                  className={`px-3 py-2 max-w-[70%] ${isSent ? 'bg-coral text-cream' : 'bg-white text-brown'}`}
                  style={{ borderRadius: 16 }}
                >
                  <Typography variant="body2" className="font-semibold">
                    {isSent ? 'You' : `${msg.sender.firstName} ${msg.sender.lastName}`}
                  </Typography>
                  <Typography variant="body1" className="whitespace-pre-wrap">
                    {msg.content}
                  </Typography>
                  <Typography variant="caption" className="block mt-1 opacity-60">
                    {new Date(msg.createdAt).toLocaleString()}
                  </Typography>
                </Paper>
                {isSent && (
                  <Avatar
                    src={currentUser.profilePhoto || undefined}
                    alt={currentUser.firstName}
                    sx={{ width: 32, height: 32, ml: 1 }}
                  />
                )}
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Box>
      <Box className="flex items-center gap-2 mt-2">
        <TextField
          fullWidth
          multiline
          minRows={1}
          maxRows={4}
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          variant="outlined"
          className="bg-white rounded"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className="bg-coral hover:bg-salmon text-cream"
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Conversation; 