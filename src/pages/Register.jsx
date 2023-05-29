import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text
} from '@chakra-ui/react';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation checks
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 2) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Send POST request to server
      const response = await axios.post('http://localhost:9090/api/user/register', {
        username,
        email,
        password
      });
      // Handle successful registration
      console.log(response.data);
      setError('');
    } catch (e) {
      // Handle error during registration
      setError(e.message);
    }
  };

  return (
    <Center>
      <Box as="form" onSubmit={handleSubmit}>
        <Heading mb="2">Register Your Account</Heading>
        <FormControl id="username">
          <FormLabel>Username</FormLabel>
          <Input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        </FormControl>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </FormControl>
        <FormControl id="confirmPassword">
          <FormLabel>Confirm Password</FormLabel>
          <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        </FormControl>
        {error && <Text color='red.500'>{error}</Text>}
        <Button mt={4} mr='4' colorScheme="teal" type="submit">
          Register
        </Button>
        <Button mt={4} colorScheme="teal" variant="outline">
          <a href="/login">Login</a>
        </Button>
      </Box>
    </Center>
  );
}

export default Register;
