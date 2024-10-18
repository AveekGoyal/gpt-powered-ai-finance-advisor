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
  const [financialData, setFinancialData] = useState({
    annualIncome: user?.annualIncome || 0,
    currentSavings: user?.currentSavings || 0,
    monthlyExpenses: { ...user?.monthlyExpenses } || {},
    financialGoals: [...user?.financialGoals || []],
    riskTolerance: user?.riskTolerance || 'medium'
  });
  const [netWorth, setNetWorth] = useState(0);
  const [financialHealthScore, setFinancialHealthScore] = useState(0);

  const buttonColor = useColorModeValue('white', 'brand');

  useEffect(() => {
    calculateNetWorth();
    calculateFinancialHealthScore();
  }, [financialData]);

  const calculateNetWorth = () => {
    const totalAssets = financialData.currentSavings;
    const totalLiabilities = 0; // Assuming no liabilities for now
    setNetWorth(totalAssets - totalLiabilities);
  };

  const calculateFinancialHealthScore = () => {
    const savingsRatio = financialData.currentSavings / financialData.annualIncome;
    const score = Math.min(Math.round(savingsRatio * 100), 100);
    setFinancialHealthScore(score);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => { // Updated type
    const { name, value } = e.target;
    setFinancialData(prev => ({
      ...prev,
      [name]: name === 'annualIncome' || name === 'currentSavings' ? Number(value) : value
    }));
  };

  const handleExpenseChange = (category: string, value: string) => {
    setFinancialData(prev => ({
      ...prev,
      monthlyExpenses: {
        ...prev.monthlyExpenses,
        [category]: Number(value)
      }
    }));
  };

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

  const prepareExpenseData = () => {
    return Object.entries(financialData.monthlyExpenses)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const expenseData = prepareExpenseData();

  const RADIAN = Math.PI / 180;
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
    <Container maxW="container.xl" py={10}>
      <Heading mb={6}>Financial Snapshot</Heading>
      
      {!isEditing ? (
        <VStack spacing={8} align="stretch">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Stat>
              <StatLabel>Net Worth</StatLabel>
              <StatNumber>${netWorth.toLocaleString()}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Annual Income</StatLabel>
              <StatNumber>${financialData.annualIncome.toLocaleString()}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Current Savings</StatLabel>
              <StatNumber>${financialData.currentSavings.toLocaleString()}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Financial Health Score</StatLabel>
              <StatNumber>{financialHealthScore}/100</StatNumber>
            </Stat>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box height="400px">
              <Heading size="md" mb={4}>Monthly Expenses</Heading>
              <ResponsiveContainer width="100%" height="100%">
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
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            <Box height="400px">
              <Heading size="md" mb={4}>Income vs Savings</Heading>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={incomeVsSavingsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis scale="sqrt" domain={[0, 'dataMax']} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </SimpleGrid>
          
          <Button 
            colorScheme="brand"
            bg="black"
            color={buttonColor}
            onClick={() => setIsEditing(true)}
          >
            Update Financial Details
          </Button>
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
