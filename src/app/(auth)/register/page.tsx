'use client'

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/api';
import { setCredentials } from '@/store/authSlice';
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
  Text,
  Flex,
} from '@chakra-ui/react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { AppDispatch } from '@/store';

const Register = () => {
  // State variables for form inputs and loading state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const toast = useToast();

  // Handles form submission for user registration.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await register(email, email, password);
      if (response && response.user && response.token) {
        toast({
          title: 'Account created.',
          description: "We've created your account for you.",
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Dispatch action to store user credentials in Redux store
        dispatch(setCredentials({
          user: { 
            id: response.user.id,
            username: response.user.username, 
            email: response.user.email,
            onboardingCompleted: response.user.onboardingCompleted
          },
          token: response.token
        }));

        router.push('/onboarding'); 
      } else {
        throw new Error('Invalid response structure from server');
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast({
        title: 'Sign Up Failed',
        description: (err as Error).message || 'An error occurred during registration',
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
      {/* Registration form container */}
      <Box maxWidth="400px" width="100%" p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl" textAlign="center">Start Your Financial Makeover Today!</Heading>
          <Text textAlign="center" fontSize="lg" fontStyle="italic" color="gray.600">
            We’re here to help—one simple step at a time.
          </Text>

          {/* Registration form */}
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
                  <InputRightElement width="3rem">
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
              <FormControl id="confirm-password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
              </FormControl>

              <Button
                type="submit"
                color="black"
                width="full"
                mt={4}
                isLoading={isLoading}
                loadingText="Signing up"
              >
                Sign Up
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Register;