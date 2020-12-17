"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("../../util");
const detail_crawler = require("../comic_detail/detail.crawler");
const comicModel = require('../../models/comic')
const authorModel = require('../../models/author')
const cateModel = require('../../models/categoryOfComic')
const chapterModel = require('../../models/chapter')
const comicService = require("../../services/comic_service")

const crawler = new detail_crawler.Crawler();

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
    static async crawlComics(page) {
        const comicArr = []
        const body = await util.GET(`https://ww4.mangafox.online/topmanga/page/${page}`);
        const comic_links = await util.getComicLink(body);
        for await (const link of comic_links) {
            const comic = await crawler.comicDetail(link)
            const newComic = new comicModel()
            newComic.title = comic.title
            newComic.thumbnail = comic.thumbnail
            newComic.view = comic.view
            newComic.shortened_content = comic.shortened_content
            newComic.link = comic.link
            newComic.categories = comic.categories.map((category) => {
                const newCate = new cateModel()
                newCate.name = category.name
                newCate.link = category.link
                return newCate
            });
            newComic.authors = comic.authors.map((author) => {
                const newAuthor = new authorModel()
                newAuthor.name = author.name
                newAuthor.link = author.link
                return newAuthor
            })
            newComic.chapters = comic.chapters.map((chap) => {
                const newChap = new chapterModel()
                newChap.view = chap.view
                newChap.chapter_name = chap.chapter_name
                newChap.time = chap.time
                newChap.chapter_link = chap.chapter_link
                return newChap
            })
            await comicService.addComic(newComic);
            comicArr.push(comic)
        }
        return comicArr;
    }
}

exports.Crawler = Crawler;
