"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
const categoryService = require("../../services/category_service")

class Controller {
    constructor(crawler) {
        this.crawler = crawler;

        this.getAllCategories = async (_req, res) => {
            try {
                const categories = await this.crawler.allCategories();
                res.status(200).json(categories);
            }
            catch (e) {
                util_1.log(e);
                const error = {
                    message: 'Internal server error',
                    status_code: 500
                };
                res.status(500).json(error);
            }
        };

        this.saveDatabase = async (_req, res) => {
            try {
                const categories = await this.crawler.saveCategories();
                //await categoryService.addCategories(categories)
                res.status(200).json(categories);
            }
            catch (e) {
                const error = {
                    message: 'Internal server error',
                    status_code: 500
                };
                res.status(500).json(error);
            }
        };
    }
}

exports.Controller = Controller;
