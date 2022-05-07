const middleware = require('../controllers/middlewave');
const userController = require('../controllers/userControllers');

const router = require('express').Router();


router.get('/',middleware.verifyToken, userController.getAllUsers )
router.delete('/:id', middleware.verifyTokenAndAdminAuth, userController.deleteUsers)

module.exports = router ;