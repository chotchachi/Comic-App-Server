"use strict";
const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importDefault(require("express"));

const index_controller = require("./index.controller");
const account_controller = require('../account/account.controller');
const auth_middleware = require('../../middleware/auth_middleware');
const controller = new index_controller.Controller();
const router = express.default.Router();

// Comic
router.get('/', (_req, res) => res.status(200).send("<h1>Thanh Quang's Comic App Server Is Running</h1>"));
router.get('/newest_comics', controller.newestComics)
router.get('/updated_comics', controller.updatedComics)
router.get('/most_viewed_comics', controller.mostViewedComics)

// Account
router.post('/users/register', account_controller.register)
router.post('/users/login', account_controller.login)
//router.use(auth_middleware.isAuth)
router.post('/users/logout', account_controller.logout)
router.get('/users/all', account_controller.allAccount)
router.get('/users/me', account_controller.me)
router.get('/users/token', account_controller.isTokenValid)
router.delete('/users/logout:token', account_controller.logout)
exports.default = router;
