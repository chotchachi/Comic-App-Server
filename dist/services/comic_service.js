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

    async getAllComic() {
        return await comicModel.find()
            .then(async (comics) => {
                return comics
            })
            .catch((err) => {
                throw new Error(err.message)
            })
    }

    async getComicDetail(comicLink) {
        return await comicModel.findOne( { link: comicLink})
            .then(async (comic) => {
                return comic
            })
            .catch((err) => {
                throw new Error(err.message)
            })
    }

}

module.exports = new ComicService()
