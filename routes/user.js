const path = require('path');
const express = require('express');

const userCon = require('../controllers/user');

const router = express.Router();

router.post("hello");
router.get('/', function(req, res){
    res.send('working');
});

// router.get('/prods',userCon.get_prod);
// router.post('/prods',userCon.post_prod);

// router.get('/orders',userCon.get_orders);
// // router.post('/orders',userCon.post_test);

// router.get('/cart',userCon.get_cart);
// router.post('/cart',userCon.post_cart);

module.exports = router;
