import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Divider,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import { Reply as ReplyIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { collectorService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Messages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await collectorService.getMessages();
      setMessages(response);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to fetch messages. Please try again.');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleReply = async () => {
    if (!selectedMessage || !reply.trim()) return;

    try {
      await collectorService.replyToMessage(selectedMessage.id, reply);
      setReply('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending reply:', error);
      setError('Failed to send reply. Please try again.');
    }
  };

  const handleDelete = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await collectorService.deleteMessage(messageId);
        fetchMessages();
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null);
        }
      } catch (error) {
        console.error('Error deleting message:', error);
        setError('Failed to delete message. Please try again.');
      }
    }
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" className="text-brown mb-6">
        Messages
      </Typography>

      {error && (
        <Box className="mb-4">
          <Typography className="text-red-500">{error}</Typography>
        </Box>
      )}

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Paper className="p-4 md:col-span-1 bg-cream">
            <Typography variant="h6" className="text-brown mb-4">
              Inbox
            </Typography>
            <List>
              {messages.map((message) => (
                <React.Fragment key={message.id}>
                  <ListItem
                    button
                    selected={selectedMessage?.id === message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={message.unread ? 'bg-coral/10' : ''}
                  >
                    <ListItemAvatar>
                      <Avatar>{message.sender.name[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={message.sender.name}
                      secondary={message.subject}
                      className="text-brown"
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>

          <Paper className="p-4 md:col-span-2 bg-cream">
            {selectedMessage ? (
              <Box>
                <Box className="flex justify-between items-start mb-4">
                  <Box>
                    <Typography variant="h6" className="text-brown">
                      {selectedMessage.subject}
                    </Typography>
                    <Typography variant="subtitle2" className="text-brown/70">
                      From: {selectedMessage.sender.name}
                    </Typography>
                    <Typography variant="subtitle2" className="text-brown/70">
                      Date: {new Date(selectedMessage.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="text-brown"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <Typography className="text-brown mb-4 whitespace-pre-wrap">
                  {selectedMessage.content}
                </Typography>

                <Divider className="my-4" />

                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Write your reply..."
                    className="mb-4"
                  />
                  <Button
                    variant="contained"
                    startIcon={<ReplyIcon />}
                    onClick={handleReply}
                    className="bg-coral hover:bg-salmon text-cream"
                  >
                    Send Reply
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography className="text-brown/70 text-center">
                Select a message to view
              </Typography>
            )}
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default Messages; 