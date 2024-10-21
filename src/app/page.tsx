'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessage, getChatHistory, resetChat } from '@/store/chatSlice';
import { useToast } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import LandingPage from '../components/LandingPage';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Textarea,
  Button,
  Flex,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppDispatch, RootState } from '@/store';
import OptionButtons from '../components/OptionButtons';
import TypewriterText from '../components/Typewriter';

const MotionBox = motion(Box as any);
const MotionFlex = motion(Flex as any);

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const chatState = useSelector((state: RootState) => state.chat);
  const { loading, error } = chatState;
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<Array<{ role: string; content: string }>>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const userBgColor = 'white';
  const userTextColor = 'black';
  const assistantBgColor = 'gray.100';
  const assistantTextColor = 'black';

  useEffect(() => {
    if (user) {
      const fetchChatHistory = async () => {
        const history = await dispatch(getChatHistory()).unwrap();
        setLocalMessages(history);
      };
      fetchChatHistory();
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [localMessages, isTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newMessage.trim()) {
      const userMessage = { role: 'user', content: newMessage };
      setLocalMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      setIsTyping(true);
      
      try {
        const response = await dispatch(sendMessage({ message: userMessage.content, area: currentTopic || 'general' })).unwrap();
        setIsTyping(false);
        setLocalMessages(prev => [...prev, { role: 'assistant', content: response }]);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectOption = (option: string) => {
    setCurrentTopic(option);
    setNewMessage(`Let's discuss ${option}`);
  };

  const handleNewChat = () => {
    dispatch(resetChat());
    setLocalMessages([]);
    setCurrentTopic(null);
    setNewMessage('');
  };

  if (!user) {
    return <LandingPage />;
  }
  return (
    <Box bg={bgColor} color={textColor} height="80vh" display="flex" flexDirection="column">
      <Container maxW="800px" height="100%" py={4} display="flex" flexDirection="column">
        <Flex direction="column" align="center" mb={4}>
          <Heading as="h1" size="lg" textAlign="center">Welcome to Your Financial AI Assistant</Heading>
          <Text mt={2} textAlign="center">Ask me about budgeting, investing, financial planning, or any money-related topics!</Text>
        </Flex>
        
        <Flex direction="column" flex={1} borderRadius="lg" borderWidth="3px" borderColor={useColorModeValue('gray.200', 'gray.700')} overflow="hidden">
          <Box flex={1} overflowY="auto" p={4} ref={chatContainerRef}>
            {localMessages.length === 0 ? (
              <Flex direction="column" justify="center" align="center" height="100%">
                <MotionBox
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <VStack spacing={8}>
                    <TypewriterText
                      text="How can I help you today?"
                      fontSize="2xl"
                      fontWeight="bold"
                      textAlign="center"
                    />
                    <OptionButtons onSelectOption={handleSelectOption} />
                  </VStack>
                </MotionBox>
              </Flex>
            ) : (
              <AnimatePresence>
                {localMessages.map((message, index) => (
                  <MotionFlex
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    justifyContent={message.role === 'user' ? 'flex-end' : 'flex-start'}
                    mb={4}
                  >
                    <Flex
                      bg={message.role === 'user' ? userBgColor : assistantBgColor}
                      color={message.role === 'user' ? userTextColor : assistantTextColor}
                      borderRadius="2xl"
                      py={2}
                      px={4}
                      maxWidth="70%"
                      boxShadow="md"
                      borderWidth="1px"
                      borderColor={message.role === 'user' ? 'gray.300' : 'gray.200'}
                      flexDirection="column"
                    >
                      {message.role === 'user' ? (
                        <Text wordBreak="break-word">{message.content}</Text>
                      ) : (
                        <Box>
                          <ReactMarkdown components={{
                            p: (props) => <Text mb={2} {...props} />,
                            ul: (props) => <Box as="ul" pl={4} mb={2} {...props} />,
                            ol: (props) => <Box as="ol" pl={4} mb={2} {...props} />,
                            li: (props) => <Box as="li" mb={1} {...props} />,
                          }}>
                            {message.content}
                          </ReactMarkdown>
                        </Box>
                      )}
                    </Flex>
                  </MotionFlex>
                ))}
              </AnimatePresence>
            )}
            {isTyping && (
              <MotionFlex
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                alignSelf="flex-start"
                bg={assistantBgColor}
                color={assistantTextColor}
                borderRadius="2xl"
                py={2}
                px={4}
                mb={4}
                maxWidth="70%"
                boxShadow="md"
                borderWidth="1px"
                borderColor="gray.200"
              >
                <Flex alignItems="center">
                  <Spinner size="sm" mr={2} />
                  <Text>AI Financial Advisor is typing...</Text>
                </Flex>
              </MotionFlex>
            )}
            {error && <Text color="red.500">{error}</Text>}
          </Box>
          
          <Flex p={3} borderTop="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
            <form onSubmit={handleSendMessage} style={{ display: 'flex', width: '100%' }}>
              <Textarea
                value={newMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here (Press Enter to send, Shift+Enter for new line)"
                mr={2}
                flex={1}
                rows={1}
                resize="none"
              />
              <Button 
                type="submit" 
                colorScheme="blue"
                bg={accentColor}
                color="white"
                isLoading={loading}
              >
                Send
              </Button>
              {localMessages.length > 0 && (
                <Button 
                  onClick={handleNewChat} 
                  ml={2} 
                  variant="outline" 
                  borderRadius="md"
                >
                  New Chat
                </Button>
              )}
            </form>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}