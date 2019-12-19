const express = require('express');
const router = express.Router();
const controller = require('../controllers/storeController')
const { catchErrors } = require('../handlers/errorHandlers')

// Do work here
router.get('/example', (req, res) => {
  const rob = {name: 'rob', occupation: 'SE'}
  // res.send(req.params)  :7777/inventory/:item  puts variable in route
  // res.query    used to retrieve data from url  `:777/?name=tom`
  // res.json(rob)
  res.send(`Hey! It works ${req.query.name}`);
});

router.get('/', catchErrors(controller.getStores));
router.get('/stores', catchErrors(controller.getStores));
router.get('/stores/:store', controller.displayStore);
router.get('/tags', controller.tags)
router.get('/tags/:tag', controller.tags)


router.post('/add', 
  controller.upload,
  catchErrors(controller.resize),
  catchErrors(controller.createStore)
)

router.post('/add/:id', 
  controller.upload,
  catchErrors(controller.resize),
  catchErrors(controller.updateStore)
)

router.get('/stores/:id/edit', catchErrors(controller.editStore))

router.get('/add', (req, res) => {
  res.render('editStore', {name: 'benajmin'})
});

module.exports = router;
