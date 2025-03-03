'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessage, resetChat, getChatHistory } from '@/store/chatSlice';
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
  IconButton,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { AppDispatch, RootState } from '@/store';
import OptionButtons from '../components/OptionButtons';
import TypewriterText from '../components/Typewriter';

// Apply motion to Chakra UI components
const MotionBox = motion(Box as any);
const MotionFlex = motion(Flex as any);
const MotionIconButton = motion(IconButton as any);

export default function Home() {
  // Access Redux store and component state
  const dispatch = useDispatch<AppDispatch>();
  const chatState = useSelector((state: RootState) => state.chat);
  const { loading, error } = chatState;
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<Array<{ role: string; content: string }>>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const toast = useToast();

  // Define color variables based on color mode
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const optionsBgColor = useColorModeValue('gray.50', 'gray.800');
  const userBgColor = 'white';
  const userTextColor = 'black';
  const assistantBgColor = 'gray.100';
  const assistantTextColor = 'black';

  // Fetch chat history or start new chat based on login status
  useEffect(() => {
    if (user) {
      const isFreshLogin = sessionStorage.getItem('isFreshLogin') === 'true';
      
      if (isFreshLogin) {
        setLocalMessages([]);
        dispatch(resetChat());
        
      } 
      else {
        const fetchChatHistory = async () => {
          try {
            const history = await dispatch(getChatHistory()).unwrap();
            setLocalMessages(history);
          } catch (error) {
            console.error('Failed to fetch chat history:', error);
            toast({
              title: "Error Loading Chat History",
              description: "Could not load your chat history. Starting fresh chat.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        };
        fetchChatHistory();
      }
    }
  }, [dispatch, user]);

  // Handle scroll events in the chat container
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isAtBottom);
    }
  };

  // Add scroll event listener to the chat container
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
      return () => chatContainer.removeEventListener('scroll', handleScroll);  

    }
  }, []);

  // Scroll to bottom when new messages are added or typing state changes
  useEffect(() => {
    if (chatContainerRef.current && !showScrollButton) {
      scrollToBottom();
    }
  }, [localMessages, isTyping]);

  // Scroll to the bottom of the chat container
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({  

        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'  

      });
    }
  };

  // Handle input changes in the message textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
  };

  // Send a new message to the assistant
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newMessage.trim()) {
      const userMessage = { role: 'user', content: newMessage };
      setLocalMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      setIsTyping(true);
      sessionStorage.removeItem('isFreshLogin'); // Clear the flag
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

  // Handle key down events in the message textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();  

    }
  };

  // Handle option selection from the OptionButtons component
  const handleSelectOption = (option: string) => {
    setCurrentTopic(option);
    setNewMessage(`Let's discuss ${option}`);
  };

  // Start a new chat session
  const handleNewChat = () => {
    dispatch(resetChat());
    setLocalMessages([]);
    setCurrentTopic(null);
    setNewMessage('');
  };

  // Redirect to landing page if user is not logged in
  if (!user) {
    return <LandingPage />;
  }

  return (
    <Box 
      bg={bgColor} 
      color={textColor} 
      height="calc(100vh - 150px - 120px)"
      position="fixed"
      top="70px"
      left="0"
      right="0"
      overflow="hidden"
      zIndex={1}
    >
      <Container maxW="800px" h="100%" position="relative">
        {localMessages.length === 0 ? (
          <Flex direction="column" align="center" justify="center" h="100%" py={8}>
            <VStack spacing={6} mb={8}>
              <Heading size="lg" textAlign="center">Welcome to FinanceGPT</Heading>
              <TypewriterText
                text="How can I help you today?"
                fontSize="xl"
                fontWeight="medium"
                textAlign="center"
              />
            </VStack>

            <Box w="full" maxW="700px">
              <form onSubmit={handleSendMessage}>
                <Flex mb={6}>
                  <Textarea
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message here..."
                    mr={2}
                    rows={1}
                    resize="none"
                    borderRadius="2xl"
                    border="none"
                    boxShadow="1px 1px 1px 2px rgba(0,0,0,0.1)"
                    py={3}
                    _focus={{
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      outline: "none",
                      border: "none"
                    }}
                    _hover={{
                      boxShadow: "0 3px 6px rgba(0,0,0,0.1)"
                    }}
                  />
                  <Button
                    type="submit"
                    colorScheme="blue"
                    bg={accentColor}
                    color="white"
                    isLoading={loading}
                    borderRadius="2xl"
                    px={6}
                  >
                    Send
                  </Button>
                </Flex>
              </form>

              <Box 
                bg={"white"} 
                p={6} 
                borderRadius="2xl" 
              >
                <OptionButtons onSelectOption={handleSelectOption} />
              </Box>
            </Box>
          </Flex>
        ) : (
          <Flex direction="column" h="100%" position="relative">
                <Box 
                  flex={1} 
                  overflowY="auto" 
                  px={2} 
                  ref={chatContainerRef}
                  pb="120px"
                  maxW="100%"
                  width="full"
                  sx={{
                    // Chrome, Safari, and Edge styling
                    '&::-webkit-scrollbar': {
                      width: '8px',
                      background: 'transparent'
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'transparent'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '20px',
                      border: '2px solid transparent',
                      backgroundClip: 'padding-box'
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '20px',
                      border: '2px solid transparent',
                      backgroundClip: 'padding-box'
                    },
                    // Firefox styling
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent'
                  }}
                >
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
                      boxShadow="sm"
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
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor="gray.200"
                >
                  <Flex alignItems="center">
                    <Spinner size="sm" mr={2} />
                    <Text>AI Financial Advisor is typing...</Text>
                  </Flex>
                </MotionFlex>
              )}
            </Box>

            <AnimatePresence>
              {showScrollButton && (
                <MotionIconButton
                  icon={<ChevronDownIcon boxSize={6} />}
                  aria-label="Scroll to bottom"
                  position="fixed"
                  bottom="120px"
                  right="40px"
                  borderRadius="full"
                  boxShadow="lg"
                  onClick={scrollToBottom}
                  colorScheme="blue"
                  size="lg"
                  bg="white"
                  color="gray.600"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "xl"
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  zIndex={999}
                />
              )}
            </AnimatePresence>
            
            <Box 
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              bg="transparent"
              p={1}
              zIndex={1}
              bgColor={"white"}
              borderRadius={"2xl"}
              // boxShadow="0 -10px 20px rgba(0,0,0,0.1)" 
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bg: bgColor,
                opacity: 0.8,
                backdropFilter: 'blur(8px)',
                zIndex: -1
              }}
            >
              <form onSubmit={handleSendMessage} style={{ display: 'flex', width: '100%' }}>
                <Textarea
                  value={newMessage}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message here (Press Enter to send, Shift+Enter for new line)"
                  mr={2}
                  flex={1}
                  rows={2}
                  h={"10"}
                  resize="none"
                  borderRadius="2xl"
                  bg = "white"
                  border="none"
                  boxShadow="1px 1px 1px 2px rgba(0,0,0,0.1)"
                  _focus={{
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    outline: "none",
                    border: "none"
                  }}
                  _hover={{
                    boxShadow: "0 3px 6px rgba(0,0,0,0.1)"
                  }}
                />
                <Button 
                  type="submit" 
                  colorScheme="blue"
                  bg={accentColor}
                  color="white"
                  isLoading={loading}
                  borderRadius="2xl"
                >
                  Send
                </Button>
                <Button 
                  onClick={handleNewChat} 
                  ml={2} 
                  variant="outline" 
                  borderRadius="2xl"
                >
                  New Chat
                </Button>
              </form>
            </Box>
          </Flex>
        )}
        {error && <Text color="red.500" mt={2}>{error}</Text>}
      </Container>
    </Box>
  );
}
