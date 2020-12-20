const accountModel = require('../models/account')

class AccountService {
    async getMeInfo(token) {
        return await accountModel.findOne({ token: token })
            .exec()
            .then(async (account) => {
                if (account == null) {
                    throw new Error('Token error!')
                }
                return account
            })
            .catch((err) => {
                throw new Error(err.message)
            })
    }

}

module.exports = new AccountService()
