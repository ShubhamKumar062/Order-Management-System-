import axios from './axios';

export const fetchProducts = async (token) => {
  const res = await axios.get('/products', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createProduct = async (product, token) => {
  const res = await axios.post('/products', product, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
