const comicModel = require('../models/comic')

class ComicService {
    // async allCategories() {
    //     return await categoryModel.find()
    //         .exec()
    //         .then((categories) => {
    //             return categories;
    //         })
    //         .catch((error) => {
    //             throw new Error(error.message);
    //         });
    // }

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
