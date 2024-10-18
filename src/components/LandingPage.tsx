import React from 'react';
import Link from 'next/link';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  Flex,
  VStack,
  SimpleGrid,
} from '@chakra-ui/react';
import { FaBrain, FaChartLine, FaRegHandshake } from 'react-icons/fa';

export default function LandingPage() {
  return (
    <>
      <Container maxW={'7xl'} py={16} textAlign="center">
        <Stack spacing={6} align="center" justify="center">
          <Heading fontSize={{ base: '3xl', md: '5xl' }} fontWeight="bold" color="black">
            Manage Your Finances <br />
            <Text as="span" color="black">
              with AI Assistance
            </Text>
          </Heading>
          <Text color={'gray.600'} fontSize={{ base: 'md', md: 'lg' }} maxW="2xl">
            AI Finance Advisor helps you take control of your financial future. Get personalized advice,
            set goals, and track your progress with the power of artificial intelligence.
          </Text>
          <Link href="/register" passHref>
            <Button
              as="a"
              size="lg"
              bg="black"
              color="white"
              px={8}
              py={6}
              fontSize={'xl'}
              _hover={{
                bg: 'gray.700',
              }}
              transition="all 0.3s ease"
            >
              Get Started
            </Button>
          </Link>
        </Stack>
      </Container>

      {/* Features Section */}
      <Container maxW={'7xl'} py={16}>
        <Heading textAlign="center" mb={12} fontSize="3xl" color="black">
          Key Features
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <FeatureCard
            title="AI-Powered Financial Advice"
            description="Get personalized recommendations based on your unique financial situation."
            icon={FaBrain}
          />
          <FeatureCard
            title="Goal-Based Planning"
            description="Set financial goals and receive AI-generated strategies to achieve them."
            icon={FaChartLine}
          />
          <FeatureCard
            title="Financial Health Tracking"
            description="Monitor your financial health with intuitive dashboards and insights."
            icon={FaRegHandshake}
          />
        </SimpleGrid>
      </Container>

      {/* Pricing Section */}
      <Container maxW={'7xl'} py={16} textAlign="center">
        <Heading fontSize="3xl" mb={6} color="black">
          Pricing
        </Heading>
        <Text color={'gray.600'} mb={12}>
          Choose a plan that fits your needs. Start free, and upgrade as you grow.
        </Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <PricingCard
            title="Basic"
            price="$0"
            features={['AI Recommendations', 'Goal Tracking', 'Financial Reports']}
            buttonText="Get Started"
            buttonLink="/register"
          />
          <PricingCard
            title="Pro"
            price="$29/month"
            features={['All Basic Features', 'Personalized Planning', 'Priority Support']}
            buttonText="Upgrade Now"
            buttonLink="/register"
          />
          <PricingCard
            title="Enterprise"
            price="Contact Us"
            features={['Custom Integrations', 'Dedicated Account Manager', 'Advanced Analytics']}
            buttonText="Contact Sales"
            buttonLink="/contact"
          />
        </SimpleGrid>
      </Container>
    </>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: React.ElementType }) {
  return (
    <Box
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
      textAlign="center"
      bg="white"
      color="black"
    >
      <Icon as={icon} w={12} h={12} mb={4} color="black" />
      <Heading size="md" mb={2}>
        {title}
      </Heading>
      <Text fontSize="sm" color={'gray.600'}>
        {description}
      </Text>
    </Box>
  );
}

function PricingCard({ title, price, features, buttonText, buttonLink }: { 
  title: string; 
  price: string; 
  features: string[]; 
  buttonText: string; 
  buttonLink: string; 
}) {
  return (
    <Box
      p={8}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
      textAlign="center"
      bg="white"
      color="black"
    >
      <Heading size="lg" mb={4}>
        {title}
      </Heading>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        {price}
      </Text>
      <VStack spacing={3} mb={6}>
        {features.map((feature, index) => (
          <Text key={index} fontSize="sm" color={'gray.600'}>
            {feature}
          </Text>
        ))}
      </VStack>
      <Link href={buttonLink} passHref>
        <Button as="a" bg="black" color="white" size="lg" _hover={{ bg: 'gray.700' }}>
          {buttonText}
        </Button>
      </Link>
    </Box>
  );
}
