"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const authenService = require('../../services/authen_service')

class AccountController {
    async register(req, res) {
        try {
            const account = await authenService.register(req.body.name, req.body.username, req.body.password)
            res.status(200).json(account);
        }
        catch (e) {
            const error = {
                message: 'Register error',
                status_code: 500
            };
            res.status(500).json(error);
        }
    }

    async login(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = {
                message: 'Internal server error',
                status_code: 500
            };
            res.status(500).json(error);
            return;
        }

        const account = {
            password: req.body.password,
            username: req.body.username
        };

        if (account.password && account.username) {
            await authenService.login(account.username, account.password)
                .then((user) => {
                    const token = jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' });
                    res.status(200).json({
                        token: token
                    });
                })
                .catch((err) => {
                    const error = {
                        message: 'Internal server error',
                        status_code: 500
                    };
                    res.status(500).json(error);
                })

        } else {
            const error = {
                message: 'Internal server error',
                status_code: 500
            };
            res.status(500).json(error);
        }
    }

    async logout(req, res) {
        let id = req.params.id

        await authenService.logoutWithId(id)
            .then((user) => {
                responeInstance
                    .success200(res, jsonInstance.toJsonWithData(`LOGOUT SUCCCESS!`, user));
            })
            .catch((err) => {
                responeInstance
                    .error400(res, jsonInstance.jsonNoData(err.message));
            })
    }

}

module.exports = new AccountController()
