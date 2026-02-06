const express = require("express");
const router = express.Router();
const auth = require("../middlewear/auth");
const {
  placeOrder,
  getMyOrders,
  updateOrderStatus,
  getallorders,
} = require("../controller/order.controller");

router.post("/add", auth, placeOrder);
router.get("/get", auth, getMyOrders);
router.post("/updatestaus", updateOrderStatus);
router.get("/allorders", getallorders);

module.exports = router;
