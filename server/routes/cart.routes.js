const express = require("express");
const router = express.Router();
const {
  addtocart,
  getcart,
  removeFromCart,
  decreasequantity,
  clearCart,
  increasequantity,
} = require("../controller/cart.controller");
const auth = require("../middlewear/auth");

router.post("/addtocart", auth, addtocart);
router.get("/getcart", auth, getcart);
router.post("/clearcart", auth, clearCart);
router.post("/remove", auth, removeFromCart);
router.post("/decrease", auth, decreasequantity);
router.post("/increase", auth, increasequantity);

module.exports = router;
