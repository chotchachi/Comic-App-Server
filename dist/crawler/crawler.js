const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};

const cheerio = __importDefault(require("cheerio"));
const util = require("../util");
const comicModel = require('../models/comic')
const authorModel = require('../models/author')
const cateModel = require('../models/categoryOfComic')
const chapterModel = require('../models/chapter')
const categoryModel = require('../models/category')
const comicService = require('../services/comic_service')
const categoryService = require('../services/category_service')
const categoryDescription = require('../controllers/category/category_descriptions')

// Crawl Comics
async function crawlComics() {
    for (let i = 1; i <= 100; i++) {
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

// Crawl Category
async function crawlCategories() {
    const body = await util.GET('https://ww4.mangafox.online/');
    const categories = await getCategories(body);
    const images = await getAndSaveImages(categories.map(c => c.link));
    return categories.map((c) => {
        const newCategory = new categoryModel()
        newCategory.link = c.link
        newCategory.name = c.name
        newCategory.thumbnail = images[c.link]
        newCategory.description = categoryDescription.default[c.link]
        categoryService.addCategory(newCategory)
        return newCategory
    });
}

async function getCategories(body) {
    const $ = cheerio.default.load(body);
    const categories = $('div.content_right > div.danhmuc > table > tbody > tr > td')
        .toArray()
        .map(td => {
            const $td = $(td);
            return {
                link: $td.find('a').attr('href'),
                name: $td.find('a').text().trim(),
            };
        });
    return categories.slice(0, categories.length - 1);
}

async function getAndSaveImages(links) {
    let images = {};
    for (const link of links) {
        util.log(`[START] fetch thumbnail image ${link}`);
        const data = await getFirstImage(link);
        images = Object.assign({}, images, data);
    }
    return images;
}

async function getFirstImage(categoryLink) {
    const body = await util.GET(categoryLink);
    const thumbnail = util.bodyToComicList(body)[0].thumbnail;
    util.log(`[END] fetch thumbnail image ${thumbnail}`);
    return { [categoryLink]: thumbnail };
}

// Others
async function getPopularComics(categoryLink) {
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

async function getAllComics(categoryLink, page) {
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

async function chapterDetail(chapterLink) {
    const body = await util.GET(chapterLink);
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
    const currentIndex = chapters.findIndex(chapter => chapter.chapter_link === chapterLink);
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
        chapter_link: chapterLink,
        chapter_name,
        comic_name,
        comic_link,
    };
}

async function searchComic(query, page) {
    const body = await util.GET(`https://ww2.mangafox.online/search/${query}/page/${page}`);
    return util.bodyToComicList(body);
}

module.exports = { crawlComics, crawlCategories, getPopularComics, getAllComics, chapterDetail, searchComic };
