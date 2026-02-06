const express = require("express");
const PORT = process.env.PORT || 3000;
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const app = express();
const userroutes = require("./routes/user.routes");
const connectDB = require("./config/db");
const productroutes = require("./routes/product.routes");
const cartrouter = require("./routes/cart.routes");
const addressrouter = require("./routes/address.routes");
const orderrouter = require("./routes/order.routes");
const adminroutes = require("./routes/admin.routes");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/api", userroutes);
app.use("/api/products", productroutes);
app.use("/api/cart", cartrouter);
app.use("/api/address", addressrouter);
app.use("/api/order", orderrouter);
app.use("/api", adminroutes);

app.use("/uploads", express.static("uploads"));

connectDB();

app.get("/", (req, res) => {
  res.send("backend is working");
});

app.listen(PORT, () => {
  console.log("App is running on PORT", PORT);
});
