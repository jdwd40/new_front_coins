import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { createChart } from 'lightweight-charts';
import { Box, Text, Heading, Spinner, Flex, Stat, StatLabel, StatNumber, VStack, HStack, Image, Grid } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

const CoinDetails = () => {
  const [coin, setCoin] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const lineSeriesRef = useRef();

  const { coin_id } = useParams();

  useEffect(() => {
    const fetchCoin = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:9090/api/coins/${coin_id}`);
        setCoin(response.data.coin);
        setError(null);
      } catch (e) {
        setError(e.toString());
      }

      try {
        const historyResponse = await axios.get(`http://localhost:9090/api/history/${coin_id}`);
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


  const lastPrice = priceHistory[priceHistory.length - 1].price;
  const secondLastPrice = priceHistory[priceHistory.length - 2].price;
  const priceChange = ((lastPrice - secondLastPrice) / secondLastPrice) * 100;

  const historicalHigh = Math.max(...priceHistory.map(entry => entry.price));
  const historicalLow = Math.min(...priceHistory.map(entry => entry.price));

  return (

    <Box p='4'>
      <Heading mb={5}>{coin.name}</Heading>
<Stat mb='2'>{coin.symbol}</Stat>
      <Flex direction={{ base: "column", md: "row" }} align="start">
        <VStack spacing="5px" align="start" marginRight={{ base: "0", md: "10" }}>
          <Stat>
            <StatLabel>Current Price</StatLabel>
            <StatNumber fontSize="2xl">{coin.current_price}</StatNumber>
          </Stat>
          {/* Display the mascot image */}
          <Image src={imagePath} alt={`${coin.name} Mascot`} boxSize="100px" />
          <Stat>
            <StatLabel>Price Change</StatLabel>
            <StatNumber fontSize="xs" color={priceChange > 0 ? 'green.500' : 'red.500'}>{priceChange.toFixed(2)}%</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Highest</StatLabel>
            <StatNumber fontSize="xs">{historicalHigh}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Lowest</StatLabel>
            <StatNumber fontSize="xs">{historicalLow}</StatNumber>
          </Stat>
        </VStack>

        <Box flex="1">
          <HStack spacing="5px">
            <Text fontSize='sm' mb='5' color='gray.500' mr='3'>{coin.bio}</Text>
            {/* Display the corporate photo */}
            <Image src={corporateImagePath} alt={`${coin.name} Corporate`} boxSize="200px" marginTop="5" borderRadius='10%'/>
          </HStack>
          <div ref={chartContainerRef} style={{ width: '100%', height: '300px', marginTop: '1px' }} />

        </Box>
      </Flex>
    </Box>
  );
};

export default CoinDetails;
