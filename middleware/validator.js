const Joi = require("joi");

const loginSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,38}$")).required()
})
const vaildateSignin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        const err = new Error(error.details[0].message);
        err.statusCode = 400;
        return next(err);
    }
    next();
}
const TodoShema = Joi.object({
    id: Joi.any(),
    title: Joi.string().min(3).max(20).required(),
    status: Joi.string().valid('todo', 'in-progress', 'done').default("todo")
})
const vaildateCreataTask = (req, res, next) => {
    const { error } = TodoShema.validate(req.body);
    if (error) {
        const err = new Error(error.details[0].message);
        err.statusCode = 400;
        return next(err);
    }
    next();
}
module.exports = {
    vaildateSignin,
    vaildateCreataTask
}