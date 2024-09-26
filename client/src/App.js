import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from './components/Navbar';
import Header from "./components/Header";
import ProductScreen from "./screens/ProductScreen";
import LandingScreen from "./screens/LandingScreen";
import ProductsScreen from "./screens/ProductsScreen";
import LoginScreen from "./screens/LoginScreen";
import EmailVerificationScreen from "./screens/EmailVerificationScreen";
import CartScreen from "./screens/CartScreen";
import Footer from "./components/Footer";
import PasswordResetScreen from "./screens/PasswordResetScreen";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/products" element={<ProductsScreen />} />
            <Route path="/" element={<LandingScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/email-verify/:token" element={<EmailVerificationScreen />} />
            <Route path="/password-reset/:token" element={<PasswordResetScreen />} />

          </Routes>
        </main>
        <Footer />
      </Router>
    </ChakraProvider>
  );
}

export default App;
