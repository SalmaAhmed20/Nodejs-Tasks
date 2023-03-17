const JWT = require('jsonwebtoken');
const { promisify } = require('util');
const verifyJwt = promisify(JWT.verify);
const { User } = require("../model/user");
const { jwtSecret } = require('../helpers/config');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            const error = new Error("unauthorized");
            error.statusCode = 401;
            return next(error);
        }
        const { id } = await verifyJwt(token, jwtSecret);
        const user = await User.findById(id)
        if (!user) {
            const error = new Error("unauthorized");
            error.statusCode = 401;
            return next(error);
        }
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        next(err);
    }
}