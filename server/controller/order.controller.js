const Order = require("../model/order");
const Cart = require("../model/cart");
const Address = require("../model/address");

const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId, paymentmethod } = req.body;

    if (!addressId) {
      return res.status(400).json({ message: "Address id is required" });
    }

    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(400).json({ message: "Invalid address selected" });
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.productId.offer_price * item.quantity,
      0,
    );

    const order = new Order({
      userId,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.offer_price,
      })),
      addressId,
      totalAmount,
      paymentmethod,
      orderStatus: "pending",
    });

    await order.save();

    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("items.productId")
      .populate("addressId")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      res
        .status(200)
        .json({ success: false, message: "all fileds are required" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = status;
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getallorders = async (req, res) => {
  try {
    const data = await Order.find()
      .populate("items.productId")
      .populate("addressId")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  updateOrderStatus,
  getallorders,
};
