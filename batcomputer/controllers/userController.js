const mongoose = require('mongoose')
const User = mongoose.model('User')
const promisify = require('es6-promisify')

exports.logingForm = (req,res,next) => {
  res.render('login')
}

exports.registerForm = (req,res) => {
    res.render('register', {title: "Register"})
}

exports.validateRegister = (req,res,next) => {
    req.sanitizeBody('name')
    req.checkBody('name', 'a name must be supplied for name').notEmpty()
    req.checkBody('email', 'a name must be supplied for email').notEmpty()
    req.checkBody('password', 'a name must be supplied for password').notEmpty()
    req.checkBody('password-confirm', 'a name must be supplied for password-confirm').notEmpty()
    req.checkBody('password-confirm', 'passwords do not match').equals(req.body.password)

    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    })

    const errors = req.validationErrors()
    if(errors) {
        req.flash('errors', errors.map(err=> err.msg))
        res.render('register', {title: 'register', body: req.body, flashes: req.flash()})
    return
    }
    next()
}

exports.register = async(req,res, next) => {
  const user = new User({email: req.body.email, name: req.body.name})
  const register = promisify(User.register, User)
  await register(user, req.body.password)
  next()
}