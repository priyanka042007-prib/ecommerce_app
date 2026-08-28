import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ShoppingBag, Search } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const { addToCart } = useContext(CartContext);

  const fetchProducts = () => {
    setLoading(true);
    let url = '/api/products';
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (params.toString()) url += `?${params.toString()}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Products Catalog</h1>

      <div className="filter-bar">
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary">
            <Search size={18} />
          </button>
        </form>

        <select
          className="form-control"
          style={{ width: '200px' }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Fitness">Fitness</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="card product-card">
              <div>
                <img src={product.image} alt={product.name} />
                <span className="category">{product.category}</span>
                <h3 className="title">{product.name}</h3>
                <p className="price">${product.price.toFixed(2)}</p>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Stock: {product.stock}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <Link to={`/products/${product._id}`} className="btn btn-secondary btn-sm btn-block">
                  View
                </Link>
                <button
                  onClick={() => addToCart(product)}
                  className="btn btn-primary btn-sm btn-block"
                  disabled={product.stock <= 0}
                >
                  <ShoppingBag size={16} /> {product.stock > 0 ? 'Add' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
