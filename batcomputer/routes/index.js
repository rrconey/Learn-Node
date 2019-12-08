const express = require('express');
const router = express.Router();
const controller = require('../controllers/storeController')

// Do work here
router.get('/example', (req, res) => {
  const rob = {name: 'rob', occupation: 'SE'}
  // res.send(req.params)  :7777/inventory/:item  puts variable in route
  // res.query    used to retrieve data from url  `:777/?name=tom`
  // res.json(rob)
  res.send(`Hey! It works ${req.query.name}`);
});

router.get('/', controller.homePage);
router.post('/add', controller.createStore)


router.get('/hello', (req, res) => {
  res.render('editStore', {name: 'benajmin'})
});

module.exports = router;
