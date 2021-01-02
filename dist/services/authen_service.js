const accountModel = require('../models/account')
const jwt_helper = require('../utils/jwt.helper')
const jsonHelper = require('../utils/JsonUtils')

class AuthenService {
    async register(name, username, password) {
        const newAccount = new accountModel()
        newAccount.name = name
        newAccount.username = username
        newAccount.password = password

        if (await accountModel.findOne( { username: username })) {
            return jsonHelper.jsonMessage("Account already exist")
        } else {
            try {
                await newAccount.save()
                return jsonHelper.jsonMessage("Register successfully")
            } catch (err) {
                throw new Error(err.message)
            }
        }
    }

    async login(username, password) {
        return await accountModel.findOne({ username: username, password: password })
            .exec()
            .then(async (account) => {
                if (account == null) {
                    throw new Error('Incorrect username or password!')
                }
                const token = await jwt_helper.generateToken(account)
                account.token = token
                await account.save()
                return token
            })
            .catch((err) => {
                throw new Error(err.message)
            })
    }

    async isTokenValid(token) {
        return await jwt_helper.verifyToken(token)
    }

    async logoutWithToken(idUser) {
        // return await accountModel.findByIdAndUpdate(idUser, {status: false}, {new: true})
        //     .exec()
        //     .then((user) => {
        //         if (user == null) {
        //             throw new Error(`wrong mail or password`)
        //         }
        //
        //         return user
        //     })
        //     .catch((err) => {
        //         throw new Error(err.message)
        //     })
    }

}

module.exports = new AuthenService;
