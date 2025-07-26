import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px' }}>
      <h4>{product.name}</h4>
      <p>Stock: {product.stock}</p>
      <p>Price: ₹{product.price}</p>
      <p>{product.description}</p>
    </div>
  );
};

export default ProductCard;
