import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Badge, CircularProgress, Text, useDisclosure, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { BuyCoin } from '../components/BuyCoin';

function CoinList() {
  const [coins, setCoins] = useState([]);
  const [coinHistory, setCoinHistory] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Initialize loading state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [amountToBuy, setAmountToBuy] = useState(0);
  const { user } = useContext(AuthContext);

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
      setCoinHistory(coinsWithHistory.reduce((acc, coin, index) => ({ ...acc, [coins[index].coin_id]: coin }), {}));
    };

    fetchAllPriceHistories();
    const intervalId = setInterval(fetchAllPriceHistories, 5000);
    return () => clearInterval(intervalId);
  }, [coins]);

  if (isLoading) {
    return <CircularProgress isIndeterminate color="green" />;
  }

  const totalMarketValue = coins.reduce((total, coin) => total + parseFloat(coin.current_price), 0);

  const handleBuyClick = (coin) => {
    setSelectedCoin(coin);
  };

  const handleFormBuyClick = () => {
    if (selectedCoin) {
      onOpen();
    }
  };

  const handleBuyConfirm = async () => {
    console.log('Buying coin...user val: ', user);
    try {
      const response = await axios.post(`http://localhost:9090/api/usercoins/buy`, {
        user_id: user.user_id,
        coin_id: selectedCoin.coin_id,
        amount: amountToBuy
      });

      if (response.status === 200) {
        // Handle successful purchase...
        console.log(response.data.message);
        // You could display a success message, update the user's portfolio in your UI, etc.
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle insufficient funds...
        console.error(error.response.data.message);
        // You could display an error message to the user, etc.
      } else {
        // Handle other errors...
        console.error('An error occurred while processing your request.', error);
      }
    }

    onClose();
  };

  const handleInputChange = (event) => {
    setAmountToBuy(event.target.value);
  };

  return (
    <Flex>
      <Box flex="1" p='5'>
        <Text fontSize="2xl" marginBottom="5">Total Market Value: {totalMarketValue.toFixed(2)}</Text>
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
                  <Button size="sm" colorScheme="teal" onClick={() => handleBuyClick(coin)}>Buy</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Box flex="1">
        <BuyCoin
        selectedCoin={selectedCoin} 
        amountToBuy={amountToBuy} 
        handleFormBuyClick={handleFormBuyClick} 
        handleBuyConfirm={handleBuyConfirm} 
        handleInputChange={handleInputChange} 
        onClose={onClose} 
        isOpen={isOpen} 
      />
      </Box>
      
    </Flex>
  );
}

export default CoinList;
