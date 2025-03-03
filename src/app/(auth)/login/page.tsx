'use client'

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setCredentials } from '@/store/authSlice';
import { login } from '@/lib/api';
import { jwtDecode } from 'jwt-decode';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Flex,
  Text,
} from '@chakra-ui/react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { AppDispatch } from '@/store';

const Login = () => {
  // State variables for email, password, showPassword, isLoading
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const toast = useToast();

  // Handles form submission for user login.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await login(email, password);
      const decodedToken = jwtDecode(response.token) as { userId: string; username: string };
      
      // Prepare user data for Redux store
      const userData = {
        token: response.token,
        user: {
          ...response.user,
          id: decodedToken.userId,
          username: decodedToken.username,
          email: email
        }
      };
      dispatch(setCredentials(userData));
      
      // Set session storage flag for fresh login
      sessionStorage.setItem('isFreshLogin', 'true');
      router.push('/'); 
    } catch (err) {
      console.error('Login error:', err);
      toast({
        title: 'Login Failed',
        description: (err as Error).message || 'An error occurred during login',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Main flex container for page layout
    <Flex minHeight="calc(100vh - 60px - 120px)" alignItems="center" justifyContent="center">
      {/* Login form container */}
      <Box maxWidth="400px" width="100%" p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl" textAlign="center" mb={2}>Welcome Back</Heading>
          <Text textAlign="center" fontSize="lg" fontStyle="italic" color="gray.600" mt={-5}>
            Let's Tackle Those Finances!
          </Text>

          {/* Login form */}
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      h="1.75rem"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      icon={showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                color="black"
                width="full"
                mt={4}
                isLoading={isLoading}
                loadingText="Logging in"
              >
                Log In
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Login;