'use client'

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchFinancialAdvice, selectAdvice } from '@/store/financialAdviceSlice';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  Button,
  Text,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { AppDispatch, RootState } from '@/store';

const FinancialAdvice = () => {
  const [question, setQuestion] = useState('');
  const [area, setArea] = useState('general');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [error, setError] = useState('');
  const { advice, loading } = useSelector(selectAdvice);
  const { token } = useSelector((state: RootState) => state.auth);
  const toast = useToast();

  const buttonColor = useColorModeValue('white', 'brand');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      await dispatch(fetchFinancialAdvice({ question, area })).unwrap();
    } catch (err) {
      console.error('Error fetching financial advice:', err);
      setError('We\'re having trouble generating advice right now. Please try again later or contact support if the problem persists.');
      toast({
        title: "Error",
        description: "Failed to fetch financial advice. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={10}>
      <Heading mb={6}>AI-Powered Financial Advice</Heading>
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel htmlFor="area">Area of Advice:</FormLabel>
              <Select
                id="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              >
                <option value="general">General</option>
                <option value="budgeting">Budgeting</option>
                <option value="investing">Investing</option>
                <option value="debt">Debt Management</option>
                <option value="savings">Savings</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="question">Your Financial Question:</FormLabel>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Your Financial Question"
                required
              />
            </FormControl>
            <Button 
              type="submit" 
              colorScheme="brand"
              bg="black"
              color={buttonColor}
              isLoading={loading}
            >
              Get Advice
            </Button>
          </VStack>
        </form>
      </Box>

      {advice && (
        <Box mt={8} p={6} borderRadius="lg" boxShadow="md" bg="white">
          <Heading size="md" mb={4}>Your Personalized Advice</Heading>
          <Box>
            <ReactMarkdown components={{
              h1: (props) => <Heading as="h1" size="xl" my={4} {...props} />,
              h2: (props) => <Heading as="h2" size="lg" my={3} {...props} />,
              h3: (props) => <Heading as="h3" size="md" my={2} {...props} />,
              p: (props) => <Text mb={3} {...props} />,
              ul: (props) => <Box as="ul" pl={4} mb={3} {...props} />,
              ol: (props) => <Box as="ol" pl={4} mb={3} {...props} />,
              li: (props) => <Box as="li" mb={1} {...props} />,
            }}>
              {advice}
            </ReactMarkdown>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default FinancialAdvice;