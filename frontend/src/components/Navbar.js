import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  

  const { cartItems, clearCart } = useCart();
  const { currentUser } = useAuth(); 
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const adminUidsString = process.env.REACT_APP_ADMIN_UIDS || '';
  const adminUids = adminUidsString.split(',');
  const isAdmin = currentUser && adminUids.includes(currentUser.uid);
  const totalItemsInCart = cartItems.reduce((total, item) => total + item.qty, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
      setSearchTerm('');
      closeMobileMenu();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      clearCart();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" rx="20" fill="#007bff"></rect>
              <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize="60" fontFamily="Arial, sans-serif" fontWeight="bold" fill="#fff">AS</text>
            </svg>
            <span className="logo-text">Arihant Store</span>
          </Link>

          <div className="menu-icon" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? '✕ Close' : '☰ Menu'}
          </div>

          <div className={isMobileMenuOpen ? "nav-right-section active" : "nav-right-section"}>
            <div className="mobile-auth-section">
              {currentUser ? (
                <>
                  <span className="nav-user-email">Hello, {currentUser.displayName || currentUser.email}</span>
                  <button onClick={() => { handleLogout(); closeMobileMenu(); }} className="nav-links-button">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-links" onClick={closeMobileMenu}>Login</Link>
                  <Link to="/signup" className="nav-links" onClick={closeMobileMenu}>Sign Up</Link>
                </>
              )}
            </div>
            <form className="search-form" onSubmit={handleSearch}>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
              <button type="submit" className="search-button">Search</button>
            </form>
            <ul className="nav-menu">
              <li className="nav-item"><Link to="/category/Study" className="nav-links" onClick={closeMobileMenu}>Study</Link></li>
              <li className="nav-item"><Link to="/category/Toy" className="nav-links" onClick={closeMobileMenu}>Toys</Link></li>
              <li className="nav-item"><Link to="/gift-finder" className="nav-links" onClick={closeMobileMenu}>Gift Finder</Link></li>
              {isAdmin && (<li className="nav-item"><Link to="/admin" className="nav-links admin-link" onClick={closeMobileMenu}>Admin</Link></li>)}
            </ul>
            <div className="nav-auth-links-desktop">
              {currentUser ? (
                <>
                  <span className="nav-user-email">Hello, {currentUser.displayName || currentUser.email}</span>
                  <button onClick={() => { handleLogout(); closeMobileMenu(); }} className="nav-links-button">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-links" onClick={closeMobileMenu}>Login</Link>
                  <Link to="/signup" className="nav-links" onClick={closeMobileMenu}>Sign Up</Link>
                </>
              )}
            </div>
            <Link to="/cart" className="cart-icon-link" onClick={closeMobileMenu}>
              🛒
              {totalItemsInCart > 0 && <span className="cart-badge">{totalItemsInCart}</span>}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};
export default Navbar;