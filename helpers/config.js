const CustomError = require('./customerr')

require('dotenv').config()
const requiredEnvs = ['MONGO_URL', 'JWT_SECRET', 'DATABASE']
const missingEnvs = requiredEnvs.filter(env => !process.env[env])
if (missingEnvs.length) {
    throw new CustomError(`missing envs ${missingEnvs.join(',')}`, 500)
}
module.exports = {
    saltRound: process.env.SALT_ROUND || 10,
    mongoURL: process.env.MONGO_URL,
    database: process.env.DATABASE,
    jwtSecret: process.env.JWT_SECRET,
    port: process.env.PORT
}