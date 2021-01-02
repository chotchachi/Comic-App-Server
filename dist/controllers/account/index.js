"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const express = require("express");
const account_controller = require('../account/account.controller');
const auth_middleware = require('../../middleware/auth_middleware');

const router = express.Router();
router.post('/register', account_controller.register)
router.post('/login', account_controller.login)
//router.use(auth_middleware.isAuth)
router.post('/logout', account_controller.logout)
router.get('/all', account_controller.allAccount)
router.get('/me', account_controller.me)
router.get('/token', account_controller.isTokenValid)
router.delete('/logout:token', account_controller.logout)

exports.default = router;
