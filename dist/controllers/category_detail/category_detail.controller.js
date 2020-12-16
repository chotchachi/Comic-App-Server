"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const category_detail_crawler = require("./category_detail.crawler");
const util = require("../../util");

class Controller {
    constructor() {
        this.getCategoryDetail = async (req, res) => {
            try {
                const { link } = req.query;
                util.log({ link });
                // check link is valid?
                if (!link) {
                    return res
                        .status(422)
                        .json({
                        message: "Require 'category link' to get category detail",
                        status_code: 422
                    });
                }
                if (typeof link !== 'string' || !util.isValidURL(link)) {
                    return res
                        .status(422)
                        .json({
                        message: "Invalid 'category link' to get category detail",
                        status_code: 422
                    });
                }
                const page = parseInt(req.query.page) || 1;
                const comics = await category_detail_crawler.Crawler.getComics(link, page);
                res.status(200).json(comics);
            } catch (e) {
                util.log(e);
                const error = {
                    message: 'Internal server error',
                    status_code: 500
                };
                res.status(500).json(error);
            }
        };

        this.getPopulars = async (req, res) => {
            try {
                const { link } = req.query;
                util.log({ link });
                // check link is valid?
                if (!link) {
                    return res
                        .status(422)
                        .json({
                        message: "Require 'category link' to get category detail",
                        status_code: 422
                    });
                }
                if (typeof link !== 'string' || !util.isValidURL(link)) {
                    return res
                        .status(422)
                        .json({
                        message: "Invalid 'category link' to get category detail",
                        status_code: 422
                    });
                }
                const comics = await category_detail_crawler.Crawler.getPopularComics(link);
                res.status(200).json(comics);
            }
            catch (e) {
                util.log(e);
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
