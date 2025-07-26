const Order = require('../model/orders');
const Product = require('../model/product');

module.exports.placeOrder = async (req, res) => {
  const { items, totalAmount, paymentReceived } = req.body;
  const userId = req.user.id;

  try {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one item in the order'
      });
    }

    if (totalAmount === undefined || totalAmount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid total amount'
      });
    }
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.product} not found`
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${product.name}. Available: ${product.stock}`
        });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: userId,
      items,
      totalAmount,
      paymentReceived
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error placing order',
      error: err.message
    });
  }
};

module.exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order){
      return res.status(404).json({ message: 'Order not found' });
    } 
    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id }).populate('items.product');
    if (!order){
       return res.status(404).json({ message: 'Not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
