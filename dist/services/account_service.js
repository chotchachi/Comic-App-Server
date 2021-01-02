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

    async getAllUser(query) {
        let predicate = {}
        if (query !== undefined) {
            predicate = {
                username: {$regex: ".*" + query + ".*"}
            }
        }
        return await accountModel.find(predicate)
            .exec()
            .then(async (accounts) => {
                if (accounts == null) {
                    throw new Error('Token error!')
                }
                return accounts.map((account) => {
                    return {
                        id: account._id,
                        username: account.username,
                        name: account.name,
                        role: account.level
                    }
                })
            })
            .catch((err) => {
                throw new Error(err.message)
            })
    }
}

module.exports = new AccountService()
