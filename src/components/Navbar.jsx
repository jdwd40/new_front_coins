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
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const buttonBg = useColorModeValue('gray.200', 'gray.700');

  console.log('from navbar', user);
  return (
    <Box bg="teal.500" px={4}>
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
          fontWeight={500}
          color="white"
        >
          Crypto Coins Exchange Simulator
        </Text>
        <Text
          fontSize={'1xl'}
          fontFamily={'monospace'}
          fontWeight={500}
          color="white"
        >
          {user ? `Welcome, ${user.username}!` : 'Welcome, guest!'}
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
        variant={'link'}
        bg={location.pathname === '/' ? buttonBg : null}
      >
        Home
      </Button>
      {!user && (
        <Button
          as={RouterLink}
          to="/login"
          colorScheme={'teal'}
          variant={'link'}
          bg={location.pathname === '/login' ? buttonBg : null}
        >
          Login
        </Button>
      )}
      {!user && (
        <Button
          as={RouterLink}
          to="/register"
          colorScheme={'teal'}
          variant={'link'}
          bg={location.pathname === '/register' ? buttonBg : null}
        >
          Register
        </Button>
      )}
      {user && (
        <Button
          as={RouterLink}
          to="/coins"
          colorScheme={'teal'}
          variant={'link'}
          bg={location.pathname === '/coins' ? buttonBg : null}
        >
          Coins
        </Button>
      )}
      {user && (
        <Button
          as={RouterLink}
          to="/portfolio"
          colorScheme={'teal'}
          variant={'link'}
          bg={location.pathname === '/portfolio' ? buttonBg : null}
        >
          Portfolio
        </Button>
      )}
      {user && (
        <Button
          as={RouterLink}
          to="/transactions"
          colorScheme={'teal'}
          variant={'link'}
          bg={location.pathname === '/transactions' ? buttonBg : null}
        >
          Transactions
        </Button>
      )}
      {user && (
        <Button
          as={RouterLink}
          to="/profile"
          colorScheme={'teal'}
          variant={'link'}
          bg={location.pathname === '/profile' ? buttonBg : null}
        >
          Profile
        </Button>
      )}
      {user && (
        <Button onClick={logout} colorScheme={'teal'} variant={'link'}>
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
    <Stack bg="teal.500" p={4} display={{ md: 'none' }}>
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
          colorScheme={'teal'}
          variant={'link'}
          bg={location.pathname === '/login' ? buttonBg : null}
        >
          Login
        </Button>
      )}
      {!user && (
        <Button
          as={RouterLink}
          to="/register"
          colorScheme={'teal'}
          variant={'link'}
          bg={location.pathname === '/register' ? buttonBg : null}
        >
          Register
        </Button>
      )}
      {user && (
        <Button
          as={RouterLink}
          to="/coins"
          colorScheme={'teal'}
          variant={'link'}
          bg={location.pathname === '/coins' ? buttonBg : null}
        >
          Coins
        </Button>
      )}
      {user && (
        <Button
          as={RouterLink}
          to="/portfolio"
          colorScheme={'teal'}
          variant={'link'}
          bg={location.pathname === '/portfolio' ? buttonBg : null}
        >
          Portfolio
        </Button>
      )}
      {user && (
        <Button
          as={RouterLink}
          to="/transactions"
          colorScheme={'teal'}
          variant={'link'}
          bg={location.pathname === '/transactions' ? buttonBg : null}
        >
          Transactions
        </Button>
      )}
      {user && (
        <Button
          as={RouterLink}
          to="/profile"
          colorScheme={'teal'}
          variant={'link'}
          bg={location.pathname === '/profile' ? buttonBg : null}
        >
          Profile
        </Button>
      )}
      {user && (
        <Button onClick={logout} colorScheme={'teal'} variant={'link'}>
          Logout
        </Button>
      )}
    </Stack>
  );
}

export default Navbar;
