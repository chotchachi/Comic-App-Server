const comicModel = require('../models/comic')

class ComicService {
    async addComic(comic) {
        try {
            comic.save()
            console.log(comic.title, ">>>")
        } catch (err) {
            console.log(err, ">>>")
        }
    }

    async getAllComic(page) {
        const PAGE_SIZE = 20;
        const skip = (page - 1) * PAGE_SIZE;
        return await comicModel.find()
            .skip(skip)
            .limit(PAGE_SIZE)
            .exec()
            .then(async (comics) => {
                return comics
            })
            .catch((err) => {
                throw new Error(err.message)
            })
    }

    async getComicDetail(comicLink) {
        return await comicModel.findOne( { link: comicLink})
            .exec()
            .then(async (comic) => {
                return comic
            })
            .catch((err) => {
                throw new Error(err.message)
            })
    }

    async searchComic(query, page) {
        const PAGE_SIZE = 20;
        const skip = (page - 1) * PAGE_SIZE;
        return await comicModel.find({
            title:  {$regex : ".*"+query+".*", $options:'i'}
        }).skip(skip)
            .limit(PAGE_SIZE)
            .exec()
            .then(async (comics) => {
                // using for android client
                return comics.map(comic => {
                    return {
                        title: comic.title,
                        view: comic.view,
                        link: comic.link,
                        thumbnail: comic.thumbnail,
                        last_chapters: comic.chapters.map(chapter => {
                            return {
                                chapter_link: chapter.chapter_link,
                                chapter_name: chapter.chapter_name,
                                time: chapter.time
                            }
                        })
                    }
                })
            })
            .catch((err) => {
                throw new Error(err.message)
            })
    }
}

module.exports = new ComicService()
