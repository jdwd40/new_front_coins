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
} from '@chakra-ui/react';
import { AuthContext } from '../contexts/AuthContext';
import  PortfolioList from '../components/PortfolioList';
import  SellCoin from '../components/SellCoin';

const Portfolio = () => {
  const [userCoins, setUserCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coinToSell, setCoinToSell] = useState(null);
  const [amountToSell, setAmountToSell] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserCoins = async () => {
      setIsLoading(true);
      try {
        if (user) {
          // Get all coins
          const allCoinsRes = await axios.get(`http://localhost:9090/api/coins`);
          const allCoins = allCoinsRes.data.coins;
          
          // Get user coins
          const userCoinsRes = await axios.get(`http://localhost:9090/api/usercoins/${user.user_id}`);
          const userCoinsData = userCoinsRes.data.userCoins;
          
          // Find the user's coins within all coins
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
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle error...
        console.error(error.response.data.message);
        // You could display an error message to the user, etc.
      } else {
        // Handle other errors...
        console.error('An error occurred while processing your request.', error);
      }
    }

    onClose();
  };

  return (
    <Flex>
    <Box flex="1">
      <PortfolioList user={user} userCoins={userCoins} onSellClick={handleSellClick}/>
    </Box>
    <Box flex="1">
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
  </Flex>
  );
};

export default Portfolio;
