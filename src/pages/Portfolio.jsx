import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Box, Text, Heading, Spinner, VStack, List, ListItem } from '@chakra-ui/react'; // <-- import List
import { useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Portfolio = () => {
  const [userCoins, setUserCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user from context
  const { user } = useContext(AuthContext);
  console.log(user);

  useEffect(() => {
    const fetchUserCoins = async () => {
      setIsLoading(true);
      try {
        if (user) {
          const response = await axios.get(`http://localhost:9090/api/usercoins/${user.user_id}`);
          setUserCoins(response.data.userCoins);
        }
        setError(null);
      } catch (e) {
        setError(e.toString());
      }
      setIsLoading(false);
    };

    fetchUserCoins();
  }, [user]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!user || !userCoins) {
    return null;
  }

  return (
    <Box p='5'>
      <Heading mb={4}>{user.username}'s Portfolio</Heading>
      <Text fontSize="lg">Available Funds: {user.funds}</Text>
      <VStack spacing={4} align="start">
        <List>   {/* <-- Use List component here */}
          {userCoins.map(coin => (
            <ListItem key={coin.id}>
              <Text fontSize="lg">{coin.name}: {coin.amount}</Text>
            </ListItem>
          ))}
          <ListItem>
            <Text fontSize="lg">Total Value: {userCoins.reduce((total, coin) => total + coin.amount * coin.current_price, 0)}</Text>
          </ListItem>
        </List>
      </VStack>
    </Box>
  );
};

export default Portfolio;
