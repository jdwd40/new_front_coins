import React from 'react';
import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';

export function BuyCoin({selectedCoin, amountToBuy, handleFormBuyClick, handleBuyConfirm, handleInputChange, onClose, isOpen}) {
  return (
    <React.Fragment>
      <Text fontSize="2xl">Buy Coins</Text>
      <FormControl mt={4}>
        <FormLabel>Coin</FormLabel>
        <Input value={selectedCoin ? selectedCoin.name : ''} isDisabled />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Amount</FormLabel>
        <Input placeholder="Enter Amount" value={amountToBuy} onChange={handleInputChange} />
      </FormControl>
      <Button colorScheme="teal" mt={4} onClick={handleFormBuyClick}>Buy</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Purchase</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to purchase {amountToBuy} {selectedCoin?.name}?
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleBuyConfirm}>
              Confirm
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
}
