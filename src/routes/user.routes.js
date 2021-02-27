const express = require('express');
const router = express.Router();
const { UserController } = require('../controllers');
const userController = new UserController();
const { AdminMiddleware} = require('../middlewares');

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/admin-role", AdminMiddleware, userController.setAdminRole);

module.exports = router;




