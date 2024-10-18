'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';
import { Box, Flex, Heading, Button, HStack, useColorModeValue, useToast } from '@chakra-ui/react';
import { RootState, AppDispatch } from '@/store';

export default function NavBar() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const toast = useToast();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const handleProfileClick = () => {
    if (user && !user.onboardingCompleted) {
      toast({
        title: "Onboarding Required",
        description: "Please complete your onboarding before accessing your profile.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      router.push('/onboarding');
    } else {
      router.push('/profile');
    }
  };

  return (
    <Box w="100%">
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4, md: 60 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
        justify={'center'}
        w="100%"
      >
        <Flex flex={1}></Flex>

        <Heading 
          as={Link}
          href={user ? '/' : '/'}
          textAlign={'center'}
          fontSize={'2xl'} 
          fontFamily={'heading'}
          color={useColorModeValue('gray.800', 'white')}
          fontWeight={'bold'}
        >
          AI Finance Advisor
        </Heading>

        <HStack spacing={8} flex={1} justify="flex-end">
          {user ? ( 
            <>
              <Button
                onClick={handleProfileClick}
                fontSize={'sm'}
                fontWeight={400}
                variant={'link'}
              >
                Profile
              </Button>
              <Button
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'black'}
                onClick={handleLogout}
                _hover={{
                  bg: 'gray.700',
                }}
              >
                Logout
              </Button>
            </>
          ) : ( 
            <>
              <Button
                as={Link}
                href="/login"
                fontSize={'sm'}
                fontWeight={400}
                variant={'link'}
              >
                Sign In
              </Button>
              <Button
                as={Link}
                href="/register"
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'black'}
                _hover={{
                  bg: 'gray.700',
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}