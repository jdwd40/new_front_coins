import React, { useContext, useState, useEffect } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { AuthContext } from '../contexts/AuthContext';

const UserFunds = () => {
  const { user } = useContext(AuthContext);
  const [funds, setFunds] = useState(null);

  useEffect(() => {
    if (user && user.funds) {
      setFunds(parseFloat(user.funds).toFixed(2));
    }
  }, [user]);

  if (!user || funds === null) {
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
