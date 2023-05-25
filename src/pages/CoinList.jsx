import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function CoinList() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get('http://localhost:9090/api/coins');
        console.log(response.data.coins);
        setCoins(response.data.coins);
      } catch (error) {
        console.error('Failed to fetch coins:', error);
      }
    };
    fetchCoins();
    // Set up an interval to fetch coins every 5 seconds
    const intervalId = setInterval(fetchCoins, 5000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box p='5'>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Coin</Th>
            <Th>Price</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {coins.map((coin) => (
            <Tr key={coin.coin_id}>
              <Link to={`/coin/${coin.coin_id}`}>{coin.name}</Link>
              <Td>{coin.current_price}</Td>
              <Td>
                <Button colorScheme="teal">Buy</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default CoinList;
