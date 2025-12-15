const express = require('express')

const router = express.Router()
const {UserController} = require('../../controllers')
const { AuthRequestMiddleware } = require("../../middlewares");

router.post(
  "/signup",
  AuthRequestMiddleware.validateAuthRequest,
  UserController.signup
);
router.post(
  "/signin",
  AuthRequestMiddleware.validateAuthRequest,
  UserController.signin
);
router.post(
  "/role",
  AuthRequestMiddleware.checkAuth,
  AuthRequestMiddleware.isAdmin,
  UserController.addRoletoUser
);

module.exports = router;