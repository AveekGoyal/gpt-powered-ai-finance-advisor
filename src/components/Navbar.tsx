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

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleNavigation = (path: string) => {
    if (user && !user.onboardingCompleted) {
      toast({
        title: "Onboarding Required",
        description: "Please complete your onboarding before accessing this feature.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      router.push('/onboarding');
    } else {
      router.push(path);
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
        justify={'space-between'}
        w="100%"
      >
        <Heading
          as={Link}
          href={'/'}
          fontSize={'2xl'}
          fontFamily={'heading'}
          color={useColorModeValue('gray.800', 'white')}
          fontWeight={'bold'}
        >
          FinanceGPT
        </Heading>
        <HStack spacing={4}>
          {user && (
            <>
              <Button
                onClick={() => handleNavigation('/financial-snapshot')}
                fontSize={'sm'}
                fontWeight={400}
                variant={'ghost'}
              >
                Snapshot
              </Button>
              <Button
                onClick={() => handleNavigation('/goals')}
                fontSize={'sm'}
                fontWeight={400}
                variant={'ghost'}
              >
                Goals
              </Button>
              <Button
                onClick={() => handleNavigation('/profile')}
                fontSize={'sm'}
                fontWeight={400}
                variant={'ghost'}
              >
                Profile
              </Button>
              <Button
                onClick={handleLogout}
                fontSize={'sm'}
                fontWeight={400}
                variant={'ghost'}
              >
                Logout
              </Button>
            </>
          )}
          {!user && (
            <>
              <Button
                as={Link}
                href="/login"
                fontSize={'sm'}
                fontWeight={400}
                variant={'ghost'}
              >
                Sign In
              </Button>
              <Button
                as={Link}
                href="/register"
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