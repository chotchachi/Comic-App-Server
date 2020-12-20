"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const express = require("express");
const categoryController = require("./category.controller");

const router = express.Router();
router.get('/', categoryController.getAllCategories);

exports.default = router;
