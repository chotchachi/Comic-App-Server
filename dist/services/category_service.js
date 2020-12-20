const categoryModel = require('../models/category')
const comicModel = require('../models/comic')

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

    async addCategory(category) {
        try {
            category.save()
            console.log(category.link, ">>>")
        } catch (err) {
            console.log(err, ">>>")
        }
    }

    async getAllComics(categoryLink, page) {
        const PAGE_SIZE = 20;
        const skip = (page - 1) * PAGE_SIZE;
        return await comicModel.find({
            $or: [{'categories': {"$elemMatch": {'link': categoryLink}}}]
        }).skip(skip)
            .limit(PAGE_SIZE)
            .exec()
            .then(async (comics) => {
                return comics
            })
            .catch((err) => {
                throw new Error(err.message)
            })
    }
}

module.exports = new CategoryService()
