import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { createChart } from 'lightweight-charts';
import { Box, Text, Heading, Spinner, Flex, Stat, StatLabel, StatNumber, VStack, HStack } from '@chakra-ui/react';
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

  const lastPrice = priceHistory[priceHistory.length - 1].price;
  const secondLastPrice = priceHistory[priceHistory.length - 2].price;
  const priceChange = ((lastPrice - secondLastPrice) / secondLastPrice) * 100;

  const historicalHigh = Math.max(...priceHistory.map(entry => entry.price));
  const historicalLow = Math.min(...priceHistory.map(entry => entry.price));

  return (
    <Box p='5'>
      <Heading mb={4}>{coin.name}</Heading>
      <Flex justify="space-between">
        <Stat>
          <StatLabel>Current Price</StatLabel>
          <StatNumber fontSize="2xl">{coin.current_price}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Price Change</StatLabel>
          <StatNumber fontSize="sm" color={priceChange > 0 ? 'green.500' : 'red.500'}>{priceChange.toFixed(2)}%</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Historical High</StatLabel>
          <StatNumber fontSize="sm">{historicalHigh}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Historical Low</StatLabel>
          <StatNumber fontSize="sm">{historicalLow}</StatNumber>
        </Stat>
      </Flex>
      <Box mt={4} mb={4}>
        <HStack>
          <Box w='50%'>
            <Text fontSize='sm' p='5' color='gray.500'>{coin.bio}</Text>
          </Box>
          <div ref={chartContainerRef} style={{ width: '50%', height: '300px', marginTop: '1px' }} />
        </HStack>

      </Box>
    </Box>

  );
};

export default CoinDetails;
