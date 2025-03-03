'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessage, getChatHistory } from '@/store/chatSlice';
import { useToast } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  Container,
  Heading,
  Flex,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { AppDispatch, RootState } from '@/store';

export default function Chatbot() {
  const dispatch = useDispatch<AppDispatch>();
  const chatState = useSelector((state: RootState) => state.chat);
  const { messages, loading, error } = chatState;
  const [newMessage, setNewMessage] = useState('');

  // State for managing messages displayed in the chat
  const [localMessages, setLocalMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const buttonColor = useColorModeValue('white', 'brand');

  useEffect(() => {
    dispatch(getChatHistory());
  }, [dispatch]);

  useEffect(() => {
    // Initialize local messages with fetched messages
    if (messages.length > 0 && localMessages.length === 0) {
      setLocalMessages(messages);
    }
  }, [messages, localMessages.length]);

  useEffect(() => {
    // Scroll to the bottom of the chat container when new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [localMessages, isTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  // Handles sending a new message to the chatbot.
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const userMessage = {
        role: 'user',
        content: newMessage,
      };
  
      setLocalMessages((prevMessages) => [...prevMessages, userMessage]);
      setNewMessage('');
      setIsTyping(true);
      
      try {
        // Dispatch action to send message and await response
        const response = await dispatch(sendMessage({ message: newMessage, area: 'chat' })).unwrap();
        setIsTyping(false);
        const botMessage = {
          role: 'assistant',
          content: response,
        };
        
        setLocalMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
        setIsTyping(false);
        toast({
          title: "Message Not Sent",
          description: "We couldn't send your message. Please try again later or refresh the page.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const userBgColor = useColorModeValue('blue.100', 'blue.700');
  const assistantBgColor = useColorModeValue('green.100', 'green.700');

  return (
    // Main container for the chatbot component
    <Container maxW="container.xl" py={10} minH="calc(100vh - 188px - 120px)">
      <VStack spacing={4} align="stretch" h="calc(100vh - 188px - 160px)">
        <Heading>AI Financial Advisor</Heading>
        <Text>Ask me about financial planning, budgeting, or improving your financial health.</Text>

        {/* Chat container */}
        <Box flex={1} overflowY="auto" borderWidth={1} borderRadius="md" p={4} bg={bgColor} ref={chatContainerRef}>
          {/* Render chat messages */}
          {localMessages.map((msg, index) => (
            <Flex
              key={index}
              justifyContent={msg.role === 'user' ? 'flex-end' : 'flex-start'}
              mb={2}
            >
              <Box
                bg={msg.role === 'user' ? userBgColor : assistantBgColor}
                p={3}
                borderRadius="md"
                maxW="80%"
              >
                {msg.role === 'user' ? (
                  <Text>{msg.content}</Text>
                ) : (
                  // Render AI responses with markdown support
                  <ReactMarkdown components={{
                    p: (props) => <Text mb={2} {...props} />,
                    ul: (props) => <Box as="ul" pl={4} mb={2} {...props} />,
                    ol: (props) => <Box as="ol" pl={4} mb={2} {...props} />,
                    li: (props) => <Box as="li" mb={1} {...props} />,
                  }}>
                    {msg.content}
                  </ReactMarkdown>
                )}
              </Box>
            </Flex>
          ))}

          {/* "Typing" indicator */}
          {isTyping && (
            <Flex justifyContent="flex-start" mb={2}>
              <Box
                bg={assistantBgColor}
                p={3}
                borderRadius="md"
                maxW="80%"
              >
                <Flex alignItems="center">
                  <Spinner size="sm" mr={2} />
                  <Text>AI Financial Advisor is typing...</Text>
                </Flex>
              </Box>
            </Flex>
          )}

          {error && <Text color="red.500">{error}</Text>}
        </Box>

        {/* Input and send button */}
        <form onSubmit={handleSendMessage}>
          <Flex>
            <Input
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Type your message here..."
              mr={2}
            />
            <Button 
              type="submit" 
              colorScheme="brand"
              bg="brand.primary"
              color={buttonColor}
              isLoading={loading}
            >
              Send
            </Button>
          </Flex>
        </form>
      </VStack>
    </Container>
  );
}