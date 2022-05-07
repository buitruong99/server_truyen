const authController = require('../controllers/authControllers');
const middleware = require('../controllers/middlewave');

const router = require('express').Router();

// register
router.post('/register', authController.registerUser)

// login
router.post('/login', authController.loginUser)

//refreshToken
router.post('/refresh', authController.requestRefreshToken)

// logout
router.post('/logout', middleware.verifyToken, authController.userLogout)

module.exports = router;