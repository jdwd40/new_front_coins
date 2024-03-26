import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Badge, CircularProgress, Text, useDisclosure, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, useToast } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import BuyCoin from '../components/BuyCoin';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';


function CoinList() {
  const [coins, setCoins] = useState([]);
  const [coinHistory, setCoinHistory] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Initialize loading state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [amountToBuy, setAmountToBuy] = useState(0);
  const { user, setUser } = useContext(AuthContext);
  const [prevTotalMarketValue, setPrevTotalMarketValue] = useState(0);
  const [totalMarketValue, setTotalMarketValue] = useState(0);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setPrevTotalMarketValue(totalMarketValue);
  }, [totalMarketValue]);

  const fetchPriceHistory = async (coin_id) => {
    console.log('Fetching price history for coin:', coin_id);
    try {
      // Fetch the latest price from the current price endpoint
      const currentPriceResponse = await axios.get(`http://localhost:9001/api/coins/${coin_id}/getprice`);
      const currentPrice = currentPriceResponse.data.current_price;
      console.log('Current price:', currentPrice);
  
      // Fetch the price history
      const historyResponse = await axios.get(`http://localhost:9001/api/history/${coin_id}`);
      const history = historyResponse.data;
  
      // Ensure there is at least one history entry to calculate the price change
      if (history.length > 0) {
        const lastPriceHistory = history[history.length - 1].price; // Assuming the last element is the oldest
        const priceChangePercent = ((currentPrice - lastPriceHistory) / lastPriceHistory) * 100;
  
        console.log('Price change:', priceChangePercent);
        return priceChangePercent;
      } else {
        console.log('No price history available for calculation');
        return null; // Or any default value you prefer
      }
    } catch (error) {
      console.error('Failed to fetch price data:', error);
      return null; // Handle error case
    }
  };
  

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get('http://localhost:9001/api/coins');
        let fetchedCoins = response.data;
        fetchedCoins = fetchedCoins.sort((a, b) => parseFloat(b.current_price) - parseFloat(a.current_price));
        setCoins(fetchedCoins);
        const calculatedTotalMarketValue = response.data[response.data.length - 1];
        setPrevTotalMarketValue(totalMarketValue);
        setTotalMarketValue(calculatedTotalMarketValue);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch coins:', error);
      }
    };

    fetchCoins();

    // Set up an interval to fetch new data every 2 minutes (120000 milliseconds)
    const intervalId = setInterval(fetchCoins, 10000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);

  }, []);


  useEffect(() => {
    const fetchAllPriceHistories = async () => {
      setCoinHistory(await fetchPriceHistory);
    };

    // fetchAllPriceHistories();
    const intervalId = setInterval(fetchAllPriceHistories, 5000);
    return () => clearInterval(intervalId);
  }, [coins]);

  if (isLoading) {
    return <CircularProgress isIndeterminate color="green" />;
  }

  // useEffect(() => {
  //   const totalMarketValue = coins.reduce((total, coin) => total + parseFloat(coin.current_price), 0);
  //   if (prevTotalMarketValue !== totalMarketValue) {
  //     setPrevTotalMarketValue(totalMarketValue);
  //   }
  // }, [coins, prevTotalMarketValue]);


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
      const response = await axios.post(`https://jwd1.xyz/api/usercoins/buy`, {
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
        await axios.patch(`https://jwd1.xyz/api/user/balance/${user.user_id}`, { amount: fundsNum });

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
      <Sidebar coins={coins} totalMarketValue={totalMarketValue}/>
      <Box flex="1" p='5'>
        <Text fontSize="2xl" marginBottom="5">
          Coin Prices
        </Text>
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
