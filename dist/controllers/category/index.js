"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const express = require("express");
const categoryController = require("./category.controller");

const router = express.Router();
router.get('/', categoryController.getAllCategories);
router.get('/popular', categoryController.getPopularComicByCategory);
router.get('/all', categoryController.getAllComicsByCategory);

exports.default = router;
