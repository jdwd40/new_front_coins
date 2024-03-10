// Sidebar.jsx
import { Box, Text, VStack, Heading } from '@chakra-ui/react';

const Sidebar = ({ totalMarketValue, coins }) => {
  const prices = coins.map(coin => parseFloat(coin.current_price));
  const lowestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);
  const averagePrice = prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0;

  return (
    <Box
    w="180px" // Narrower width
    bgGradient="linear(to-l, #7928CA, #FF0080)" // Gradient background
    color="white"
    p={4}
    borderRight="1px solid" // Add border
    borderColor="gray.200"
    boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)" // Add shadow
  >
    <VStack spacing={4} align="stretch">
      <Heading size="md" mb={4}>Market Overview</Heading> {/* Professional title */}
      <Text fontSize="sm">Total Market Value: ${totalMarketValue.toFixed(2)}</Text>
      <Text fontSize="sm">Highest Price: ${highestPrice.toFixed(8)}</Text>
      <Text fontSize="sm">Lowest Price: ${lowestPrice.toFixed(8)}</Text>
      <Text fontSize="sm">Average Price: ${averagePrice.toFixed(8)}</Text>
    </VStack>
  </Box>
  );
};

export default Sidebar;
