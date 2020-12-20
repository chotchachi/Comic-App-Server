const jwt = require("jsonwebtoken");

let generateToken = (account) => {
    return new Promise((resolve, reject) => {
        const accountData = {
            _id: account._id,
            username: account.username,
            name: account.name
        }
        jwt.sign(
            {data: accountData},
            'RANDOM_TOKEN_SECRET',
            {
                algorithm: "HS256",
                expiresIn: "24h",
            },
            (error, token) => {
                if (error) {
                    return reject(error);
                }
                resolve(token);
            });
    });
}

let verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, 'RANDOM_TOKEN_SECRET', (error, decoded) => {
            if (error) {
                return reject(error);
            }
            resolve(decoded);
        });
    });
}

module.exports = { generateToken, verifyToken };
