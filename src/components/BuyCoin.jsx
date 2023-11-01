import React, { useContext } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  Toast,
  Box
} from '@chakra-ui/react';

import UserFunds from './UserFunds';

const BuyCoin = ({ selectedCoin, amountToBuy, handleFormBuyClick, handleBuyConfirm, handleInputChange, onClose, isOpen }) => {
  const totalCost = selectedCoin ? amountToBuy * selectedCoin.current_price : 0;

  return (
    <React.Fragment>
      <Box
        mb={4}
        p={[2, 4, 6]}  // Responsive padding: [small screen, medium screen, large screen]
        w={["100%", "80%", "60%"]}  // Responsive width
        mx="auto"  // Centering Box
        boxShadow="md"  // Adding a medium box shadow
        borderWidth={1}  // Adding a border
        borderRadius="md"  // Rounded corners
      >
        <Text fontSize={["md", "xl", "2xl"]} textAlign="center">Buy Coins</Text>  {/* Responsive font size */}

        <UserFunds />

        <FormControl mt={4}>
          <FormLabel fontSize={["sm", "md", "lg"]}>Coin</FormLabel>  {/* Responsive font size */}
          <Input value={selectedCoin ? selectedCoin.name : ''} isDisabled />
        </FormControl>

        <FormControl mt={4}>
          <FormLabel fontSize={["sm", "md", "lg"]}>Amount</FormLabel>  {/* Responsive font size */}
          <Input
            placeholder="Enter Amount"
            value={amountToBuy}
            onChange={handleInputChange}
            size={["sm", "md", "lg"]}  // Responsive input size
          />
        </FormControl>

        <Text mt={['1', '2', '2']} fontSize={['sm', 'md', 'lg']}>
          Current Price: ${selectedCoin ? selectedCoin.current_price : '-'}
        </Text>

        <Text mt={2} fontSize={["sm", "md", "lg"]}>  {/* Responsive font size */}
          Total Cost: $ {totalCost.toFixed(2)}
        </Text>

        <Button
          colorScheme="teal"
          mt={4}
          w="100%"  // Full width to occupy container
          size={["sm", "md", "lg"]}  // Responsive button size
          onClick={handleFormBuyClick}
        >
          Buy
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Purchase</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3} align="start">
              <UserFunds />
              <Text>Coin: {selectedCoin ? selectedCoin.name : '-'}</Text>
              <Text>Amount: {amountToBuy}</Text>
              <Text>Total Cost: ${totalCost.toFixed(2)}</Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleBuyConfirm}>Confirm</Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
}

export default BuyCoin;
