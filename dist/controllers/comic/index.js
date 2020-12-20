"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const express = require("express");
const comicController = require("./comic.controller");

const router = express.Router();
router.get('/', comicController.allComic);
router.get('/detail', comicController.getComicDetail);
router.get('/chapter', comicController.getChapterDetail);

exports.default = router;
