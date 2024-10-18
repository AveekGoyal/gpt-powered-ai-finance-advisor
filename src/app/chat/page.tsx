// File: src/app/chat/page.tsx

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
  const [localMessages, setLocalMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const buttonColor = useColorModeValue('white', 'brand');

  useEffect(() => {
    dispatch(getChatHistory());
  }, [dispatch]);

  useEffect(() => {
    if (messages.length > 0 && localMessages.length === 0) {
      setLocalMessages(messages);
    }
  }, [messages, localMessages.length]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [localMessages, isTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

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
        const response = await dispatch(sendMessage(newMessage)).unwrap();
  
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
    <Container maxW="container.xl" py={10}>
      <VStack spacing={4} align="stretch" h="70vh">
        <Heading>AI Financial Advisor</Heading>
        <Text>Ask me about financial planning, budgeting, or improving your financial health.</Text>
        <Box flex={1} overflowY="auto" borderWidth={1} borderRadius="md" p={4} bg={bgColor} ref={chatContainerRef}>
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