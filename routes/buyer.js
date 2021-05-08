const path = require('path');
const express = require('express');

const buyerCon = require('../controllers/buyer');

const router = express.Router();

router.get('/',buyerCon.get_browse);
router.get('/browse',buyerCon.get_browse);
router.get('/history',buyerCon.get_history);
router.get('/recharge',buyerCon.get_recharge);
router.get('/about',buyerCon.get_about);
router.get('/cart',buyerCon.get_cart);

router.post('/sort', buyerCon.post_sort);
router.post('/openup', buyerCon.post_openup);
router.post('/placeorder', buyerCon.post_placeorder);
router.post('/recharge', buyerCon.post_recharge);
router.post('/orderdetails', buyerCon.post_orderdetails);
router.post('/removefromcart', buyerCon.post_removefromcart);
router.post('/addtocart', buyerCon.post_addtocart);
router.post('/rating', buyerCon.post_rating);

module.exports = router;
