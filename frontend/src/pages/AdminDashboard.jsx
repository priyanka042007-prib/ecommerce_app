import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config/api';
import { Plus, Edit, Trash2, Shield, Package } from 'lucide-react';

const AdminDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('products');

  // Products State
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'Electronics',
    stock: ''
  });

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user?.role !== 'admin') return;

    fetchProducts();
    fetchOrders();
  }, [user]);

  const fetchProducts = () => {
    setProductLoading(true);
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setProductLoading(false);
      })
      .catch((err) => console.error(err));
  };

  const fetchOrders = () => {
    setOrdersLoading(true);
    fetch(`${API_URL}/api/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setOrdersLoading(false);
      })
      .catch((err) => console.error(err));
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="alert alert-error">
        Access Denied. You must be logged in as an Admin to view this page.
      </div>
    );
  }

  // Handle Product Add/Edit Form Submit
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const url = editingProduct ? `${API_URL}/api/products/${editingProduct._id}` : `${API_URL}/api/products`;
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productForm)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Operation failed');

      setMessage({
        type: 'success',
        text: editingProduct ? 'Product updated successfully!' : 'Product created successfully!'
      });

      resetProductForm();
      fetchProducts();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const startEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock
    });
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      image: '',
      category: 'Electronics',
      stock: ''
    });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete product');

      setMessage({ type: 'success', text: 'Product deleted successfully!' });
      fetchProducts();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update order status');

      setMessage({ type: 'success', text: `Order status updated to ${newStatus}` });
      fetchOrders();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <Shield size={28} color="var(--primary-color)" />
        <h1>Admin Control Panel</h1>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type === 'error' ? 'error' : 'success'}`}>
          {message.text}
        </div>
      )}

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Manage Products
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Manage Orders ({orders.length})
        </button>
      </div>

      {activeTab === 'products' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
          <div>
            <h3>Product List</h3>
            {productLoading ? (
              <p>Loading products...</p>
            ) : (
              <div className="card" style={{ padding: '0.5rem 1rem', marginTop: '1rem' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => (
                      <tr key={prod._id}>
                        <td>
                          <img src={prod.image} alt={prod.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                        </td>
                        <td style={{ fontWeight: '600' }}>{prod.name}</td>
                        <td>{prod.category}</td>
                        <td>${prod.price.toFixed(2)}</td>
                        <td>{prod.stock}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => startEditProduct(prod)}
                              className="btn btn-secondary btn-sm"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod._id)}
                              className="btn btn-danger btn-sm"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <div className="card">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <form onSubmit={handleProductSubmit} style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="form-control"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    required
                    placeholder="https://..."
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    required
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  ></textarea>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary btn-block">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  {editingProduct && (
                    <button type="button" onClick={resetProductForm} className="btn btn-secondary">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h3>All Customer Orders</h3>
          {ordersLoading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p style={{ marginTop: '1rem' }}>No orders placed yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {orders.map((order) => (
                <div key={order._id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div>
                      <div><strong>Order ID:</strong> {order._id}</div>
                      <div><strong>Customer:</strong> {order.user?.name} ({order.user?.email})</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Date: {new Date(order.createdAt).toLocaleString()}</div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Update Status:</label>
                      <select
                        className="form-control"
                        style={{ width: '160px' }}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <strong>Shipping Address:</strong> {order.shippingAddress}
                  </p>

                  <div style={{ background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '4px', margin: '0.5rem 0' }}>
                    {order.items.map((item, idx) => (
                      <span key={idx} style={{ fontSize: '0.85rem', marginRight: '1rem' }}>
                        • {item.name} (x{item.quantity}) - ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    ))}
                  </div>

                  <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    Total: <span style={{ color: 'var(--primary-color)' }}>${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
