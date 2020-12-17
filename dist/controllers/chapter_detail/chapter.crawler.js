"use strict";
const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", { value: true });

const cheerio = __importDefault(require("cheerio"));
const util = require("../../util");

class Crawler {
    async chapterDetail(link) {
        const body = await util.GET(link);
        const $ = cheerio.default.load(body);
        const content_left = $('div.content_left');
        const images = content_left.find('div.list_img > img')
            .toArray()
            .map(img => $(img).attr('src'));
        const chapters = content_left.find('div.next_prev_chapter > div.next_prev > select#list_chapters1 > option')
            .toArray()
            .map(option => {
            const $option = $(option);
            return {
                chapter_name: $option.text(),
                chapter_link: $option.attr('value'),
            };
        });
        const currentIndex = chapters.findIndex(chapter => chapter.chapter_link === link);
        const prev_chapter_link = (() => {
            const prev = chapters[currentIndex + 1];
            return prev ? prev.chapter_link : undefined;
        })();
        const next_chapter_link = (() => {
            const next = chapters[currentIndex - 1];
            return next ? next.chapter_link : undefined;
        })();
        const chapter_name = $('section#breadcrumb_custom li:last-child').text().trim();
        const chapterNameA = $($('section#breadcrumb_custom li').toArray()[2]).find('a');
        const comic_name = chapterNameA.attr('title').trim();
        const comic_link = chapterNameA.attr('href');
        return {
            images,
            prev_chapter_link,
            next_chapter_link,
            chapters,
            chapter_link: link,
            chapter_name,
            comic_name,
            comic_link,
        };
    }
}

exports.Crawler = Crawler;
