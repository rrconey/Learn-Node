const passport = require('passport')

const config = {
    failureRedirect: '/login',
    failureFlash: 'Failed Login!',
    successRedirect: '/',
    successFlash: 'welcome!'
}


exports.login = passport.authenticate('local', config)