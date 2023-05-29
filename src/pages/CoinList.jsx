import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Badge, CircularProgress } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function CoinList() {
  const [coins, setCoins] = useState([]);
  const [coinHistory, setCoinHistory] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Initialize loading state

  const fetchPriceHistory = async (coin_id) => {
    try {
      const response = await axios.get(`http://localhost:9090/api/history/${coin_id}`);
      const history = response.data.priceHistory;
      const lastEntry = history[history.length - 1];
      const secondLastEntry = history[history.length - 2];
      const change = ((lastEntry.price - secondLastEntry.price) / secondLastEntry.price) * 100;
      return change;
    } catch (error) {
      console.error('Failed to fetch price history:', error);
    }
  };

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get('http://localhost:9090/api/coins');
        const fetchedCoins = response.data.coins;
        setCoins(fetchedCoins);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch coins:', error);
      }
    };

    fetchCoins();
  }, []);

  useEffect(() => {
    const fetchAllPriceHistories = async () => {
      const coinsWithHistory = await Promise.all(coins.map((coin) => fetchPriceHistory(coin.coin_id)));
      setCoinHistory(coinsWithHistory.reduce((acc, coin, index) => ({...acc, [coins[index].coin_id]: coin}), {}));
    };

    fetchAllPriceHistories();
    const intervalId = setInterval(fetchAllPriceHistories, 5000);
    return () => clearInterval(intervalId);
  }, [coins]);

  if (isLoading) {
    return <CircularProgress isIndeterminate color="green" />; 
  }

  return (
    <Box p='5'>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Coin</Th>
            <Th>Price</Th>
            <Th>Price Change</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {coins.map((coin) => (
            <Tr key={coin.coin_id}>
              <Td><Link to={`/coin/${coin.coin_id}`}>{coin.name}</Link></Td>
              <Td>{coin.current_price}</Td>
              <Td>
                {coinHistory[coin.coin_id] !== undefined 
                  ? coinHistory[coin.coin_id] > 0 
                    ? <Badge colorScheme="green">+{coinHistory[coin.coin_id].toFixed(2)}%</Badge>
                    : <Badge colorScheme="red">{coinHistory[coin.coin_id].toFixed(2)}%</Badge>
                  : <Badge>N/A</Badge>
                }
              </Td>
              <Td>
                <Button size="sm" colorScheme="teal">Buy</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default CoinList;
