import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import Navbar from './components/Navbar';
import Footer from './components/Footer'; 


import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ToyFinderPage from './pages/ToyFinderPage';
import GiftFinderPage from './pages/GiftFinderPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ContactPage from './pages/ContactPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminPage from './pages/AdminPage';
import AdminOrders from './pages/AdminOrders';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminProductEditPage from './pages/AdminProductEditPage';
import AdminRequestsPage from './pages/AdminRequestsPage';

function App() {
  return (
    <Router>
      <div className="app-container"> 
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/Toy" element={<ToyFinderPage />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/gift-finder" element={<GiftFinderPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            
            <Route path="/admin" element={<AdminPage />}>
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="requests" element={<AdminRequestsPage />} />
              <Route path="products/new" element={<AdminProductEditPage />} />
              <Route path="products/edit/:id" element={<AdminProductEditPage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;