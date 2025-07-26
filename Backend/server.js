const dotenv = require("dotenv");
const express = require("express");
const connectedDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const { errorHandler } = require('./middleware/errorHandler');
const cors = require("cors");

dotenv.config(); 
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes); 
app.get("/healthz", (req, res) => res.send("OK"));
app.use(errorHandler);

const PORT = process.env.PORT 
connectedDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect DB:", err.message);
  });
