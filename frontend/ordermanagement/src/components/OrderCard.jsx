import React from 'react';

const OrderCard = ({ order }) => {
  return (
    <div style={{ border: '1px solid green', padding: '10px', marginTop: '10px' }}>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total:</strong> ₹{order.totalAmount}</p>
      <p><strong>Items:</strong></p>
      <ul>
        {order.items.map((item, i) => (
          <li key={i}>{item.quantity} x {item.product?.name || 'Product Deleted'}</li>
        ))}
      </ul>
    </div>
  );
};

export default OrderCard;
