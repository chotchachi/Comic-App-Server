"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const categoryService = require("../../services/category_service")
const jsonInstance = require('../../utils/JsonUtils')
const util = require('../../util')
const crawler = require('../../crawler/crawler')

class CategoryController {
    async getAllCategories(req, res) {
        try {
            const categories = await categoryService.allCategories();
            res.status(200).json(categories);
        } catch (e) {
            res.status(500).json(jsonInstance.jsonMessage('Internal server error'));
        }
    };

    async getPopularComicByCategory(req, res) {
        try {
            const { link } = req.query;
            if (!link) {
                return res
                    .status(422)
                    .json(jsonInstance.jsonMessage("Require 'category link' to get category popular comics"));
            }
            if (typeof link !== 'string' || !util.isValidURL(link)) {
                return res
                    .status(422)
                    .json(jsonInstance.jsonMessage("Invalid 'category link' to get category popular comics"));
            }
            const comics = await crawler.getPopularComics(link);
            res.status(200).json(comics);
        } catch (e) {
            res.status(500).json(jsonInstance.jsonMessage('Internal server error'));
        }
    }

    async getAllComicsByCategory(req, res) {
        try {
            const { link } = req.query;
            if (!link) {
                return res
                    .status(422)
                    .json(jsonInstance.jsonMessage("Require 'category link' to get category all comics"));
            }
            if (typeof link !== 'string' || !util.isValidURL(link)) {
                return res
                    .status(422)
                    .json(jsonInstance.jsonMessage("Invalid 'category link' to get category all comics"));
            }
            const page = parseInt(req.query.page) || 1;
            const comics = await categoryService.getAllComics(link, page);
            res.status(200).json(comics);
        } catch (e) {
            res.status(500).json(jsonInstance.jsonMessage('Internal server error'));
        }
    }
}

module.exports = new CategoryController();
