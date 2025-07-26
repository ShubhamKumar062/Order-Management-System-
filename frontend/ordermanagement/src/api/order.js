import axios from './axios';

export const placeOrder = async (order, token) => {
  const res = await axios.post('/orders', order, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const fetchMyOrder = async (id, token) => {
  const res = await axios.get(`/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const fetchAllOrders = async (token) => {
  const res = await axios.get('/orders/admin', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateStatus = async (id, status, token) => {
  const res = await axios.patch(`/orders/${id}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
