import React from 'react';
import { Box, Text, Button, FormControl, FormLabel, Input, Modal, ModalOverlay, ModalHeader, ModalFooter, ModalCloseButton, ModalContent, ModalBody } from '@chakra-ui/react';

export function SellCoin({selectedCoin, amountToSell, handleFormSellClick, handleSellConfirm, handleInputChange, onClose, isOpen}) {
  return (
    <Box p='5'>
      <Text fontSize="2xl">Sell Coins</Text>
      <FormControl mt={4}>
        <FormLabel>Coin</FormLabel>
        <Input value={selectedCoin ? selectedCoin.name : ''} isDisabled />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Amount</FormLabel>
        <Input placeholder="Enter Amount" value={amountToSell} onChange={handleInputChange} />
      </FormControl>
      <Button colorScheme="teal" mt={4} onClick={handleFormSellClick}>Sell</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Sale</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to sell {amountToSell} {selectedCoin?.name}?
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