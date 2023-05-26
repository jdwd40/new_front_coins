import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Badge } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function CoinList() {
  const [coins, setCoins] = useState([]);
  const [coinHistory, setCoinHistory] = useState({});

  const fetchPriceHistory = async (coin_id) => {
    try {
      const response = await axios.get(`http://localhost:9090/api/history/${coin_id}`);
      const history = response.data.priceHistory;
      const lastEntry = history[history.length - 1];
      const secondLastEntry = history[history.length - 2];
      const change = ((lastEntry.price - secondLastEntry.price) / secondLastEntry.price) * 100;
      return { ...coins.find((coin) => coin.coin_id === coin_id), change };
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
        const coinsWithHistory = await Promise.all(fetchedCoins.map((coin) => fetchPriceHistory(coin.coin_id)));
        setCoinHistory(coinsWithHistory.reduce((acc, coin) => ({...acc, [coin.coin_id]: coin.change}), {}));
        console.log(coinsWithHistory);
      } catch (error) {
        console.error('Failed to fetch coins:', error);
      }
    };

    fetchCoins();
    const intervalId = setInterval(fetchCoins, 5000);
    return () => clearInterval(intervalId);
  }, []);

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
                {coinHistory[coin.coin_id] !== undefined && (coinHistory[coin.coin_id] > 0 
                  ? <Badge colorScheme="green">+{coinHistory[coin.coin_id].toFixed(2)}%</Badge>
                  : <Badge colorScheme="red">{coinHistory[coin.coin_id].toFixed(2)}%</Badge>
                )}
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
