import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, totalAmount, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <ShoppingBag size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
        <h2>Your Cart is Empty</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Looks like you haven't added any products to your cart yet.</p>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Shopping Cart</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
        <div>
          <div className="card" style={{ padding: '0.5rem 1rem' }}>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.product}>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                      <Link to={`/products/${item.product}`} style={{ textDecoration: 'none', color: 'var(--text-color)', fontWeight: '600' }}>
                        {item.name}
                      </Link>
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>
                      <div className="quantity-control">
                        <button onClick={() => updateQuantity(item.product, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product, item.quantity + 1)}>+</button>
                      </div>
                    </td>
                    <td style={{ fontWeight: '600' }}>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button
                        onClick={() => removeFromCart(item.product)}
                        style={{ border: 'none', background: 'none', color: 'var(--danger-color)', cursor: 'pointer' }}
                        title="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={clearCart} className="btn btn-secondary btn-sm">
              Clear Cart
            </button>
            <Link to="/products" className="btn btn-secondary btn-sm">
              Continue Shopping
            </Link>
          </div>
        </div>

        <div>
          <div className="card">
            <h3>Order Summary</h3>
            <hr style={{ margin: '1rem 0', borderColor: 'var(--border-color)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Items Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>Shipping</span>
              <span style={{ color: 'var(--success-color)', fontWeight: '600' }}>FREE</span>
            </div>
            <hr style={{ margin: '1rem 0', borderColor: 'var(--border-color)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary-color)' }}>${totalAmount.toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-block"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
