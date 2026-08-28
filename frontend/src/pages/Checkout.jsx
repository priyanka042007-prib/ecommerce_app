import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Checkout = () => {
  const { cartItems, totalAmount, clearCart } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  if (!user) {
    return (
      <div style={{ maxWidth: '500px', margin: '2rem auto' }} className="card">
        <h2>Authentication Required</h2>
        <p style={{ margin: '1rem 0' }}>Please log in to your account before placing an order.</p>
        <button onClick={() => navigate('/login')} className="btn btn-primary btn-block">
          Log In Now
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      setError('Please provide a complete shipping address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress,
        totalAmount
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      clearCart();
      navigate('/my-orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        <div>
          <div className="card">
            <h3>Shipping Details</h3>
            <hr style={{ margin: '1rem 0', borderColor: 'var(--border-color)' }} />

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handlePlaceOrder}>
              <div className="form-group">
                <label>Customer Name</label>
                <input type="text" className="form-control" value={user.name} disabled />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-control" value={user.email} disabled />
              </div>

              <div className="form-group">
                <label>Shipping Address</label>
                <textarea
                  className="form-control"
                  rows="4"
                  required
                  placeholder="Enter full street address, city, state, zip code..."
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Processing Order...' : `Confirm & Place Order ($${totalAmount.toFixed(2)})`}
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="card">
            <h3>Order Review</h3>
            <hr style={{ margin: '1rem 0', borderColor: 'var(--border-color)' }} />

            {cartItems.map((item) => (
              <div key={item.product} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                <div>
                  <div style={{ fontWeight: '600' }}>{item.name}</div>
                  <div style={{ color: '#64748b' }}>Qty: {item.quantity} × ${item.price.toFixed(2)}</div>
                </div>
                <div style={{ fontWeight: '600' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            <hr style={{ margin: '1rem 0', borderColor: 'var(--border-color)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
              <span>Total Payable:</span>
              <span style={{ color: 'var(--primary-color)' }}>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
