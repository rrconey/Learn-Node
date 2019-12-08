const mongoose = require('mongoose')
const Store = mongoose.model('Store')

exports.homePage = (req, res) => {
    console.log(req.name);
    res.render('hello');
};


exports.middleware = (req,res, next) => {
    
}


exports.addStore = (req,res) => {
    res.render('editStore', {title: 'Add Store'})
}


exports.createStore = (req,res) => {
    res.json(req.body)

    const store = new Store(req.body)
    

}