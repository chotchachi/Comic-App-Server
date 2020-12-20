"use strict";
Object.defineProperty(exports, "__esModule", {value: true});

const comicService = require('../../services/comic_service')
const jsonInstance = require('../../utils/JsonUtils')
const util = require("../../util")

class ComicController {
    async allComic(req, res) {
        try {
            const comics = await comicService.getAllComic();
            res.status(200).json(comics);
        } catch (e) {
            res.status(500).json(jsonInstance.jsonMessage('Internal server error'));
        }
    }

    async getComicDetail(req, res) {
        try {
            const {link} = req.query;
            if (!link) {
                return res
                    .status(422)
                    .json(jsonInstance.jsonMessage("Require 'comic link' to get comic detail"));
            }
            if (typeof link !== 'string' || !util.isValidURL(link)) {
                return res
                    .status(422)
                    .json(jsonInstance.jsonMessage("Invalid 'comic link' to get comic detail"));
            }
            const comic = await comicService.getComicDetail(link);
            res.status(200).json(comic);
        } catch (e) {
            res.status(500).json(jsonInstance.jsonMessage('Internal server error'));
        }
    }

}

module.exports = new ComicController();
