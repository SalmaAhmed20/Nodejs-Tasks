let mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { saltRound } = require('../helpers/config');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    age: Number,
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform: (doc, ret) => {
            delete ret.password;
            delete ret.__v;
            return ret
        }
    }
});
//encryption midddleware
UserSchema.pre('save', async function (next) {
    const user = this;
    console.log(user)
    if (user.isModified('password')) {
        const hashedpassword = await bcrypt.hash(user.password, saltRound);
        user.password = hashedpassword;
    }
    console.log(user)
    next();
})
UserSchema.methods.comparedPassword = function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
}
const User = mongoose.model("User", UserSchema);
module.exports = { User };