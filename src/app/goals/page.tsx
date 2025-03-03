'use client'

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGoals, addGoal, updateGoal, deleteGoal } from '@/store/goalSlice';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Text,
  Progress,
  SimpleGrid,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { AppDispatch, RootState } from '@/store';

const GoalPlanning = () => {
  // Access Redux store and component state
  const dispatch = useDispatch<AppDispatch>();
  const goalsState = useSelector((state: RootState) => state.goals);
  const goals = goalsState?.goals || [];
  const loading = goalsState?.loading || false;
  const error = goalsState?.error || null;

  // State for new goal form and editing existing goals
  const [newGoal, setNewGoal] = useState({
    type: 'retirement',
    targetAmount: '',
    targetDate: '',
    currentAmount: ''
  });
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  // Determine button color based on color mode
  const buttonColor = useColorModeValue('white', 'brand');

  // Fetch goals when the component mounts
  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  // Handle input changes in the form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewGoal({ 
      ...newGoal, 
      [name]: name === 'targetAmount' || name === 'currentAmount' ? Number(value) : value 
    });
  };

  // Handle form submission for adding or updating goals
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingGoalId) {
        // Update existing goal
        await dispatch(updateGoal({ 
          id: editingGoalId, 
          updatedData: { 
            ...newGoal, 
            targetAmount: Number(newGoal.targetAmount),
            currentAmount: Number(newGoal.currentAmount)
          } 
        })).unwrap();
        setEditingGoalId(null);
      } else {
        // Add new goal
        await dispatch(addGoal({ 
          ...newGoal, 
          targetAmount: Number(newGoal.targetAmount), 
          currentAmount: Number(newGoal.currentAmount),
          progress: 0, 
          strategy: ''
        })).unwrap();
      }

      // Reset form and fetch updated goals
      setNewGoal({ type: 'retirement', targetAmount: '', targetDate: '', currentAmount: '' });
      dispatch(fetchGoals());
      toast({
        title: editingGoalId ? "Goal Updated" : "Goal Added",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Goal update/creation error:', error);
      toast({
        title: "Couldn't Save Goal",
        description: "We couldn't save your goal at this time. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle editing an existing goal
  const handleEdit = (goal: any) => {
    setNewGoal(goal);
    setEditingGoalId(goal._id);
  };

  // Handle deleting a goal
  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteGoal(id)).unwrap();
      dispatch(fetchGoals());
      toast({
        title: "Goal Deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Goal deletion error:', error);
      toast({
        title: "Couldn't Delete Goal",
        description: "We couldn't delete your goal at this time. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Display loading or error states
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text color="red.500">Error: {error}</Text>;

  return (
    <Container maxW="container.xl" py={10}>
      <Heading mb={6}>Financial Goals</Heading>
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Goal Type</FormLabel>
              <Select name="type" value={newGoal.type} onChange={handleInputChange}>
                <option value="retirement">Retirement</option>
                <option value="homePurchase">Home Purchase</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Target Amount</FormLabel>
              <Input
                type="number"
                name="targetAmount"
                value={newGoal.targetAmount}
                onChange={handleInputChange}
                placeholder="Target Amount"
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Target Date</FormLabel>
              <Input
                type="date"
                name="targetDate"
                value={newGoal.targetDate}
                onChange={handleInputChange}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Current Amount</FormLabel>
              <Input
                type="number"
                name="currentAmount"
                value={newGoal.currentAmount}
                onChange={handleInputChange}
                placeholder="Current Amount"
                required
              />
            </FormControl>
            <Button 
              type="submit" 
              colorScheme="brand"
              bg="black"
              color={buttonColor}
              isLoading={submitting}
            >
              {editingGoalId ? 'Update Goal' : 'Add Goal'}
            </Button>
          </VStack>
        </form>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 1 }} spacing={6} mt={8}>
        {goals.map((goal: any) => (
          <Box key={goal._id} p={5} shadow="md" borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={2}>{goal.type}</Heading>
            <Text>Target: ${parseFloat(goal.targetAmount).toLocaleString()}</Text>
            <Text>Current: ${parseFloat(goal.currentAmount).toLocaleString()}</Text>
            <Text mb={2}>Target Date: {new Date(goal.targetDate).toLocaleDateString()}</Text>
            <Progress value={(goal.currentAmount / goal.targetAmount) * 100} mb={4} colorScheme="blue" />

            <Accordion allowToggle>
              <AccordionItem border="1px solid" borderColor="gray.200" borderRadius="md" mb={2}>
                <AccordionButton bg="gray.100" _expanded={{ bg: 'gray.200' }} p={4}>
                  <Box flex="1" textAlign="left" fontWeight="bold">
                    Strategy for Achieving This Goal
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} bg="white">
                  <Box maxH="300px" overflowY="auto">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <Text mb={4}>{children}</Text>,
                        h1: ({ children }) => <Heading as="h1" size="lg" mb={4}>{children}</Heading>,
                        h2: ({ children }) => <Heading as="h2" size="md" mb={4}>{children}</Heading>,
                        h3: ({ children }) => <Heading as="h3" size="sm" mb={3}>{children}</Heading>,
                        ul: ({ children }) => <Box as="ul" pl={4} mb={4}>{children}</Box>,
                        ol: ({ children }) => <Box as="ol" pl={4} mb={4}>{children}</Box>,
                        li: ({ children }) => <Box as="li" mb={2}>{children}</Box>,
                        blockquote: ({ children }) => <Box pl={4} borderLeft="4px solid" borderColor="gray.300" fontStyle="italic" mb={4}>{children}</Box>,
                      }}
                    >
                      {goal.strategy}
                    </ReactMarkdown>
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            <Divider my={4} />

            <Flex justifyContent="space-between">
              <Button 
                onClick={() => handleEdit(goal)} 
                size="sm" 
                colorScheme="yellow" 
                bg="black"
                color={buttonColor}
              >
                Edit
              </Button>
              <Button 
                onClick={() => handleDelete(goal._id)} 
                colorScheme="red" 
                size="sm" 
                bg="black"
                color={buttonColor}
              >
                Delete
              </Button>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default GoalPlanning;
