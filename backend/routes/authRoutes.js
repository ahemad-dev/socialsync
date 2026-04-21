const express = require("express");
const router = express.Router();
const { register, login, forgotPassword, resetPassword } = require("../controllers/authController");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Forgot Password (email bhejna)
router.post("/forgot-password", forgotPassword);

// Reset Password (new password set karna)
router.put("/reset-password/:token", resetPassword);


module.exports = router;
