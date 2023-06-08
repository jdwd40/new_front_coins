import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { 
  Box, 
  Heading, 
  Spinner, 
  Text, 
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  ModalBody,
  Stack,
  useMediaQuery,
  useToast
} from '@chakra-ui/react';
import { AuthContext } from '../contexts/AuthContext';
import  PortfolioList from '../components/PortfolioList';
import  SellCoin from '../components/SellCoin';
import UserFunds from '../components/UserFunds';

const Portfolio = () => {
  const [userCoins, setUserCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coinToSell, setCoinToSell] = useState(null);
  const [amountToSell, setAmountToSell] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useContext(AuthContext);

  const toast = useToast();
  const [isLargerThan1280] = useMediaQuery("(min-width: 1280px)");

  const fetchUserCoins = async () => {
    setIsLoading(true);
    try {
      if (user) {
        const allCoinsRes = await axios.get(`http://localhost:9090/api/coins`);
        const allCoins = allCoinsRes.data.coins;
        
        const userCoinsRes = await axios.get(`http://localhost:9090/api/usercoins/${user.user_id}`);
        const userCoinsData = userCoinsRes.data.userCoins;
        
        const userCoins = userCoinsData.map(userCoin => {
          const coinDetails = allCoins.find(coin => coin.coin_id === userCoin.coin_id);
          return {
            ...userCoin,
            name: coinDetails.name,
            symbol: coinDetails.symbol,
            current_price: coinDetails.current_price
          };
        });

        setUserCoins(userCoins);
      }
      setError(null);
    } catch (e) {
      setError(e.toString());
    }
    setIsLoading(false);
  };

  useEffect(() => {
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

  const handleSellClick = (coin) => {
    setCoinToSell(coin);
  }

  const handleInputChange = (event) => {
    setAmountToSell(event.target.value);
  };

  // These functions are not defined yet
  const handleFormSellClick = () => {
    if (amountToSell > 0 && coinToSell) {
      onOpen();
    } else {
      // You can handle form validation here. For instance, display an alert if the amount is zero or no coin is selected
    }
  };

  const handleSellConfirm = async () => {
    // You need to replace this URL with your API endpoint
    try {
      const response = await axios.post(`http://localhost:9090/api/usercoins/sell`, {
        user_id: user.user_id,
        coin_id: coinToSell.coin_id,
        amount: amountToSell
      });

      if (response.status === 200) {
        // Handle successful sell...
        console.log(response.data.message);
        // You could display a success message, update the user's portfolio in your UI, etc.
         // Display a success toast notification
      toast({
        title: "Transaction successful.",
        description: `Sold ${amountToSell} of ${coinToSell.name}.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      })
       // Refresh user's coins
       fetchUserCoins();

       // Clear the sell form
       setCoinToSell(null);
       setAmountToSell(0);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle error...
        console.error(error.response.data.message);
        if (error.response.data.message === 'Insufficient coins.') {
          // Display an error toast notification
          toast({
            title: "Insufficient coins.",
            description: "You don't have enough coins to complete this transaction.",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        }
        // You could display an error message to the user, etc.
      } else {
        // Handle other errors...
        console.error('An error occurred while processing your request.', error);
      }
    }

    onClose();
  };
  
  return (
    <Box p={[2, 4, 6]}>
    <Stack direction={isLargerThan1280 ? "row" : "column"} spacing={4}>
      <UserFunds />
      <Box flex="1" boxShadow="md" p={4} borderRadius="md">
        <Heading mb={4} size="lg">Your Coins</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Coin</Th>
              <Th>Symbol</Th>
              <Th isNumeric>Amount</Th>
              <Th isNumeric>Current Price</Th>
              <Th isNumeric>Total Value</Th>
              <Th isNumeric>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {userCoins.map(coin => (
              <Tr key={coin.coin_id}>
                <Td>{coin.name}</Td>
                <Td fontWeight='bold'>{coin.symbol.toUpperCase()}</Td>
                <Td isNumeric>{coin.amount}</Td>
                <Td isNumeric>{coin.current_price}</Td>
                <Td isNumeric>{(coin.current_price * coin.amount).toFixed(2)}</Td>
                <Td>
                  <Button colorScheme="blue" size="sm" onClick={() => handleSellClick(coin)}>Sell</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Box flex="1" boxShadow="md" p={4} borderRadius="md">
        <Heading mb={4} size="lg">Sell Coins</Heading>
        <SellCoin 
          selectedCoin={coinToSell}
          amountToSell={amountToSell}
          handleFormSellClick={handleFormSellClick}
          handleSellConfirm={handleSellConfirm}
          handleInputChange={handleInputChange}
          onClose={onClose}
          isOpen={isOpen} 
        />
      </Box>
    </Stack>
  </Box>
  );
};

export default Portfolio;
