import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config/api';
import { Package } from 'lucide-react';

const MyOrders = () => {
  const { token, user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/api/orders/my`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  if (!user) {
    return <div className="alert alert-error">Please log in to view your orders.</div>;
  }

  if (loading) return <p>Loading your orders...</p>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>My Orders</h1>

      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <Package size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h3>No Orders Placed Yet</h3>
          <p style={{ color: '#64748b' }}>When you purchase items, your orders will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Order ID:</span>
                  <strong style={{ marginLeft: '0.25rem' }}>{order._id}</strong>
                </div>
                <div>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                Date: {new Date(order.createdAt).toLocaleString()} | Address: {order.shippingAddress}
              </p>

              <table className="cart-table" style={{ marginBottom: '1rem' }}>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem' }}>
                Total Paid: <span style={{ color: 'var(--primary-color)' }}>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
