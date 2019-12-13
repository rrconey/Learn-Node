const mongoose = require('mongoose')
const Store = mongoose.model('Store')

exports.homePage = (req, res) => {
    console.log(req.name);
    res.render('hello');
};

exports.addStore = (req,res) => {
    res.render('editStore', {title: 'Add Store'})
}

exports.createStore = async (req,res) => {
    const store = await(new Store(req.body)).save()
    req.flash('success', `Successfully created ${store.name}`)
    res.redirect(`/store/${store.slug}`)
}

exports.getStores = async (req,res) => {
    const stores = await Store.find()
    res.render('stores', {title: 'Stores page', stores})
}

exports.editStore = async (req, res) => {
    const { id } = req.params
    const store = await Store.findOne({_id: id})
    res.render('editStore', {title: `Edit ${store.slug}`, store});
};

exports.updateStore = async (req, res) => {
    const { id } = req.params
    const store = await Store.findOneAndUpdate({_id: id}, req.body, {new:true, runValidators: true}).exec()
    req.flash('success', `Successfully updated ${store.name}`)

    res.redirect(`/stores/${store._id}/edit`);
};