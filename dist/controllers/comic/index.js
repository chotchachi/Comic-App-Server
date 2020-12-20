"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const express = require("express");
const detailController = require("./detail.controller");

const router = express.Router();
router.get('/', detailController.allComic);
router.get('/detail', detailController.getComicDetail);

exports.default = router;
