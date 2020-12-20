"use strict";
const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};

const categoryModel = require('../models/category')
const util = require("../util");
const cheerio = __importDefault(require("cheerio"));

class CategoryService {
    async allCategories() {
        return await categoryModel.find()
            .exec()
            .then((categories) => {
                return categories;
            })
            .catch((error) => {
                throw new Error(error.message);
            });
    }

    async addCategories(categories) {
        categories.forEach( (item) => {
            try {
                item.save()
                console.log(item.link, ">>>")
            } catch (err) {
                console.log(err, ">>>")
            }
        })
    }

    async addCategory(category) {
        try {
            category.save()
            console.log(category.link, ">>>")
        } catch (err) {
            console.log(err, ">>>")
        }
    }

    async getPopularComics(categoryLink) {
        const body = await util.GET(categoryLink);
        const $ = cheerio.default.load(body);
        return $('div.manga_slide_container > div.fit_thumbnail')
            .toArray()
            .map((e) => {
                const $e = $(e);
                const a = $e.find('a');
                const img = $e.find('a > img');
                const span = $e.find('div.manga_slide_name > span > a');
                return {
                    title: a.attr('title'),
                    link: a.attr('href'),
                    thumbnail: img.attr('src'),
                    last_chapter: {
                        chapter_link: span.attr('href'),
                        chapter_name: span.attr('title')
                    }
                };
            });
    }

    async getAllComics(categoryLink, page) {
        const body = await util.GET(`${categoryLink}/page/${page}`);
        const $ = cheerio.default.load(body);
        return $('div.content_left div.content_grid > ul > li.content_grid_item')
            .toArray()
            .map((liComic) => {
                const $liComic = $(liComic);
                const title = $liComic.find('div.content_grid_item_name > a').text();
                const contentGridItemImg = $liComic.find('div.content_grid_item_img');
                const view = contentGridItemImg.find('div.view').text().trim();
                const link = contentGridItemImg.find('a').attr('href');
                const thumbnail = contentGridItemImg.find('a > img').first().attr('src');
                const last_chapters = $liComic.find('div.content_grid_item_chapter > ul > li')
                    .toArray()
                    .map(liChapter => {
                        const $liChapter = $(liChapter);
                        const chapter_name = $liChapter.find('a').text();
                        const chapter_link = $liChapter.find('a').attr('href');
                        const time = $liChapter.find('i').text();
                        return {
                            chapter_name,
                            chapter_link,
                            time,
                        };
                    });
                return {
                    title,
                    view,
                    link,
                    thumbnail,
                    last_chapters,
                };
            });
    }
}

module.exports = new CategoryService()
