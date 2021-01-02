"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const { validationResult } = require('express-validator');
const jsonInstance = require('../../utils/JsonUtils')
const authenService = require('../../services/authen_service')
const accountService = require('../../services/account_service')

class AccountController {
    async register(req, res) {
        try {
            const result = await authenService.register(req.body.name, req.body.username, req.body.password)
            res.status(200).json(result)
        } catch (e) {
            res.status(500).json(jsonInstance.jsonMessage(e.message))
        }
    }

    async login(req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(500).json(jsonInstance.jsonMessage('Internal server error'))
            return
        }

        const account = {
            password: req.body.password,
            username: req.body.username
        }

        if (account.password && account.username) {
            await authenService.login(account.username, account.password)
                .then((token) => {
                    res.status(200).json({
                        token: token
                    })
                })
                .catch((err) => {
                    res.status(401).json(jsonInstance.jsonMessage(err.message))
                })
        } else {
           res.status(401).json(jsonInstance.jsonMessage('Username or Password must not empty'))
        }
    }

    async logout(req, res) {
        let token = req.params.token
        await authenService.logoutWithToken(token)
            .then((user) => {
                responeInstance
                    .success200(res, jsonInstance.toJsonWithData(`LOGOUT SUCCCESS!`, user));
            })
            .catch((err) => {
                responeInstance
                    .error400(res, jsonInstance.jsonNoData(err.message));
            })
    }

    async isTokenValid(req, res) {
        return res.status(200).json(jsonInstance.jsonMessage('Token is Validated.'))
    }

    async me(req, res) {
        const tokenFromClient = req.headers["authorization"]
        await accountService.getMeInfo(tokenFromClient)
            .then((account) => {
                res.status(200).json({
                    name: account.name
                })
            })
            .catch((err) => {
                res.status(401).json(jsonInstance.jsonMessage(err.message));
            })
    }

    async allAccount(req, res) {
        try {
            const query = req.query.q
            const accounts = await accountService.getAllUser(query);
            res.status(200).json(accounts);
        } catch (e) {
            res.status(500).json(jsonInstance.jsonMessage('Internal server error'));
        }
    }
}

module.exports = new AccountController()
