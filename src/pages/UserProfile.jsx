import React, { useState, useEffect } from 'react';
import { Box, Image, Text, VStack } from '@chakra-ui/react';
import axios from 'axios';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user info from the API
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:9090/api/user/getuser/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, [userId]);

  // If user data is not yet loaded, display a loading message
  if (!user) {
    return <Text>Loading user data...</Text>;
  }

  // Display user data
  return (
    <VStack spacing={4} align="center" mt={5}>
      <Image 
        boxSize="150px" 
        borderRadius="full" 
        src={'https://placeimg.com/150/150/people'} 
        alt="Profile picture" 
      />
      <Text fontSize="2xl" fontWeight="bold">{user.username}</Text>
      <Text fontSize="lg" color="gray.500">{user.email}</Text>
      <Text fontSize="lg" color="gray.500">Available funds: ${user.funds}</Text>
    </VStack>
  )
}

export default UserProfile;
