import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createProduct, fetchProducts } from '../api/product';
import { fetchAllOrders, updateStatus } from '../api/order';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', stock: '', description: '' });

  useEffect(() => {
    const load = async () => {
      const prods = await fetchProducts(user.token);
      const ords = await fetchAllOrders(user.token);
      setProducts(prods);
      setOrders(ords);
    };
    load();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createProduct(form, user.token);
    const prods = await fetchProducts(user.token);
    setProducts(prods);
    alert("Product added");
  };

  const handleStatus = async (id, status) => {
    await updateStatus(id, status, user.token);
    const ords = await fetchAllOrders(user.token);
    setOrders(ords);
  };

  return (
    <div>
      <h2>Welcome Admin, {user.user.name}</h2>
      <button onClick={logout}>Logout</button>

      <h3>Create Product</h3>
      <form onSubmit={handleCreate}>
        <input name="name" placeholder="Product Name" onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input name="price" placeholder="Price" onChange={e => setForm({ ...form, price: e.target.value })} required />
        <input name="stock" placeholder="Stock" onChange={e => setForm({ ...form, stock: e.target.value })} required />
        <input name="description" placeholder="Description" onChange={e => setForm({ ...form, description: e.target.value })} />
        <button type="submit">Create</button>
      </form>

      <h3>All Products</h3>
      <ul>
        {products.map(p => (
          <li key={p._id}>{p.name} - ₹{p.price} - {p.stock} left</li>
        ))}
      </ul>

      <h3>All Orders</h3>
      <ul>
        {orders.map(o => (
          <li key={o._id}>
            <strong>{o.user?.name}</strong> → ₹{o.totalAmount} [{o.status}]
            <select onChange={e => handleStatus(o._id, e.target.value)} value={o.status}>
              <option>Placed</option>
              <option>Picked</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
