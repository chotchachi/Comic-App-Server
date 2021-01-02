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
        if (query === undefined || query === null) {
            return await accountModel.find()
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
        } else {
            return await accountModel.find({
                username:  {$regex : ".*"+query+".*"}
            })
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
}

module.exports = new AccountService()
