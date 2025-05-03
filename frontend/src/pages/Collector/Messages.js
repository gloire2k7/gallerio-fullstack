import React, { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import { Reply as ReplyIcon, Delete as DeleteIcon, Send as SendIcon } from '@mui/icons-material';
import { collectorService } from '../../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import UserAutocomplete from '../../components/UserAutocomplete';
import Conversation from '../../components/Conversation';
import { useSelector } from 'react-redux';

const Messages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [newMessage, setNewMessage] = useState({
    recipient: null,
    content: ''
  });
  const [conversations, setConversations] = useState([]);

  const user = useSelector(state => state.user?.user) || JSON.parse(localStorage.getItem('user')) || null;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMessages();
    fetchConversations();
  }, [user, navigate]);

  const fetchMessages = async () => {
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
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await collectorService.getMessages();
      // Get unique users from messages (both sent and received)
      const uniqueUsers = new Map();
      response.forEach(message => {
        const otherUser = message.sender.id === user.id ? message.recipient : message.sender;
        if (!uniqueUsers.has(otherUser.id)) {
          uniqueUsers.set(otherUser.id, {
            user: otherUser,
            lastMessage: message,
            unread: message.recipient.id === user.id && !message.read
          });
        }
      });
      setConversations(Array.from(uniqueUsers.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

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

  const handleSendNewMessage = async () => {
    if (!newMessage.recipient || !newMessage.content.trim()) return;
    try {
      await collectorService.sendMessage(newMessage.recipient.id, newMessage.content);
      setNewMessage({ recipient: null, content: '' });
      fetchMessages();
      setActiveTab(0); // Switch back to inbox
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
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

  const handleConversationSelect = (conversation) => {
    setSelectedMessage(conversation.lastMessage);
    setActiveTab(0);
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

      <Paper className="mb-4">
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Conversations" />
          <Tab label="New Message" />
        </Tabs>
      </Paper>

      {activeTab === 0 ? (
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Paper className="p-4 md:col-span-1 bg-cream">
            <Typography variant="h6" className="text-brown mb-4">
              Conversations
            </Typography>
            <List>
              {conversations.map((conversation) => (
                <React.Fragment key={conversation.user.id}>
                  <ListItem
                    button
                    selected={selectedMessage?.sender.id === conversation.user.id || 
                             selectedMessage?.recipient.id === conversation.user.id}
                    onClick={() => handleConversationSelect(conversation)}
                    className={conversation.unread ? 'bg-coral/10' : ''}
                  >
                    <ListItemAvatar>
                      <Badge
                        color="error"
                        variant="dot"
                        invisible={!conversation.unread}
                      >
                        <Avatar>
                          {`${conversation.user.firstName?.[0] || ''}${conversation.user.lastName?.[0] || ''}`}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${conversation.user.firstName} ${conversation.user.lastName}`}
                      secondary={conversation.lastMessage.content}
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
              <Conversation
                userId={selectedMessage.sender.id === user.id ? selectedMessage.recipient.id : selectedMessage.sender.id}
                currentUser={user}
                isArtist={false}
              />
            ) : (
              <Typography className="text-brown/70 text-center">
                Select a conversation to view
              </Typography>
            )}
          </Paper>
        </Box>
      ) : (
        <Paper className="p-4 bg-cream">
          <Box className="space-y-4">
            <UserAutocomplete
              value={newMessage.recipient}
              onChange={(user) => setNewMessage({ ...newMessage, recipient: user })}
              label="Recipient"
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Message"
              value={newMessage.content}
              onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
              placeholder="Write your message..."
              className="text-brown"
            />
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleSendNewMessage}
              className="bg-coral hover:bg-salmon text-cream"
            >
              Send Message
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default Messages; 