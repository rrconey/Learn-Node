const passport = require('passport')

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