'use client'

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Icon,
  Text,
  Stack,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { FaChartLine, FaRegLightbulb, FaBullseye, FaRobot } from 'react-icons/fa';
import { RootState } from '@/store';
import LandingPage from '@/components/LandingPage';

interface FeatureProps {
  title: string;
  text: string;
  icon: React.ElementType;
  onClick: () => void;
}

const Feature: React.FC<FeatureProps> = ({ title, text, icon, onClick }) => {
  return (
    <Stack
      align={'center'}
      justify={'center'}
      rounded={'xl'}
      bg={'white'}
      boxShadow={'lg'}
      p={6}
      cursor="pointer"
      onClick={onClick}
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'xl',
      }}
    >
      <Icon as={icon} w={10} h={10} color={'brand.primary'} />
      <Text fontWeight={600}>{title}</Text>
      <Text color={'gray.600'} align={'center'}>{text}</Text>
    </Stack>
  );
};

export default function Home() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const toast = useToast();

  const features = [
    {
      title: 'Financial Snapshot',
      text: 'Get a clear picture of your current financial situation.',
      icon: FaChartLine,
      path: '/financial-snapshot',
    },
    {
      title: 'AI-Powered Advice',
      text: 'Receive personalized financial recommendations.',
      icon: FaRegLightbulb,
      path: '/financial-advice',
    },
    {
      title: 'Goal-Based Planning',
      text: 'Set and track your financial goals with AI assistance.',
      icon: FaBullseye,
      path: '/goals',
    },
    {
      title: 'AI Chatbot',
      text: 'Get instant answers to your financial questions.',
      icon: FaRobot,
      path: '/chat',
    },
  ];

  const handleFeatureClick = (path: string) => {
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

  if (!user) {
    return <LandingPage />;
  }

  return (
    <Box>
      <Container maxW={'5xl'} py={12}>
        <VStack spacing={2} textAlign="center">
          <Heading as="h1" fontSize="4xl">
            Welcome, {user.username}!
          </Heading>
          <Text fontSize="lg" color={'gray.500'}>
            Manage your finances and get personalized advice with AI assistance.
          </Text>
          {!user.onboardingCompleted && (
            <Text color={'red.500'} fontWeight="bold">
              Please complete your onboarding to access all features.
            </Text>
          )}
        </VStack>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} mt={10}>
          {features.map((feature, index) => (
            <Feature
              key={index}
              title={feature.title}
              text={feature.text}
              icon={feature.icon}
              onClick={() => handleFeatureClick(feature.path)}
            />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}