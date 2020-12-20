const categoryModel = require('../models/category')

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

}

module.exports = new CategoryService()
