"use strict";
const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};

Object.defineProperty(exports, "__esModule", { value: true });

const express = __importDefault(require("express"));
const category_detail_controller = require("./category_detail.controller");
const controller = new category_detail_controller.Controller();

const router = express.default.Router();
router.get('/', controller.getCategoryDetail);
router.get('/popular', controller.getPopulars);

exports.default = router;
