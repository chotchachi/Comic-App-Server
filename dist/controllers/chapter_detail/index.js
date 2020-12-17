"use strict";
const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};

Object.defineProperty(exports, "__esModule", { value: true });

const express = __importDefault(require("express"));
const chapter_controller = require("./chapter.controller");
const chapter_crawler = require("./chapter.crawler");

const crawler = new chapter_crawler.Crawler();
const controller = new chapter_controller.Controller(crawler);

const router = express.default.Router();
router.get('/', controller.getChapterDetail);

exports.default = router;
