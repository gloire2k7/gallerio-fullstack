import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, List, ListItem, ListItemText, TextField, Button, Grid } from '@mui/material';
import axios from 'axios';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    // TODO: Implement message fetching
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/messages');
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // TODO: Implement message sending
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Messages
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '70vh', overflow: 'auto' }}>
              <List>
                {messages.map((message) => (
                  <ListItem
                    key={message.id}
                    button
                    selected={selectedChat === message.id}
                    onClick={() => setSelectedChat(message.id)}
                  >
                    <ListItemText
                      primary={message.sender.name}
                      secondary={message.preview}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, height: '70vh', display: 'flex', flexDirection: 'column' }}>
              {selectedChat ? (
                <>
                  <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
                    {/* Message history will go here */}
                  </Box>
                  <form onSubmit={handleSendMessage}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                      />
                      <Button type="submit" variant="contained" color="primary">
                        Send
                      </Button>
                    </Box>
                  </form>
                </>
              ) : (
                <Typography variant="body1" color="text.secondary" align="center">
                  Select a conversation to start messaging
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Messages; 