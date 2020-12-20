const jsonInstance = require('../utils/JsonUtils')
const authenService = require('../services/authen_service')

/**
 * Middleware: Authorization user by Token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
let isAuth = async (req, res, next) => {
    const tokenFromClient = req.headers["authorization"]
    if (tokenFromClient) {
        try {
            req.jwtDecoded = await authenService.isTokenValid(tokenFromClient);
            next()
        } catch (error) {
            return res.status(401).json(jsonInstance.jsonMessage('Token is Unauthorized.'));
        }
    } else {
        return res.status(403).send(jsonInstance.jsonMessage('No token provided.'));
    }
}

module.exports = { isAuth }
