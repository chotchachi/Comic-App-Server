const categoryModel = require('../models/category')

class CategoryService {
    async addCategories(categories) {
        categories.forEach( (item) => {
            try {
                item.save()
                console.log(item.link, ">>>")
            } catch (err) {
                console.log(err, ">>>")
            }
        })
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
