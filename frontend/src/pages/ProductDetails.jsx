import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, Number(quantity));
      navigate('/cart');
    }
  };

  if (loading) return <p>Loading product details...</p>;
  if (error || !product) return <div className="alert alert-error">{error || 'Product not found'}</div>;

  return (
    <div>
      <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1.5rem', textDecoration: 'none', color: 'var(--primary-color)' }}>
        <ArrowLeft size={16} /> Back to Products
      </Link>

      <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }}
          />
        </div>

        <div>
          <span className="category" style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase' }}>
            {product.category}
          </span>
          <h1 style={{ margin: '0.5rem 0' }}>{product.name}</h1>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '1rem' }}>
            ${product.price.toFixed(2)}
          </p>
          <p style={{ color: '#475569', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            {product.description}
          </p>

          <p style={{ marginBottom: '1rem', fontWeight: '600', color: product.stock > 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
            Availability: {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </p>

          {product.stock > 0 && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <label htmlFor="quantity" style={{ fontWeight: '600' }}>Quantity:</label>
              <input
                id="quantity"
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                className="form-control"
                style={{ width: '80px' }}
              />
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="btn btn-primary btn-block"
            disabled={product.stock <= 0}
          >
            <ShoppingBag size={18} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
