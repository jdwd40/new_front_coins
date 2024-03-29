import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import CoinList from './pages/CoinList';
import CoinDetails from './pages/CoinDetails';
import TransactionHistory from './pages/TransactionHistory';
import UserProfile from './pages/UserProfile';
import Navbar from './components/Navbar';
import Portfolio from './pages/Portfolio';
import { AuthProvider } from './contexts/AuthContext';
import { VStack, Flex } from '@chakra-ui/react';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <VStack
          minH={'100vh'}  // Changed from height to minH
          bg='gray.100'
          width='full'
          overflowY='auto'  // Changed from hidden to auto
          spacing={0}
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<CoinList />} />
            <Route path="/coin/:coin_id" element={<CoinDetails />} />
            <Route path="/transactions" element={<TransactionHistory />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </VStack>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
