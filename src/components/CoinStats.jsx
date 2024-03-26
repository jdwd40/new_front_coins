import React from 'react';
import { Box, VStack, Stat, StatLabel, StatNumber, StatHelpText, StatArrow } from '@chakra-ui/react';

const CoinStats = ({ coin, priceChange, historicalHigh, historicalLow }) => {
  if (!coin) {
    return null; // Render nothing if no coin data is available
  }

  return (
    <Box flex={1} align="start" marginRight={{ base: "0", md: "10" }}>
      <VStack spacing="5px">
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
    </Box>
  );
};

export default CoinStats;
