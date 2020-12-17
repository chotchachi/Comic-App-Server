"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("../../util");

class Crawler {
    static async newestComics(page) {
        const body = await util.GET(`https://ww4.mangafox.online/newmanga/page/${page}`);
        return util.bodyToComicList(body);
    }
    static async updatedComics(page) {
        const body = await util.GET(`https://ww4.mangafox.online/page/${page}`);
        return util.bodyToComicList(body);
    }
    static async mostViewedComics(page) {
        const body = await util.GET(`https://ww4.mangafox.online/topmanga/page/${page}`);
        return util.bodyToComicList(body);
    }
}

exports.Crawler = Crawler;
