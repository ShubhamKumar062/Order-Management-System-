const Product = require('../model/product');

module.exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, stock } = req.body;

    if (!name || !price || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, price and stock'
      });
    }
    if (price < 0 || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price and stock must be positive numbers'
      });
    }
    const product = await Product.create({
      name,
      price,
      description,
      stock
    });
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: err.message
    });
  }
};

module.exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().select('-__v');
    
    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      count: products.length,
      data: products
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving products',
      error: err.message
    });
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
