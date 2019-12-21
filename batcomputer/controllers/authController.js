const passport = require('passport')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const crypto = require('crypto')
const promisify = require('es6-promisify')

const config = {
    failureRedirect: '/login',
    failureFlash: 'Failed Login!',
    successRedirect: '/',
    successFlash: 'welcome!'
}

exports.login = passport.authenticate('local', config)

exports.logout = (req,res) => {
    req.logout()
    req.flash('success', 'goodbye for now...')
    res.redirect('/')
}

exports.isLoggedIn = (req,res, next) => {
    if(req.isAuthenticated()) {
        return next()
    }
    req.flash('error', 'please login')
    res.redirect('/login')
}

exports.forgot = async (req, res, next) => {
    const proposedEmail = req.body.email
    const user = await User.findOne({email: proposedEmail})
    console.log(user)
    if(!user) {
        req.flash('error', `A password reset has been sent to ${proposedEmail}`)
        return res.redirect('/')
    }

    user.resetPasswordToken = crypto.randomBytes(20).toString('hex')
    user.resetPasswordExpires = Date.now() + 3600000

    await user.save();

    const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`
    req.flash('success', `this is your reset ${resetURL}`)

    res.redirect('/login')

}

exports.reset = async (req,res,next) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    })

    if(!user) {
        req.flash('error', 'invalid/expired token')
        return res.redirect('/login')
    }

    res.render('reset', {title: 'reset password'})
}

exports.confirmedPasswords = (req, res, next) => {
  if(req.body.password == req.body['password-confirm']) {
      next()
      return 
  }

  req.flash('error', 'no bueno')
  res.redirect('back')
}

exports.update = async (req,res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    })

    if(!user) {
        req.flash('error', 'invalid/expired token')
        return res.redirect('/login')
    }

    const setPassword = promisify(user.setPassword, user)
    await setPassword(req.body.password)

    user.resetPasswordToken = undefined
    user.resetPasswordExpires
    const updatedUser = await user.save()
    await req.login(updatedUser)
    req.flash('success', 'Niicce!!')
    res.redirect('/')
}