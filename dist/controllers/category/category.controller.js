"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const categoryService = require("../../services/category_service")
const jsonInstance = require('../../utils/JsonUtils')

class CategoryController {
    async getAllCategories(req, res) {
        try {
            const categories = await categoryService.allCategories();
            res.status(200).json(categories);
        } catch (e) {
            res.status(500).json(jsonInstance.jsonMessage('Internal server error'));
        }
    };

}

module.exports = new CategoryController();
