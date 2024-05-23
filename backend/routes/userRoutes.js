const express = require('express');
const userControllers = require('../controllers/userControllers');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', userControllers.login);
router.post('/register', userControllers.register);

//protected
router.get('/logout', authMiddleware, userControllers.logout);

module.exports = router;