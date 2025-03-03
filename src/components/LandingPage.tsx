import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
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
  useColorModeValue,
  Avatar,
  chakra,
  shouldForwardProp,
} from '@chakra-ui/react';
import { FaBrain, FaChartLine, FaRegHandshake, FaQuoteLeft, FaRobot } from 'react-icons/fa';
import TypewriterComponent from 'typewriter-effect';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => shouldForwardProp(prop),
});

const MotionFlex = chakra(motion.div, {
  shouldForwardProp: (prop) => shouldForwardProp(prop),
  baseStyle: {
    display: 'flex',
    flexDirection: 'column',
  },
});

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const fadeInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
};

const fadeInScale = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
};

const buttonHover = {
  scale: 1.05,
  transition: {
    duration: 0.2,
  },
};

const circleVariants = {
  initial: { pathLength: 0 },
  animate: {
    pathLength: 1,
    transition: {
      duration: 4,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 1
    }
  }
};

const graphVariants = {
  initial: { pathLength: 0 },
  animate: {
    pathLength: 1,
    transition: {
      duration: 4,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 1
    }
  }
};

const stabilityTextVariants = {
  initial: { opacity: 0, y: 10 },
  animate: (i: number) => ({
    opacity: [0, 1, 1, 0],
    y: [10, 0, 0, -10],
    transition: {
      duration: 4,
      delay: i * 1.3,
      repeat: Infinity,
      repeatDelay: 1
    }
  })
};

const candleVariants = {
  initial: { scaleY: 0 },
  animate: (i: number) => ({
    scaleY: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      repeat: Infinity,
      repeatType: "reverse",
      repeatDelay: 1
    }
  })
};

const lineVariants = {
  initial: { pathLength: 0 },
  animate: {
    pathLength: 1,
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

const dotVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: 1
    }
  }
};

const numberVariants = {
  initial: { opacity: 0, y: 10 },
  animate: (i: number) => ({
    opacity: [0, 1, 1, 0],
    y: [10, 0, 0, -10],
    transition: {
      duration: 3,
      delay: i * 0.2,
      repeat: Infinity,
      times: [0, 0.1, 0.9, 1]
    }
  })
};

const robotVariants = {
  initial: { scale: 0, y: 10 },
  animate: {
    scale: 1,
    y: [0, -5, 0],
    transition: {
      scale: { duration: 0.5 },
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  }
};

const featureCardVariants = {
  initial: { y: 20, opacity: 0 },
  animate: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const iconVariants = {
  initial: { scale: 0.5, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.2,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

const reviews = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    content: "This AI financial advisor has transformed how I manage my business finances. The personalized advice is invaluable.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=80"
  },
  {
    name: "Michael Chen",
    role: "Investment Analyst",
    content: "The AI's ability to analyze market trends and provide actionable insights is impressive. It's like having a personal financial analyst.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=80"
  },
  {
    name: "Emily Rodriguez",
    role: "Freelancer",
    content: "Managing irregular income was always challenging, but this platform makes it easy to plan and save effectively.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=80"
  }
];

export default function LandingPage() {
  const bgGradient = useColorModeValue(
    'linear(to-r, white, gray.50)',
    'linear(to-r, gray.900, black)'
  );
  
  return (
    <Box bgGradient={bgGradient}>
      {/* Hero Section */}
      <Container maxW={'7xl'} py={20}>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={10}
          align="center"
          justify="space-between"
        >
          <MotionFlex
            variants={fadeInLeft}
            initial="initial"
            animate="animate"
            maxW={{ base: 'full', md: '2xl' }}
          >
            <Heading 
              fontSize={{ base: '3xl', md: '5xl' }} 
              fontWeight="bold"
              lineHeight="1.2"
              mb={4}
            >
              <TypewriterComponent
                options={{
                  strings: ['Smart Financial Planning', 'Intelligent Investing', 'Secure Your Future'],
                  autoStart: true,
                  loop: true,
                  deleteSpeed: 50,
                  delay: 80,
                }}
              />
              <Text as="span" display="block" mt={4}>
                with AI Assistance
              </Text>
            </Heading>
            <Text 
              color={'gray.600'} 
              fontSize={{ base: 'md', md: 'lg' }}
              mb={6}
            >
              AI Powered FinanceGPT helps you take control of your financial future. Get personalized advice,
              set goals, and check your financial snapshot with the power of artificial intelligence.
            </Text>
            <Link href="/register" passHref>
              <Button
                as={motion.button}
                whileHover={buttonHover}
                height="60px"
                width="200px"
                bg="black"
                color="white"
                px={8}
                fontSize={'xl'}
                borderRadius="full"
                _hover={{
                  bg: 'gray.800',
                  transform: 'scale(1.05)',
                  transition: 'all 0.2s ease-in-out'
                }}
                transition="all 0.2s ease-in-out"
              >
                Get Started
              </Button>
            </Link>
          </MotionFlex>

          <MotionBox
            variants={fadeInScale}
            initial="initial"
            animate="animate"
            w={{ base: 'full', md: '40%' }}
            minH={{ base: '300px', md: '400px' }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            bg="transparent"
          >
            <Box position="relative" w="full" h="full" p={8}>
              <Flex
                w="full"
                h="full"
                align="center"
                justify="center"
                position="relative"
              >
                <motion.svg
                  viewBox="0 0 100 100"
                  style={{
                    width: '400px',
                    height: '400px',
                  }}
                >
                  {/* Background Circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="transparent"
                    stroke="black"
                    strokeWidth="1"
                    variants={circleVariants}
                    initial="initial"
                    animate="animate"
                    style={{ rotate: -90 }}
                  />

                  {/* Stability Text */}
                  {[
                    { text: "Analyzing Finances", y: 40 },
                    { text: "Building Stability", y: 50 },
                    { text: "Optimizing Growth", y: 60 },
                    { text: "Financial Freedom", y: 70 }
                  ].map((item, i) => (
                    <motion.text
                      key={i}
                      x="50"
                      y={item.y}
                      textAnchor="middle"
                      fontSize="5"
                      fontWeight="bold"
                      fill="black"
                      variants={stabilityTextVariants}
                      initial="initial"
                      animate="animate"
                      custom={i}
                    >
                      {item.text}
                    </motion.text>
                  ))}

                  {/* AI Robot Icon */}
                  <motion.g
                    variants={robotVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <circle
                      cx="50"
                      cy="20"
                      r="8"
                      fill="black"
                      opacity="0.1"
                    />
                    <foreignObject x="42" y="12" width="16" height="16">
                      <FaRobot size={16} />
                    </foreignObject>
                  </motion.g>

                  {/* Candlestick Chart */}
                  <g transform="translate(15, 25) scale(0.7)" opacity="0.2">
                    {/* Grid Lines */}
                    {[...Array(5)].map((_, i) => (
                      <line
                        key={`grid-${i}`}
                        x1="0"
                        y1={i * 20}
                        x2="100"
                        y2={i * 20}
                        stroke="rgba(0,0,0,0.05)"
                        strokeWidth="0.5"
                      />
                    ))}

                    {/* Stock Line - Now trending upward */}
                    <motion.path
                      d="M0,70 C20,65 30,55 40,45 C50,35 60,30 70,25 C80,20 90,15 100,10"
                      fill="none"
                      stroke="black"
                      strokeWidth="1"
                      variants={graphVariants}
                      initial="initial"
                      animate="animate"
                    />

                    {/* Candlesticks - More positive trend */}
                    {[
                      { x: 15, h: 20, up: false },
                      { x: 35, h: 25, up: true },
                      { x: 55, h: 30, up: true },
                      { x: 75, h: 35, up: true },
                    ].map((candle, i) => (
                      <g key={i}>
                        <line
                          x1={candle.x}
                          y1={40 - candle.h/2}
                          x2={candle.x}
                          y2={40 + candle.h/2}
                          stroke="black"
                          strokeWidth="0.3"
                        />
                        <motion.rect
                          x={candle.x - 2}
                          y={40 - candle.h/4}
                          width="4"
                          height={candle.h/2}
                          fill={candle.up ? "white" : "black"}
                          stroke="black"
                          strokeWidth="0.3"
                          initial="initial"
                          animate="animate"
                          custom={i}
                        />
                      </g>
                    ))}
                  </g>
                </motion.svg>
              </Flex>
            </Box>
          </MotionBox>
        </Stack>
      </Container>

      {/* Features Section */}
      <Container maxW={'7xl'} py={20}>
        <MotionBox
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          textAlign="center"
          mb={16}
        >
          <Heading 
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="bold"
            mb={4}
          >
            Key Features
          </Heading>
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            color="gray.600"
            maxW="2xl"
            mx="auto"
          >
            Empower your financial journey with AI-driven insights and personalized guidance
          </Text>
        </MotionBox>

        <SimpleGrid 
          columns={{ base: 1, md: 3 }} 
          spacing={{ base: 8, md: 12 }}
          px={{ base: 4, md: 8 }}
        >
          {[
            {
              title: "AI-Powered Financial Advice",
              description: "Get personalized recommendations based on your unique financial situation and goals. Our AI analyzes market trends and your spending patterns.",
              icon: FaBrain,
              gradient: "linear(to-r, blue.400, purple.500)"
            },
            {
              title: "Goal-Based Planning",
              description: "Set and track your financial goals with AI-generated strategies. Monitor your progress and receive adjustments in real-time.",
              icon: FaChartLine,
              gradient: "linear(to-r, green.400, teal.500)"
            },
            {
              title: "Financial Health Tracking",
              description: "Monitor your financial health with intuitive dashboards. Get insights on spending, savings, and investment opportunities.",
              icon: FaRegHandshake,
              gradient: "linear(to-r, orange.400, red.500)"
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={featureCardVariants}
              initial="initial"
              animate="animate"
              custom={index}
              whileHover={{ y: -5 }}
            >
              <Box
                bg="white"
                p={8}
                rounded="xl"
                boxShadow="xl"
                position="relative"
                overflow="hidden"
                transition="all 0.3s ease"
                height="300px"
                display="flex"
                flexDirection="column"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "2xl",
                }}
              >
                <Box
                  position="absolute"
                  top="-20px"
                  left="-20px"
                  w="100px"
                  h="100px"
                  bgGradient={feature.gradient}
                  filter="blur(40px)"
                  opacity={0.2}
                />
                
                <motion.div
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                >
                  <Box
                    display="inline-flex"
                    p={3}
                    borderRadius="lg"
                    bg="gray.100"
                    mb={4}
                  >
                    <Icon
                      as={feature.icon}
                      boxSize={6}
                      color="black"
                    />
                  </Box>
                </motion.div>

                <Heading
                  fontSize="xl"
                  fontWeight="bold"
                  mb={4}
                >
                  {feature.title}
                </Heading>

                <Text
                  color="gray.600"
                  fontSize="md"
                  lineHeight="tall"
                  flex="1"
                >
                  {feature.description}
                </Text>
              </Box>
            </motion.div>
          ))}
        </SimpleGrid>
      </Container>

      {/* Reviews Section */}
      <Container maxW={'7xl'} py={16}>
        <MotionBox
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          textAlign="center"
          mb={12}
        >
          <Heading fontSize="3xl">
            What Our Users Say
          </Heading>
        </MotionBox>
        <Box py={8}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            style={{ padding: '20px 0 40px 0' }}
          >
            <AnimatePresence>
              {reviews.map((review, index) => (
                <SwiperSlide key={index}>
                  <MotionBox
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    p={8}
                    bg={useColorModeValue('white', 'gray.800')}
                    rounded="xl"
                    shadow="xl"
                    maxW="3xl"
                    mx="auto"
                    textAlign="center"
                  >
                    <Icon as={FaQuoteLeft} w={8} h={8} mb={4} color="gray.400" />
                    <Text fontSize="xl" mb={6}>
                      {review.content}
                    </Text>
                    <VStack spacing={2}>
                      <Avatar size="lg" src={review.avatar} mb={2} />
                      <Text fontWeight="bold" fontSize="lg">
                        {review.name}
                      </Text>
                      <Text color="gray.500">
                        {review.role}
                      </Text>
                    </VStack>
                  </MotionBox>
                </SwiperSlide>
              ))}
            </AnimatePresence>
          </Swiper>
        </Box>
      </Container>

      {/* Stats Section */}
      <Box bgGradient={bgGradient} pt={10} pb={20} mb={0}>
        <Container maxW={'7xl'}>
          <VStack spacing={4} mb={16} textAlign="center">
            <Heading 
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
            >
              Our Impact in Numbers
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="gray.600"
              maxW="2xl"
            >
              Transforming financial futures with AI-powered insights and proven results
            </Text>
          </VStack>

          <SimpleGrid 
            columns={{ base: 2, md: 4 }} 
            spacing={{ base: 8, md: 12 }} 
            textAlign="center"
          >
            {[
              {
                number: "98%",
                label: "Client Satisfaction"
              },
              {
                number: "$2.5M",
                label: "Portfolio Growth"
              },
              {
                number: "15K+",
                label: "Active Users"
              },
              {
                number: "24/7",
                label: "AI Support"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <VStack
                  spacing={2}
                  _hover={{
                    transform: "translateY(-5px)",
                    transition: "all 0.3s ease"
                  }}
                  transition="all 0.3s ease"
                >
                  <Text
                    fontSize={{ base: "4xl", md: "5xl" }}
                    fontWeight="bold"
                    color="black"
                    letterSpacing="tight"
                  >
                    {stat.number}
                  </Text>
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color="gray.600"
                    fontWeight="medium"
                  >
                    {stat.label}
                  </Text>
                </VStack>
              </motion.div>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: React.ElementType }) {
  return (
    <VStack
      bg={useColorModeValue('white', 'gray.800')}
      p={8}
      rounded="xl"
      shadow="xl"
      spacing={4}
      height="full"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.100', 'gray.700')}
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        shadow: '2xl',
      }}
    >
      <Icon as={icon} w={10} h={10} color="black" />
      <Heading size="md" color={useColorModeValue('black', 'white')}>
        {title}
      </Heading>
      <Text color={'gray.500'} align="center">
        {description}
      </Text>
    </VStack>
  );
}
