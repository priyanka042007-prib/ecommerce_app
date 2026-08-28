import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.slice(0, 4));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <section className="hero">
        <h1>Welcome to QuickCart</h1>
        <p>Your one-stop destination for quality products at unbeatable prices.</p>
        <Link to="/products" className="btn btn-primary">
          Shop All Products <ArrowRight size={18} />
        </Link>
      </section>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Featured Products</h2>
          <Link to="/products" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '600' }}>
            View All &rarr;
          </Link>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div key={product._id} className="card product-card">
                <div>
                  <img src={product.image} alt={product.name} />
                  <span className="category">{product.category}</span>
                  <h3 className="title">{product.name}</h3>
                  <p className="price">${product.price.toFixed(2)}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <Link to={`/products/${product._id}`} className="btn btn-secondary btn-sm btn-block">
                    View
                  </Link>
                  <button
                    onClick={() => addToCart(product)}
                    className="btn btn-primary btn-sm btn-block"
                  >
                    <ShoppingBag size={16} /> Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
