const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const reviewController = require('../controllers/reviewController')

const { catchErrors } = require('../handlers/errorHandlers')

// Do work here
router.get('/example', (req, res) => {
  const rob = {name: 'rob', occupation: 'SE'}
  // res.send(req.params)  :7777/inventory/:item  puts variable in route
  // res.query    used to retrieve data from url  `:777/?name=tom`
  // res.json(rob)
  res.send(`Hey! It works ${req.query.name}`);
});

router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/page/:page', catchErrors(storeController.getStores));
router.get('/stores/:store', storeController.displayStore);
router.get('/tags', storeController.tags)
router.get('/tags/:tag', storeController.tags)
router.get('/login', userController.logingForm)
router.get('/register', userController.registerForm)
router.get('/logout', authController.logout)
router.get('/stores/:id/edit', catchErrors(storeController.editStore))
router.get('/add', authController.isLoggedIn, storeController.addStore);
router.get('/account', authController.isLoggedIn, userController.account)
router.get('/account/reset/:token', catchErrors(authController.reset))
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));
router.get('/hearts', authController.isLoggedIn, catchErrors( storeController.getHearts))
router.get('/api/stores/near', catchErrors(storeController.mapStores))
router.get('/top', catchErrors(storeController.getTopStores))
router.get('/map', storeController.mapPage)

router.post('/login', authController.login)

router.post('/account/reset/:token', 
  authController.confirmedPasswords, 
  catchErrors(authController.update)
)

router.post('/reviews/:id', 
  authController.isLoggedIn, 
  catchErrors(reviewController.addReview)
)

router.post('/account', catchErrors(userController.updateAccount))

router.post('/account/forgot', catchErrors(authController.forgot))


router.post('/register', 
userController.validateRegister,
userController.register,
authController.login
)

router.post('/add', 
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
)

router.post('/add/:id', 
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
)

/* 
API ENPOINTS
*/

router.get('/api/search', catchErrors(storeController.searchStores))

module.exports = router;