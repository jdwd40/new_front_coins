import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  useDisclosure,
  Collapse,
  IconButton,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';

function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const buttonBg = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box bgGradient="linear(to-r, green.800, blue.500)" px={4} mb={1}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={onToggle}
        />
        <Text
          fontSize={'1xl'}
          fontFamily={'monospace'}
          fontWeight={600} // Increased font weight
          color="white"
        >
          Crypto Coins Exchange Simulator
        </Text>
        <Box display={{ base: 'none', md: 'flex' }}>
          <Navigation />
        </Box>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNavigation />
      </Collapse>
    </Box>
  );
}


function Navigation() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const buttonBg = useColorModeValue('gray.200', 'gray.700');

  return (
    <Stack direction={'row'} spacing={6}>
      <Button
        as={RouterLink}
        to="/"
        colorScheme={'teal'}
        variant={'solid'}
        bg={location.pathname === '/' ? buttonBg : null}
        _hover={{ bg: 'gray.300', color: 'teal.700' }}
      >
        Buy Coins
      </Button>
      {!user && (
        <Button
          as={RouterLink}
          to="/login"
          colorScheme={'teal'}
          variant={'solid'}
          bg={location.pathname === '/login' ? buttonBg : null}
          _hover={{ bg: 'gray.300', color: 'teal.700' }}
        >
          Login
        </Button>
      )}
      {user && (
        <Button
          as={RouterLink}
          to="/portfolio"
          colorScheme={'teal'}
          variant={'solid'}
          bg={location.pathname === '/portfolio' ? buttonBg : null}
          _hover={{ bg: 'gray.300', color: 'teal.700' }}
        >
          Portfolio
        </Button>
      )}
      {user && (
        <Menu>
          <MenuButton as={Button} colorScheme={'teal'} variant={'solid'} rightIcon={<ChevronDownIcon />} _hover={{ bg: 'gray.300', color: 'teal.700' }}>
            Welcome, {user.username}!
          </MenuButton>
          <MenuList>
            <MenuItem as={RouterLink} to="/portfolio">Portfolio</MenuItem>
            <MenuItem as={RouterLink} to="/transactions">Transactions</MenuItem>
            <MenuItem as={RouterLink} to="/profile">Profile</MenuItem>
          </MenuList>
        </Menu>
      )}
      {user && (
        <Button
          onClick={logout}
          colorScheme={'teal'}
          variant={'solid'}
          _hover={{ bg: 'gray.300', color: 'teal.700' }}
        >
          Logout
        </Button>
      )}
    </Stack>
  );
}

function MobileNavigation() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const buttonBg = useColorModeValue('gray.200', 'gray.700');

  return (
    <Stack p={4} display={{ md: 'none' }}>
      <Button
        as={RouterLink}
        to="/"
        colorScheme={'teal'}
        variant={'link'}
        bg={location.pathname === '/' ? buttonBg : null}
      >
        Home
      </Button>
      {!user && (
        <Button
          as={RouterLink}
          to="/login"
          colorScheme={'white'}
          variant={'solid'}
          bg={location.pathname === '/login' || location.pathname === '/register' ? buttonBg : null}
        >
          Login
        </Button>
      )}
      {user && (
        <Button
          as={RouterLink}
          to="/coins"
          colorScheme={'white'}
          variant={'link'}
          bg={location.pathname === '/' ? buttonBg : null}
        >
          Coins
        </Button>
      )}
      {user && (
        <Menu>
          <MenuButton as={Button} colorScheme={'white'} variant={'link'} rightIcon={<ChevronDownIcon />}>
            Welcome, {user.username}!
          </MenuButton>
          <MenuList>
            <MenuItem as={RouterLink} to="/portfolio">Portfolio</MenuItem>
            <MenuItem as={RouterLink} to="/transactions">Transactions</MenuItem>
            <MenuItem as={RouterLink} to="/profile">Profile</MenuItem>
          </MenuList>
        </Menu>
      )}
      {user && (
        <Button onClick={logout} colorScheme={'whiteAlpha'} variant={'link'}>
          Logout
        </Button>
      )}
    </Stack>
  );
}

export default Navbar;
