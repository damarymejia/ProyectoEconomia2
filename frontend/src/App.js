import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Policies from './pages/Policies';
import Analytics from './pages/Analytics';
import Simulator from './pages/Simulator';
import Login from './pages/Login';
import ProtectedRouter from './components/ProtectedRouter';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmation" element={<OrderConfirmation />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/analytics"
              element={
                <ProtectedRouter adminOnly={true}>
                  <Analytics />
                </ProtectedRouter>
              }
            />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}