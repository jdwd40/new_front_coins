import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, setUser } = useContext(AuthContext);
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        'https://jwd1.xyz/api/user/login',
        { email, password }
      );
      // console.log(response);

      // Store the JWT in the user's browser
      localStorage.setItem('token', response.token);
      // Set the user's data in the AuthContext
      const user = await axios.get(
        `https://jwd1.xyz/api/user/getemail/${email}`
      );
        console.log(user.data);
        
        const updatedUser = {
          ...user.data,
          funds: Number(user.data.funds),
        };
        setUser(updatedUser);
      // Show a success toast
      toast({
        title: 'Logged in successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Redirect the user to the home page (or wherever you want)
      navigate('/');
      // You'll need to use the useHistory hook from react-router-dom
    } catch (error) {
      // Show an error toast
      console.log(error);
      toast({
        title: 'Failed to log in.',
        // description: error.response.data.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Center>
      <Box as="form" onSubmit={handleSubmit}>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button mt={4} mr='4' colorScheme="teal" type="submit">
          Login
        </Button>
        <Button mt={4} colorScheme="teal" variant='outline'>
          <a href="/register">Register</a>
        </Button>
      </Box>
    </Center>
  );
}

export default Login;
