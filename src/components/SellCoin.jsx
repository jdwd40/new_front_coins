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

export function SellCoin({ selectedCoin, amountToSell, handleFormSellClick, handleSellConfirm, handleInputChange, onClose, isOpen }) {
  const totalEarnings = selectedCoin ? amountToSell * selectedCoin.current_price : 0;

  return (
    <>
      <Box p={['2', '4', '5']} mb={[2, 4, 5]} w={['100%', '80%', '60%']} mx="auto">
        <Text fontSize={['lg', 'xl', '2xl']} mb={[2, 3, 4]}>
          Sell Coins
        </Text>

        <UserFunds />

        <FormControl mt={['2', '3', '4']}>
          <FormLabel fontSize={['sm', 'md', 'lg']}>Coin</FormLabel>
          <Input fontSize={['sm', 'md', 'lg']} value={selectedCoin ? selectedCoin.name : ''} isDisabled />
        </FormControl>

        <FormControl mt={['2', '3', '4']}>
          <FormLabel fontSize={['sm', 'md', 'lg']}>Amount</FormLabel>
          <Input
            fontSize={['sm', 'md', 'lg']}
            placeholder="Enter Amount"
            value={amountToSell}
            onChange={handleInputChange}
          />
        </FormControl>

        <Text mt={['1', '2', '2']} fontSize={['sm', 'md', 'lg']}>
          Current Price: ${selectedCoin ? selectedCoin.current_price : '-'}
        </Text>

        <Text mt={['1', '2', '2']} fontSize={['sm', 'md', 'lg']}>
          Total Earnings: ${totalEarnings.toFixed(2)}
        </Text>

        <Button colorScheme="teal" mt={['2', '3', '4']} fontSize={['sm', 'md', 'lg']} onClick={handleFormSellClick}>
          Sell
        </Button>
      </Box>

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
    </>

  );
}

export default SellCoin;
