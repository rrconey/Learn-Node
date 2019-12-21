const mongoose = require('mongoose')
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise
const md5 = require('md5')
const validator = require('validator')
const mogodbErrorHandler = require('mongoose-mongodb-errors')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
    name: {
      type: String,
      trim: true,
      required: 'Please enter a store name!'
    },
    email: {
        type: String,
        required: 'please provide email',
        lowercase: true,
        unique: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid email address']
    },
});

userSchema.virtual('gravatar').get(()=> {
    const hash = md5(this.email)
    return `https://gravatar.com/avatar/${hash}?s=200`
})

userSchema.plugin(passportLocalMongoose,{usernameField: 'email'})
userSchema.plugin(mogodbErrorHandler)
module.exports = mongoose.model('User', userSchema)