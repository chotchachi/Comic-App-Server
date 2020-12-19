const accountModel = require('../models/account');

class AuthenService {
    async register(name, username, password) {
        const newAccount = new accountModel()
        newAccount.name = name
        newAccount.username = username
        newAccount.password = password
        try {
            await newAccount.save()
            return newAccount
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async login(username, password) {
        return await accountModel.findOne({ username: username, password: password })
            .exec()
            .then(async (account) => {
                if (account == null) {
                    throw new Error(`wrong username or password`)
                }

                try {
                    account.status = true
                    return await account.save()
                } catch (err) {
                    throw new Error(err.message)
                }

            })
            .catch((err) => {
                throw new Error(err.message)
            })
    }

    async logoutWithId(idUser) {
        return await accountModel.findByIdAndUpdate(idUser, {status: false}, {new: true})
            .exec()
            .then((user) => {
                if (user == null) {
                    throw new Error(`wrong mail or password`)
                }

                return user
            })
            .catch((err) => {
                throw new Error(err.message)
            })
    }

}

module.exports = new AuthenService;
