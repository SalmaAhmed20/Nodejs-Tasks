class CustomError extends Error {
    constructor(message, statuscode, errors) {
        super(message);
        this.statusCode = statuscode;
        this.errors = errors
    }
}
module.exports = CustomError;