import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Badge, CircularProgress, Text, useDisclosure, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, useToast } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import BuyCoin from '../components/BuyCoin';
import { useNavigate } from 'react-router-dom';


function CoinList() {
  const [coins, setCoins] = useState([]);
  const [coinHistory, setCoinHistory] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Initialize loading state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [amountToBuy, setAmountToBuy] = useState(0);
  const { user, setUser } = useContext(AuthContext);

  const toast = useToast();
  const navigate = useNavigate();

  const fetchPriceHistory = async (coin_id) => {
    try {
      const response = await axios.get(`http://192.168.0.53:9090/api/history/${coin_id}`);
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
        const response = await axios.get('http://192.168.0.53:9090/api/coins');
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
      const response = await axios.post(`http://192.168.0.53:9090/api/usercoins/buy`, {
        user_id: user.user_id,
        coin_id: selectedCoin.coin_id,
        amount: amountToBuy
      });

      if (response.status === 200) {
        // Handle successful purchase...
        console.log(response.data.message);
        // Update user's balance in context
        const newUser = {
          ...user,
          funds: user.funds - (selectedCoin.current_price * amountToBuy)
        };

        setUser(newUser);  // setUser should be fetched from AuthContext
        // patch blance user id
        const fundsNum = Number(newUser.funds);
        console.log("fundsNum", fundsNum);
        await axios.patch(`http://192.168.53:9090/api/user/balance/${user.user_id}`, { amount: fundsNum });

        toast({
          title: "Transaction Successful",
          description: "You have successfully bought the coin",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Redirect to Portfolio page
        navigate('/portfolio');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle insufficient funds...
        console.error(error.response.data.message);

        toast({
          title: "Transaction Failed",
          description: "Insufficient funds",
          status: "error",
          duration: 5000,
          isClosable: true,
        });

        // Open a modal informing the user that they do not have enough funds
        // onOpenInsufficientFundsModal();
      } else {
        // Handle other errors...
        console.error('An error occurred while processing your request.', error);

        toast({
          title: "Transaction Failed",
          description: "An error occurred while processing your request",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
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
