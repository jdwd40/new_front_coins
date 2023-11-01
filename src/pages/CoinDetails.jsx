import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { createChart } from 'lightweight-charts';
import { Box, Text, Heading, Spinner, Flex, Stat, StatLabel, StatNumber, Image, Grid, StatHelpText, StatArrow, HStack, VStack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import BuyCoin from '../components/BuyCoin';
import SellCoin from '../components/SellCoin';
import { useDisclosure, useToast } from '@chakra-ui/react';

const CoinDetails = () => {
  const [coin, setCoin] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const lineSeriesRef = useRef();
  const [amountToBuy, setAmountToBuy] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { coin_id } = useParams();

  useEffect(() => {
    const fetchCoin = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://192.168.0.53:9090/api/coins/${coin_id}`);
        setCoin(response.data.coin);
        setError(null);
      } catch (e) {
        setError(e.toString());
      }

      try {
        const historyResponse = await axios.get(`http://192.168.0.53:9090/api/history/${coin_id}`);
        const allEntries = historyResponse.data.priceHistory;
        setPriceHistory(allEntries);
      } catch (e) {
        setError(e.toString());
      }

      setIsLoading(false);
    };

    fetchCoin();
  }, [coin_id]);

  useEffect(() => {
    if (priceHistory.length === 0 || !chartContainerRef.current) return;

    const chartData = priceHistory.map(entry => ({
      time: new Date(entry.timestamp).getTime() / 1000,
      value: Number(entry.price),
    }));

    if (!chartRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: 500,
        height: 300,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });

      lineSeriesRef.current = chartRef.current.addLineSeries();
    }

    lineSeriesRef.current.setData(chartData);
  }, [priceHistory]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!coin) {
    return null;
  }

  // Construct the mascot image path using the coin name (in lowercase)
  const imageName = `${coin.name.toLowerCase()}_mascot.png`;
  const imagePath = `/images/${imageName}`;

  // Corporate photo
  const corporateImageName = `${coin.name.toLowerCase()}_cp.png`;
  const corporateImagePath = `/images/${corporateImageName}`;

  // Logo
  const logoImageName = `${coin.name.toLowerCase()}_logo.png`;
  const logoImagePath = `/images/${logoImageName}`;

  const lastPrice = priceHistory[priceHistory.length - 1].price;
  const secondLastPrice = priceHistory[priceHistory.length - 2].price;
  const priceChange = ((lastPrice - secondLastPrice) / secondLastPrice) * 100;

  const historicalHigh = Math.max(...priceHistory.map(entry => entry.price));
  const historicalLow = Math.min(...priceHistory.map(entry => entry.price));

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

    <Box p='4'>
      <Heading mb={5}>
        {coin.name}
      </Heading>
      <Flex direction={{ base: "column", md: "row" }} align="start">
        <VStack spacing="5px" align="start" marginRight={{ base: "0", md: "10" }}>
          <Stat>
            <StatLabel>Current Price</StatLabel>
            <StatNumber fontSize="2xl">{coin.current_price}</StatNumber>
          </Stat>
          <Stat>


            <StatHelpText>
              <HStack>
                <StatArrow type={priceChange > 0 ? 'increase' : 'decrease'} />
                <StatNumber fontSize="xs" color={priceChange > 0 ? 'green.500' : 'red.500'}>{priceChange.toFixed(2)}%</StatNumber>
                <Stat mb='2'>{coin.symbol}</Stat>
              </HStack>
            </StatHelpText>
          </Stat>
          {/* Display the mascot image */}
          <Image src={logoImagePath} alt={`${coin.name} Logo`} boxSize="150px" />

          <HStack spacing="5px">
            <Image src={imagePath} alt={`${coin.name} Mascot`} boxSize="150px" />
          </HStack>

          <Stat>
            <StatHelpText>Highest</StatHelpText>
            <StatNumber fontSize="xs">{historicalHigh}</StatNumber>
          </Stat>
          <Stat>
            <StatHelpText>Lowest</StatHelpText>
            <StatNumber fontSize="xs">{historicalLow}</StatNumber>
          </Stat>
          <Image src={corporateImagePath} alt={`${coin.name} Corporate`} boxSize="150px" marginTop="5" borderRadius='10%' />
        </VStack>

        <Box flex="1">
          <HStack spacing="5px">
            <Text fontSize='sm' mb='5' color='gray.500' mr='3'>{coin.bio}</Text>
            {/* Display the corporate photo */}

          </HStack>
          <div ref={chartContainerRef} style={{ width: '100%', height: '300px', marginTop: '1px' }} />

        </Box>
       <BuyCoin selectedCoin={coin}
       amountToBuy={amountToBuy}
       handleFormBuyClick={handleFormBuyClick}
       handleBuyConfirm={handleBuyConfirm}
       handleInputChange={handleInputChange}
       onClose={onClose}
       isOpen={isOpen} />
       <SellCoin selectedCoin={coin} />
      </Flex>
    </Box>
  );
};

export default CoinDetails;
