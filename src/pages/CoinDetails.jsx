import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { createChart } from 'lightweight-charts';
import { Box, Text, Heading, Spinner } from '@chakra-ui/react';
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
      <Text pb='5' fontSize="xl">Current Price: {coin.current_price}</Text>
      <Text pb='5' fontSize="xl">Price Change: {priceChange.toFixed(2)}%</Text>
      <Text pb='5' fontSize="xl">Historical High: {historicalHigh}</Text>
      <Text pb='5' fontSize="xl">Historical Low: {historicalLow}</Text>
      
      <div ref={chartContainerRef} style={{ width: '100%', height: '300px' }} />

      <Text fontSize='sm' p='5' color='gray.500'>{coin.bio}</Text>
    </Box>
  );
};

export default CoinDetails;
