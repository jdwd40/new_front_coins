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
// import other pages...

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<CoinList />} />
          <Route path="/coin/:coin_id" element={<CoinDetails />} />
          <Route path="/transactions" element={<TransactionHistory />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
