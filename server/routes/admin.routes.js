const express = require("express");
const router = express.Router();
const Adminlogin = require("../controller/admin.controller");

router.post("/admin/login", Adminlogin);

module.exports = router;
