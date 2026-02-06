const express = require("express");
const router = express.Router();
const auth = require("../middlewear/auth");
const {
  createAddress,
  addressbyid,
  editAddress,
} = require("../controller/address.controller");

router.post("/add", auth, createAddress);
router.get("/get", auth, addressbyid);
router.post("/edit/:id", auth, editAddress);

module.exports = router;
