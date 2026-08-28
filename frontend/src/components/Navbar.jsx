import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, Store, User, LogOut, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { totalItemsCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-brand">
          <Store size={24} />
          QuickCart
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/cart" style={{ display: 'flex', alignItems: 'center' }}>
              <ShoppingCart size={18} />
              <span style={{ marginLeft: '4px' }}>Cart</span>
              {totalItemsCount > 0 && <span className="cart-badge">{totalItemsCount}</span>}
            </Link>
          </li>

          {user ? (
            <>
              {user.role === 'admin' && (
                <li>
                  <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0284c7' }}>
                    <Shield size={16} /> Admin
                  </Link>
                </li>
              )}
              <li>
                <Link to="/my-orders">My Orders</Link>
              </li>
              <li>
                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  Hi, {user.name.split(' ')[0]}
                </span>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <LogOut size={14} /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
