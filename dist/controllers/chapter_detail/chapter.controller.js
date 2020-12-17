"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const util = require("../../util");

class Controller {
    constructor(crawler) {
        this.crawler = crawler;
        this.getChapterDetail = async (req, res) => {
            try {
                const { link } = req.query;
                util.log({ link });
                // check link is valid?
                if (!link) {
                    return res
                        .status(422)
                        .json({
                        message: "Require 'chapter link' to get chapter detail",
                        status_code: 422
                    });
                }
                if (typeof link !== 'string' || !util.isValidURL(link)) {
                    return res
                        .status(422)
                        .json({
                        message: "Invalid 'chapter link' to get chapter detail",
                        status_code: 422
                    });
                }
                const chapter = await this.crawler.chapterDetail(link);
                res.status(200).json(chapter);
            }
            catch (e) {
                util.log(e);
                res.status(500)
                    .json({
                    message: 'Internal server error',
                    status_code: 500
                });
            }
        };
    }
}

exports.Controller = Controller;
