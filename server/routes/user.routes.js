const express = require("express");
const router = express.Router();
const {
  register,
  alluser,
  login,
  getme,
  userById,
  deletuser,
  edituser,
} = require("../controller/user.controller");
const { upload } = require("../middlewear/uploads");
const auth = require("../middlewear/auth");

router.post("/register", upload.single("images"), register);
router.post("/login", login);
router.get("/users", alluser);
router.get("/currentuser", auth, getme);
router.get("/users/:id", userById);
router.delete("/users/:id", deletuser);
router.put("/users/:id", upload.single("images"), edituser);

module.exports = router;
