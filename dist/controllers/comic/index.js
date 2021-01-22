"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const express = require("express");
const comicController = require("./comic.controller");

const router = express.Router();
router.get('/all', comicController.allComic);
router.get('/search', comicController.searchComic);
router.get('/detail', comicController.getComicDetail);
router.get('/chapter', comicController.getChapterDetail);

exports.default = router;
