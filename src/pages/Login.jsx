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
        <Box as="form" onSubmit={handleSubmit} w="full" maxW="400px" p={8} boxShadow="lg" borderRadius="lg">
          <Heading mb="4" textAlign="center">Please Login to Your Account</Heading>
          <Center>
            <Image
              src="public/images/b1.png"
              alt="logo"
              boxSize={{ base: '100px', sm: '150px', md: '200px', lg: '250px' }}
              objectFit="cover"
              borderRadius="md"
            />
          </Center>

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
            <Button colorScheme="teal" isLoading={isLoading} type="submit">
              Login
            </Button>
            <Button colorScheme="teal" variant="outline">
              <a href="/register">Register</a>
            </Button>
          </Stack>
        </Box>
      </Center>
    </Container>
  );
}

export default Login; 