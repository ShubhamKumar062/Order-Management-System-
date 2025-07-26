const mongoose = require('mongoose');

const connectedDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected`);
  } catch (err) {
    console.error('MongoDB Connection Failed:', err.message);
  }
};

module.exports = connectedDB;