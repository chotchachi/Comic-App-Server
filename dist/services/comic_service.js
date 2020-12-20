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

}

module.exports = new ComicService()
