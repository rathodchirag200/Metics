const express = require("express");
const router = express.Router();
const {
  addproduct,
  displayproduct,
  deleteproduct,
  editproduct,
  productbyid,
} = require("../controller/product.controller");
const { upload } = require("../middlewear/uploads");

router.post("/add", upload.array("images", 5), addproduct);
router.get("/allproduct", displayproduct);
router.delete("/delete/:id", deleteproduct);
router.put("/edit/:id", upload.array("images", 5), editproduct);
router.get("/product/:id", productbyid);

module.exports = router;
