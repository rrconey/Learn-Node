const mongoose = require('mongoose')
const Review = mongoose.model('Review')


exports.addReview = async (req, res, next) => {
    req.body.author = req.user._id
    req.body.store = req.params.id
    const newReview = await new Review(req.body)
    await newReview.save()
    req.flash('success', 'review has been saved!')
    res.redirect('back')
}