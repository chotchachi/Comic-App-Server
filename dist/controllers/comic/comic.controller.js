"use strict";
Object.defineProperty(exports, "__esModule", {value: true});

const comicService = require('../../services/comic_service')
const jsonInstance = require('../../utils/JsonUtils')
const util = require("../../util")
const crawler = require('../../crawler/crawler')

class ComicController {
    async allComic(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const comics = await comicService.getAllComic(page);
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

    async getChapterDetail(req, res) {
        try {
            const { link } = req.query;
            if (!link) {
                return res
                    .status(422)
                    .json(jsonInstance.jsonMessage("Require 'chapter link' to get chapter detail"));
            }
            if (typeof link !== 'string' || !util.isValidURL(link)) {
                return res
                    .status(422)
                    .json(jsonInstance.jsonMessage("Invalid 'chapter link' to get chapter detail"));
            }
            const chapter = await crawler.chapterDetail(link);
            res.status(200).json(chapter);
        } catch (e) {
            res.status(500).json(jsonInstance.jsonMessage('Internal server error'));
        }
    };

    async searchComic(req, res) {
        try {
            const { query } = req.query;
            if (query === undefined || query === null) {
                return res
                    .status(422)
                    .json(jsonInstance.jsonMessage("Require 'query' to search comic"));
            }
            if (typeof query !== 'string') {
                return res
                    .status(422)
                    .json(jsonInstance.jsonMessage("Invalid 'query' to search comic"));
            }
            const page = parseInt(req.query.page) || 1;
            const comics = await comicService.searchComic(query, page);
            res.status(200).json(comics);
        } catch (e) {
            res.status(500).json(jsonInstance.jsonMessage('Internal server error'));
        }
    }
}

module.exports = new ComicController();
