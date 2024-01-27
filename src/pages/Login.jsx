import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Center, FormControl, FormLabel, Input, useToast, Stack, Text,
  Image, Heading, Container
} from '@chakra-ui/react';
import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useContext(AuthContext);
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('https://jwd1.xyz/api/user/login', { email, password });
      localStorage.setItem('token', response.data.token);

      const userResponse = await axios.get(`https://jwd1.xyz/api/user/getemail/${email}`);
      const updatedUser = {
        ...userResponse.data,
        funds: Number(userResponse.data.funds),
      };
      setUser(updatedUser);

      toast({
        title: 'Logged in successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log in.');
      toast({
        title: 'Failed to log in.',
        description: err.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={12}>
      <Center>
        <Box
          as="form"
          onSubmit={handleSubmit}
          w="full"
          maxW="400px"
          p={8}
          boxShadow="xl" // Changed to 'xl' for a more pronounced shadow
          borderRadius="lg"
          bg="gray.700" // Darker background for the form
          color="white" // Ensuring text is readable on the dark background
        >
          <Heading mb="4" textAlign="center" size="md">Please Login to Your Account</Heading>

          <Stack spacing={6} mt={6}>
            {error && <Text color="red.500">{error}</Text>}
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isRequired
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isRequired
              />
            </FormControl>
            <Button colorScheme="blue" isLoading={isLoading} type="submit" shadow="md">
              Login
            </Button>
            <Button colorScheme="blue" variant="outline" shadow="md">
              <a href="/register" style={{ color: 'white' }}>Register</a>
            </Button>
          </Stack>
        </Box>
      </Center>
    </Container>

  );
}

export default Login; 