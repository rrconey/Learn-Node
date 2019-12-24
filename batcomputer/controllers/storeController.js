const mongoose = require('mongoose')
const Store = mongoose.model('Store')
const multer = require('multer')
const jimp = require('jimp')
const uuid = require('uuid')


const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter: (req,file,next) => {
        const isPhoto = file.mimetype.startsWith('image/')
        if(isPhoto) {
            next(null, true)
        } else {
            next({message: 'not allowed FT'}, false)
        }
    } 
}


exports.upload = multer(multerOptions).single('photo')
exports.resize = async (req,res,next) => {
    if(!req.file) {
        next()
        return
    }
    const extension = req.file.mimetype.split('/')[1]
    req.body.photo = `${uuid.v4()}.${extension}`
    
    const photo = await jimp.read(req.file.buffer)

    await photo.resize(800, jimp.AUTO)

    await photo.write(`./public/uploads/${req.body.photo}`)
    next()

}


exports.homePage = (req, res) => {
    // console.log(req.name);
    // res.render('hello');
    res.json({name: 'me'})

};

exports.displayStore = async (req,res, next) => {
    const slug  = req.params.store
    const store = await (await Store.findOne({slug})).populate('author')
    const lat = store.location.coordinates[0]
    const lng = store.location.coordinates[1]
    if(!store) {
        return next()
    } 
    res.render('store', {store, title: store.name, lat, lng})
    
}

exports.tags = async (req,res,next) => {
    const tagg = req.params.tag
    const tagsPromise = Store.getTagsList()
    const tagQuery = tagg || {$exists: true}
    const storesPromise = Store.find({tags: tagQuery })
    const [tags,stores] = await Promise.all([tagsPromise, storesPromise])
    res.render('tags', {tags, title: 'Tags', tagg, stores})
}

exports.renderStore = (req,res) => {
    res.render('hello')
}

exports.addStore = (req,res) => {
    res.render('editStore', {title: 'Add Store'})
}

exports.createStore = async (req,res) => {
    req.body.author = req.user._id
    const store = await(new Store(req.body)).save()
    req.flash('success', `Successfully created ${store.name}`)
    res.redirect(`/store/${store.slug}`)
}

exports.getStores = async (req, res) => {
    const page = req.params.page || 1;
    const limit = 4;
    const skip = (page * limit) - limit;
  
    // 1. Query the database for a list of all stores
    const storesPromise = Store
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ created: 'desc' });
  
    const countPromise = Store.count();
  
    const [stores, count] = await Promise.all([storesPromise, countPromise]);
    const pages = Math.ceil(count / limit);
    if (!stores.length && skip) {
      req.flash('info', `You asked for page ${page}. But that doesn't exist. So I put you on page ${pages}`);
      res.redirect(`/stores/page/${pages}`);
      return;
    }
  
    res.render('stores', { title: 'Stores', stores, page, pages, count });
  };

const confirmOwner = (store,user) => {
    if(!store.author.equals(user.id)) {
        throw Error('must own a store to edit')
    }
}

exports.editStore = async (req, res) => {
    const { id } = req.params
    const store = await Store.findOne({_id: id})

    confirmOwner(store, req.user)
    res.render('editStore', {title: `Edit ${store.slug}`, store});
};

exports.updateStore = async (req, res) => {
    const { id } = req.params
    const store = await Store.findOneAndUpdate({_id: id}, req.body, {new:true, runValidators: true}).exec()
    req.flash('success', `Successfully updated ${store.name}`)

    res.redirect(`/stores/${store._id}/edit`);
};

exports.searchStores = async (req, res) => {
    const stores = await Store.find({
        $text: {
            $search: req.query.q
        } 
    }, {
        score: {$meta: 'textScore'}
    }).sort({
        score: { $meta: 'textScore' }
    })
    .limit(5)
    res.json(stores)
}

exports.getStoreBySlug = async (req, res, next) => {
    const store = await Store.findOne({ slug: req.params.slug }).populate('author reviews');
    if (!store) return next();
    res.render('store', { store, title: store.name });
  };

exports.mapStores = async (req, res) => {
    const { lat,lng } = req.query
    const coordinates = [Number(lng), Number(lat)]
    const q = {
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates
                },
                $maxDistance: 10000 //10km or 6.21371 miles
            }
        }
    }

    const stores = await Store.find(q).select('photo name slug description location').limit(10)
    res.json(stores)
}


exports.mapPage = (req,res) => {
    res.render('map', {title: 'Map'})
}


exports.heartStore = async (req, res) => {
    const hearts = req.user.hearts.map(obj => obj.toString());
  
    const operator = hearts.includes(req.params.id) ? '$pull' : '$addToSet';
    const user = await User
      .findByIdAndUpdate(req.user._id,
        { [operator]: { hearts: req.params.id } },
        { new: true }
      );
    res.json(user);
  };
  
  exports.getHearts = async (req, res) => {
    const stores = await Store.find({
      _id: { $in: req.user.hearts }
    });
    res.render('stores', { title: 'Hearted Stores', stores });
  };

exports.getTopStores = async (req, res) => {
    const stores = await Store.getTopStores();
    res.render('topStores', { stores, title:'⭐ Top Stores!'});
}
