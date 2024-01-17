import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { createChart } from 'lightweight-charts';
import { Box, Text, Heading, Spinner, Flex, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, VStack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

const CoinDetails = () => {
  const [coin, setCoin] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chartContainerRef = useRef();
  const lineSeriesRef = useRef(); // Initialize lineSeriesRef her
  const chartRef = useRef();
  const { coin_id } = useParams();

  useEffect(() => {
    const fetchCoin = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://jwd1.xyz/api/coins/${coin_id}`);
        setCoin(response.data.coin);
        setError(null);
      } catch (e) {
        setError(e.toString());
      }

      try {
        const historyResponse = await axios.get(`https://jwd1.xyz/api/history/${coin_id}`);
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
        width: chartContainerRef.current.offsetWidth,
        height: 300,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });
  
      // Assign the line series to lineSeriesRef.current directly
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

  const lastPrice = priceHistory[priceHistory.length - 1]?.price;
  const secondLastPrice = priceHistory[priceHistory.length - 2]?.price;
  const priceChange = lastPrice && secondLastPrice ? ((lastPrice - secondLastPrice) / secondLastPrice) * 100 : 0;

  const historicalHigh = Math.max(...priceHistory.map(entry => entry.price));
  const historicalLow = Math.min(...priceHistory.map(entry => entry.price));

  return (
    <Box p='4'>
      <Heading mb={5}>{coin.name}</Heading>
      <Flex direction={{ base: "column", md: "row" }} align="start">
        <VStack spacing="5px" flex={1} align="start" marginRight={{ base: "0", md: "10" }}>
          <Stat>
            <StatLabel>Current Price</StatLabel>
            <StatNumber fontSize="2xl">{coin.current_price}</StatNumber>
          </Stat>
          <Stat>
            <StatHelpText>
              <StatArrow type={priceChange > 0 ? 'increase' : 'decrease'} />
              <StatNumber fontSize="xs" color={priceChange > 0 ? 'green.500' : 'red.500'}>
                {priceChange.toFixed(2)}%
              </StatNumber>
            </StatHelpText>
          </Stat>
          <Stat>
            <StatHelpText>Highest</StatHelpText>
            <StatNumber fontSize="xs">{historicalHigh}</StatNumber>
          </Stat>
          <Stat>
            <StatHelpText>Lowest</StatHelpText>
            <StatNumber fontSize="xs">{historicalLow}</StatNumber>
          </Stat>
        </VStack>

        <Box flex="3" width='100%'>
          <Heading size="md" mb="4">Price Chart</Heading>
          <div ref={chartContainerRef} style={{ width: '300px', height: '300px' }} />
        </Box>
      </Flex>
    </Box>
  );
};

export default CoinDetails;
