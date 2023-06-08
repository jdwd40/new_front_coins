import React, { useContext, useState } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { AuthContext } from '../contexts/AuthContext';

const UserFunds = () => {
  const { user } = useContext(AuthContext);
  // change user.funds from a string to a number and round to 2 decimal places
     const [funds, setFunds] = useState(parseFloat(user.funds).toFixed(2));

  if (!user) {
    return null;
  }

  return (
    <Box p="4" boxShadow="md" borderRadius="md">
      <Heading mb={2} size="md">Available Funds</Heading>
      <Text fontSize="2xl">{`$${funds}`}</Text>
    </Box>
  );
};

export default UserFunds;
