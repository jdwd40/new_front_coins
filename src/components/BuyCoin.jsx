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
  Toast
} from '@chakra-ui/react';

import UserFunds from './UserFunds';

const BuyCoin = ({ selectedCoin, amountToBuy, handleFormBuyClick, handleBuyConfirm, handleInputChange, onClose, isOpen }) => {
  const totalCost = selectedCoin ? amountToBuy * selectedCoin.current_price : 0;

  return (
    <React.Fragment>
      <Text fontSize="2xl">Buy Coins</Text>
      
      <UserFunds />

      <FormControl mt={4}>
        <FormLabel>Coin</FormLabel>
        <Input value={selectedCoin ? selectedCoin.name : ''} isDisabled />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Amount</FormLabel>
        <Input placeholder="Enter Amount" value={amountToBuy} onChange={handleInputChange} />
      </FormControl>

      <Text mt={2}>
        Total Cost: ${totalCost.toFixed(2)}
      </Text>

      <Button colorScheme="teal" mt={4} onClick={handleFormBuyClick}>Buy</Button>

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
