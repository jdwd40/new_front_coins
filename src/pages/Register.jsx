import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Heading,
} from '@chakra-ui/react';

function Register() {
  const handleSubmit = (event) => {
    event.preventDefault();
    // handle form submission...
  };

  return (
    <Center>
      <Box as="form" onSubmit={handleSubmit}>
        <Heading mb="2">Register Your Account</Heading>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input type="email" />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input type="password" />
        </FormControl>
        <FormControl id="confirmPassword">
          <FormLabel>Confirm Password</FormLabel>
          <Input type="password" />
        </FormControl>
        <Button mt={4} colorScheme="teal" type="submit">
          Register
        </Button>
      </Box>
    </Center>
  );
}

export default Register;
