"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_crawler = require("./index.crawler");
const util = require("../../util");

class Controller {
    constructor() {
        this.newestComics = async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const comics = await index_crawler.Crawler.newestComics(page);
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

        this.updatedComics = async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const comics = await index_crawler.Crawler.updatedComics(page);
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

        this.mostViewedComics = async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const comics = await index_crawler.Crawler.mostViewedComics(page);
                res.status(200).json(comics);
            }
            catch (e) {
                util.log(e);
                const error = {
                    message: 'Internal server error',
                    status_code: 500,
                };
                res.status(500).json(error);
            }
        };

        this.crawlerComics = async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const comics = await index_crawler.Crawler.getComicLink(page);
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
