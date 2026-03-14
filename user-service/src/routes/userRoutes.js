const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);

// Helper route to fetch user profile via JWT (optional, but good for robust frontend)
router.get('/profile', userController.getProfile);

module.exports = router;
