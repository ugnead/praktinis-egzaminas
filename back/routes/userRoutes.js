const express = require('express');
const router = express.Router();

const { registerUser } = require('../controllers/userController');
const { loginUser } = require('../controllers/userController');

// Route for creating a new user
// router.post('/', createUser);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

module.exports = router;