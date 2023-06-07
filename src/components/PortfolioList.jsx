import React from 'react';
import { Box, Text, List, ListItem, Button } from '@chakra-ui/react';

export function PortfolioList({user, userCoins, onSellClick}) {
    console.log('from portfoliList',userCoins);
  return (
    <Box p='5'>
      <Text fontSize="2xl" marginBottom="5">{user.username}'s Portfolio</Text>
      <Text fontSize="lg">Available Funds: {user.funds}</Text>
      <List spacing={4} align="start">
        {userCoins.map(coin => (
          <ListItem key={coin.id}>
            <Text fontSize="lg">{coin.name}: {coin.amount}</Text>
            <Button size="sm" colorScheme="red" onClick={() => onSellClick(coin)}>Sell</Button>
          </ListItem>
        ))}
        <ListItem>
          <Text fontSize="lg">Total Value: {userCoins.reduce((total, coin) => total + coin.amount * coin.current_price, 0)}</Text>
        </ListItem>
      </List>
    </Box>
  );
}

export default PortfolioList;