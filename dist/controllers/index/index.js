"use strict";
const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importDefault(require("express"));

const index_controller = require("./index.controller");
const controller = new index_controller.Controller();
const router = express.default.Router();

// Comic
router.get('/', (_req, res) => res.status(200).send("<h1>Comic App Server Is Running</h1>"));
router.get('/newest_comics', controller.newestComics)
router.get('/updated_comics', controller.updatedComics)
router.get('/most_viewed_comics', controller.mostViewedComics)

exports.default = router;
