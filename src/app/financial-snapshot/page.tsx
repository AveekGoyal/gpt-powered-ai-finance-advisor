'use client'

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { RootState } from '@/store';

const FinancialSnapshot = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State for managing financial data
  const [financialData, setFinancialData] = useState({
    annualIncome: user?.annualIncome || 0,
    currentSavings: user?.currentSavings || 0,
    monthlyExpenses: user?.monthlyExpenses || {},
    financialGoals: [...user?.financialGoals || []],
    riskTolerance: user?.riskTolerance || 'medium'
  });
  
  const [netWorth, setNetWorth] = useState(0);
  const [financialHealthScore, setFinancialHealthScore] = useState(0);

  const buttonColor = useColorModeValue('white', 'brand');

  useEffect(() => {
    // Calculate net worth and financial health score when financial data changes
    calculateNetWorth();
    calculateFinancialHealthScore();
  }, [financialData]);

  // Calculates the user's net worth.
  const calculateNetWorth = () => {
    const totalAssets = financialData.currentSavings;
    const totalLiabilities = 0; 
    setNetWorth(totalAssets - totalLiabilities);
  };

  // Calculates the user's financial health score.
  const calculateFinancialHealthScore = () => {
    const savingsRatio = financialData.currentSavings / financialData.annualIncome;
    const score = Math.min(Math.round(savingsRatio * 100), 100);
    setFinancialHealthScore(score);
  };

  // Handles changes in input fields.
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => { 
    const { name, value } = e.target;
    setFinancialData(prev => ({
      ...prev,
      [name]: name === 'annualIncome' || name === 'currentSavings' ? Number(value) : value
    }));
  };

  // Handles changes in monthly expense inputs.
  const handleExpenseChange = (category: string, value: string) => {
    setFinancialData(prev => ({
      ...prev,
      monthlyExpenses: {
        ...prev.monthlyExpenses,
        [category]: Number(value)
      }
    }));
  };

  // Handles changes in financial goals selection.
  const handleGoalChange = (goal: string) => {
    setFinancialData(prev => ({
      ...prev,
      financialGoals: prev.financialGoals.includes(goal)
        ? prev.financialGoals.filter(g => g !== goal)
        : [...prev.financialGoals, goal]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onOpen();
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Prepares data for the expense pie chart.
  const prepareExpenseData = () => {
    return Object.entries(financialData.monthlyExpenses)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const expenseData = prepareExpenseData();

  const RADIAN = Math.PI / 180;

  // Customizes the labels on the pie chart.
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const incomeVsSavingsData = [
    { name: 'Annual Income', value: financialData.annualIncome },
    { name: 'Current Savings', value: financialData.currentSavings },
  ];

  return (
    <Container maxW="container.xl" py={12}>
      <Box mb={10}>
        <Heading size="2xl" mb={2}>Financial Snapshot</Heading>
        <Box w="60px" h="4px" bg="black" mb={6} />
      </Box>
      
      {!isEditing ? (
        <VStack spacing={10} align="stretch">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            <Box 
              p={6} 
              borderRadius="xl" 
              boxShadow="lg" 
              bg={useColorModeValue('white', 'gray.800')}
              border="1px solid"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
              transition="transform 0.2s"
              _hover={{ transform: 'translateY(-4px)' }}
            >
              <Stat>
                <StatLabel fontSize="sm" color="gray.500" mb={2}>Net Worth</StatLabel>
                <StatNumber fontSize="3xl">${netWorth.toLocaleString()}</StatNumber>
              </Stat>
            </Box>
            <Box 
              p={6} 
              borderRadius="xl" 
              boxShadow="lg" 
              bg={useColorModeValue('white', 'gray.800')}
              border="1px solid"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
              transition="transform 0.2s"
              _hover={{ transform: 'translateY(-4px)' }}
            >
              <Stat>
                <StatLabel fontSize="sm" color="gray.500" mb={2}>Annual Income</StatLabel>
                <StatNumber fontSize="3xl">${financialData.annualIncome.toLocaleString()}</StatNumber>
              </Stat>
            </Box>
            <Box 
              p={6} 
              borderRadius="xl" 
              boxShadow="lg" 
              bg={useColorModeValue('white', 'gray.800')}
              border="1px solid"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
              transition="transform 0.2s"
              _hover={{ transform: 'translateY(-4px)' }}
            >
              <Stat>
                <StatLabel fontSize="sm" color="gray.500" mb={2}>Current Savings</StatLabel>
                <StatNumber fontSize="3xl">${financialData.currentSavings.toLocaleString()}</StatNumber>
              </Stat>
            </Box>
            <Box 
              p={6} 
              borderRadius="xl" 
              boxShadow="lg" 
              bg={useColorModeValue('white', 'gray.800')}
              border="1px solid"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
              transition="transform 0.2s"
              _hover={{ transform: 'translateY(-4px)' }}
            >
              <Stat>
                <StatLabel fontSize="sm" color="gray.500" mb={2}>Financial Health Score</StatLabel>
                <StatNumber fontSize="3xl">{financialHealthScore}/100</StatNumber>
              </Stat>
            </Box>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <Box 
              height="450px" 
              p={6} 
              borderRadius="xl" 
              boxShadow="lg" 
              bg={useColorModeValue('white', 'gray.800')}
              border="1px solid"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <Heading size="md" mb={6}>Monthly Expenses</Heading>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: useColorModeValue('white', 'gray.800'),
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }} 
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            <Box 
              height="450px" 
              p={8}
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="2xl"
              boxShadow="0 4px 20px rgba(0, 0, 0, 0.05)"
              position="relative"
              overflow="hidden"
            >
              <Heading size="md" mb={8} fontWeight="medium" letterSpacing="-0.5px">Income vs Savings</Heading>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart
                  data={incomeVsSavingsData}
                  margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                  barSize={60}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={useColorModeValue('rgba(0,0,0,0.05)', 'rgba(255,255,255,0.05)')} 
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="name" 
                    stroke={useColorModeValue('gray.600', 'gray.400')}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke={useColorModeValue('gray.600', 'gray.400')}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, Math.max(financialData.annualIncome, financialData.currentSavings) * 1.1]}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                    contentStyle={{ 
                      backgroundColor: useColorModeValue('white', 'gray.800'),
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                      padding: '12px'
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#82ca9d"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={80}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </SimpleGrid>
          
          <Box display="flex" justifyContent="center" mt={8}>
            <Button 
              colorScheme="brand"
              bg="black"
              color={buttonColor}
              onClick={() => setIsEditing(true)}
              size="md"
              width="200px"
            >
              Update Financial Details
            </Button>
          </Box>
        </VStack>
      ) : (
        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            <FormControl>
              <FormLabel htmlFor="annualIncome">Annual Income:</FormLabel>
              <Input
                type="number"
                id="annualIncome"
                name="annualIncome"
                value={financialData.annualIncome}
                onChange={handleInputChange}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="currentSavings">Current Savings:</FormLabel>
              <Input
                type="number"
                id="currentSavings"
                name="currentSavings"
                value={financialData.currentSavings}
                onChange={handleInputChange}
                required
              />
            </FormControl>
            <Box>
              <Heading size="md" mb={4}>Monthly Expenses:</Heading>
              {Object.entries(financialData.monthlyExpenses).map(([category, amount]) => (
                <FormControl key={category} mb={4}>
                  <FormLabel htmlFor={category}>{category}:</FormLabel>
                  <Input
                    type="number"
                    id={category}
                    value={amount}
                    onChange={(e) => handleExpenseChange(category, e.target.value)}
                    required
                  />
                </FormControl>
              ))}
            </Box>
            <FormControl>
              <FormLabel>Financial Goals:</FormLabel>
              <VStack align="start">
                {['retirement', 'homePurchase', 'debtPayoff', 'investment', 'other'].map(goal => (
                  <Checkbox
                    key={goal}
                    isChecked={financialData.financialGoals.includes(goal)}
                    onChange={() => handleGoalChange(goal)}
                  >
                    {goal.charAt(0).toUpperCase() + goal.slice(1)}
                  </Checkbox>
                ))}
              </VStack>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="riskTolerance">Risk Tolerance:</FormLabel>
              <Select
                id="riskTolerance"
                name="riskTolerance"
                value={financialData.riskTolerance}
                onChange={handleInputChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </FormControl>
            <Button 
              type="submit" 
              colorScheme="brand"
              bg="black"
              color={buttonColor}
            >
              Save Changes
            </Button>
            <Button 
              onClick={() => setIsEditing(false)} 
              colorScheme="brand"
              bg="black"
              color={buttonColor}
            >
              Cancel
            </Button>
          </VStack>
        </form>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Financial Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            This feature is not fully implemented in the template. In a real application, this would update your financial details in the database.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default FinancialSnapshot;
