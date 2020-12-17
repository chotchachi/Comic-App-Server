const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};

const cheerio = __importDefault(require("cheerio"));
const util = require("../util");
const comicModel = require('../models/comic')
const authorModel = require('../models/author')
const cateModel = require('../models/categoryOfComic')
const chapterModel = require('../models/chapter')
const comicService = require('../services/comic_service')

async function crawlComics() {
    for (let i = 1; i <= 20; i++) {
        console.log('------------------------------------------------------------------------')
        console.log('Start crawler page:', i)
        await crawl(i);
    }
}

async function crawl(page) {
    const comicArr = []
    const body = await util.GET(`https://ww4.mangafox.online/topmanga/page/${page}`);
    const comic_links = await util.getComicLink(body);
    for await (const link of comic_links) {
        const comic = await comicDetail(link)
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

async function comicDetail(link) {
    const body = await util.GET(link);
    const $ = cheerio.default.load(body);
    const content_left = $('div.content_left');
    const manga_info = content_left.find('div.manga_info');
    const thumbnail = manga_info.find('div.manga_info_left > div.manga_info_img > img').attr('src');
    const manga_info_right = manga_info.find('div.manga_info_right');
    const title = manga_info_right.find('div.manga_name > h1').text().trim();
    let view = '0';
    let authors = [];
    let categories = [];
    manga_info_right.find('div.manga_des > ul > li').toArray().forEach(li => {
        const $li = $(li);
        const spanText = $li.find('span').text().trim();
        switch (spanText) {
            case 'Views:':
                const text = $li.text();
                view = text.substring('Views:'.length + 1).trim();
                break;
            case 'Authors:':
                authors = $li.find('a').toArray().map(a => {
                    const $a = $(a);
                    return {
                        name: $a.attr('title'),
                        link: $a.attr('href'),
                    };
                });
                break;
            case 'Categories:':
                categories = $li.find('a').toArray().map(a => {
                    const $a = $(a);
                    return {
                        name: $a.attr('title'),
                        link: $a.attr('href'),
                    };
                });
                break;
        }
    });
    const shortened_content = content_left.find('div.manga_description > div.manga_des_content > p').text().trim();
    const chapters = await content_left.find('div.manga_chapter > div.manga_chapter_list > ul > li')
        .toArray()
        .map(li => {
            const $li = $(li);
            return {
                view: $li.find('div.chapter_time').text().trim(),
                chapter_name: $li.find('div.chapter_number > a').text().trim(),
                time: $li.find('div.chapter_view').text().trim(),
                chapter_link: $li.find('div.chapter_number > a').attr('href'),
            };
        });

    //const related_comics = util.bodyToComicList(body);

    return {
        title,
        thumbnail,
        view,
        authors,
        categories,
        shortened_content,
        link,
        chapters,
        //last_updated: chapters[0].time,
        //related_comics,
    };
}

module.exports = { crawlComics };
