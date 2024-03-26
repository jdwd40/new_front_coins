import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { createChart } from 'lightweight-charts';
import { Box, Text, Heading, Spinner, Flex, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, VStack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import Graph from '../components/Graph';
import CoinStats from '../components/CoinStats';

const CoinDetails = () => {
  const [coin, setCoin] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
        const historyResponse = await axios.get(`https://jwd1.xyz/api/history/${coin_id}?amount=120`);
        const allEntries = historyResponse.data.priceHistory;
        setPriceHistory(allEntries);
      } catch (e) {
        setError(e.toString());
      }

      setIsLoading(false);
    };

    fetchCoin();
  }, [coin_id]);

  const priceChange = 0;
  const historicalHigh = 0;
  const historicalLow = 0;

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!coin) {
    return null;
  }


  return (
    <Box p='4'>
      <Heading mb={5}>{coin.name}</Heading>
      <Flex direction={{ base: "column", md: "row" }} align="start">
      <CoinStats 
          coin={coin} 
          priceChange={priceChange} 
          historicalHigh={historicalHigh} 
          historicalLow={historicalLow} 
        />
        <Box flex="1" minW="300px" width="100%">
          <Heading size="md" mb="4">Price Chart</Heading>
          <Graph priceHistory={priceHistory} />
        </Box>
      </Flex>
    </Box>
  );
};

export default CoinDetails;
