import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import OrderCard from '../components/OrderCard';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState({
    products: false,
    orders: false,
    placeOrder: false
  });
  const [error, setError] = useState({
    products: null,
    orders: null,
    placeOrder: null
  });
  const [activeTab, setActiveTab] = useState('products'); 

  const headers = {
    Authorization: `Bearer ${user?.token}`
  };

  useEffect(() => {
    getProducts();
    getOrders();
  }, []);

  const getProducts = async () => {
    try {
      setLoading(prev => ({ ...prev, products: true }));
      setError(prev => ({ ...prev, products: null }));
      
      const res = await axios.get('/products', { headers });
      if (res.data.success) {
        setProducts(res.data.data);
      } else {
        setError(prev => ({ ...prev, products: res.data.message }));
      }
    } catch (err) {
      setError(prev => ({ ...prev, products: err.response?.data?.message || 'Failed to fetch products' }));
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  const getOrders = async () => {
    try {
      setLoading(prev => ({ ...prev, orders: true }));
      setError(prev => ({ ...prev, orders: null }));
      
      const res = await axios.get('/orders', { headers });
      if (res.data.success) {
        setOrders(res.data.data);
      } else {
        setError(prev => ({ ...prev, orders: res.data.message }));
      }
    } catch (err) {
      setError(prev => ({ ...prev, orders: err.response?.data?.message || 'Failed to fetch orders' }));
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  const placeOrder = async () => {
    try {
      if (!validateOrder()) return;
      
      setLoading(prev => ({ ...prev, placeOrder: true }));
      setError(prev => ({ ...prev, placeOrder: null }));

      const order = {
        items: [{ product: selected._id, quantity: Number(qty) }],
        totalAmount: selected.price * qty,
        paymentReceived: true
      };

      const res = await axios.post('/orders', order, { headers });
      
      if (res.data.success) {
        alert(res.data.message || 'Order placed successfully!');
        setSelected(null);
        setQty(1);
        getOrders(); 
        getProducts();
        setActiveTab('orders'); 
      } else {
        setError(prev => ({ ...prev, placeOrder: res.data.message }));
      }
    } catch (err) {
      setError(prev => ({ 
        ...prev, 
        placeOrder: err.response?.data?.message || 'Failed to place order' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, placeOrder: false }));
    }
  };

  const validateOrder = () => {
    if (!selected) {
      setError(prev => ({ ...prev, placeOrder: 'Please select a product' }));
      return false;
    }
    if (qty < 1) {
      setError(prev => ({ ...prev, placeOrder: 'Quantity must be at least 1' }));
      return false;
    }
    if (qty > selected.stock) {
      setError(prev => ({ 
        ...prev, 
        placeOrder: `Only ${selected.stock} units available` 
      }));
      return false;
    }
    return true;
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Customer Dashboard</h2>

      <div className="mb-4">
        <button
          className={`mr-4 px-4 py-2 ${activeTab === 'products' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'orders' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('orders')}
        >
          My Orders
        </button>
      </div>

      {selected && (
        <div className="mb-4 p-4 border rounded">
          <h3 className="text-xl font-semibold mb-2">Placing Order for: {selected.name}</h3>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="1"
              max={selected.stock}
              value={qty}
              onChange={e => setQty(Number(e.target.value))}
              className="border p-2 w-24"
            />
            <button 
              onClick={placeOrder}
              disabled={loading.placeOrder}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {loading.placeOrder ? 'Placing Order...' : 'Confirm Order'}
            </button>
            <button 
              onClick={() => setSelected(null)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
          {error.placeOrder && (
            <p className="text-red-500 mt-2">{error.placeOrder}</p>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Available Products</h3>
          {loading.products ? (
            <p>Loading products...</p>
          ) : error.products ? (
            <p className="text-red-500">{error.products}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(p => (
                <div key={p._id} className="border p-4 rounded">
                  <ProductCard product={p} />
                  <button 
                    onClick={() => setSelected(p)}
                    disabled={p.stock < 1}
                    className={`mt-2 px-4 py-2 rounded w-full ${
                      p.stock < 1 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {p.stock < 1 ? 'Out of Stock' : 'Buy'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">My Orders</h3>
          {loading.orders ? (
            <p>Loading orders...</p>
          ) : error.orders ? (
            <p className="text-red-500">{error.orders}</p>
          ) : orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
