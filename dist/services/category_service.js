const categoryModel = require('../models/category')
const comicModel = require('../models/comic')

class CategoryService {
    async allCategories(query) {
        let predicate = {}
        if (query !== undefined) {
            predicate = {
                name: {$regex: ".*" + query + ".*"}
            }
        }
        return await categoryModel.find(predicate)
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

module.exports = new CategoryService()
