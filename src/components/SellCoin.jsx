import React from 'react';
import { 
  Box, 
  Text, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  Modal, 
  ModalOverlay, 
  ModalHeader, 
  ModalFooter, 
  ModalCloseButton, 
  ModalContent, 
  ModalBody,
  VStack
} from '@chakra-ui/react';

import UserFunds from './UserFunds';

export function SellCoin({selectedCoin, amountToSell, handleFormSellClick, handleSellConfirm, handleInputChange, onClose, isOpen}) {
  const totalEarnings = selectedCoin ? amountToSell * selectedCoin.current_price : 0;

  return (
    <Box p='5'>
      <Text fontSize="2xl">Sell Coins</Text>
      
      <UserFunds />

      <FormControl mt={4}>
        <FormLabel>Coin</FormLabel>
        <Input value={selectedCoin ? selectedCoin.name : ''} isDisabled />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Amount</FormLabel>
        <Input placeholder="Enter Amount" value={amountToSell} onChange={handleInputChange} />
      </FormControl>
      
      <Text mt={2}>
        Current Price: ${selectedCoin ? selectedCoin.current_price : '-'}
      </Text>

      <Text mt={2}>
        Total Earnings: ${totalEarnings.toFixed(2)}
      </Text>

      <Button colorScheme="teal" mt={4} onClick={handleFormSellClick}>Sell</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Sale</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3} align="start">
              <UserFunds />
              <Text>Coin: {selectedCoin ? selectedCoin.name : '-'}</Text>
              <Text>Amount: {amountToSell}</Text>
              <Text>Current Price: ${selectedCoin ? selectedCoin.current_price : '-'}</Text>
              <Text>Total Earnings: ${totalEarnings.toFixed(2)}</Text>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSellConfirm}>
              Confirm
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default SellCoin;
