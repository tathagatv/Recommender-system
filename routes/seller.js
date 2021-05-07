const path = require('path');
const express = require('express');

const sellerCon = require('../controllers/seller');

const router = express.Router();

router.get('/',sellerCon.get_onsale);
router.get('/onsale',sellerCon.get_onsale);
router.get('/addnew',sellerCon.get_addnew);
router.get('/past',sellerCon.get_past);
router.get('/requests',sellerCon.get_requests);
router.get('/about',sellerCon.get_about);
router.get('/ongoing',sellerCon.get_ongoing);
router.post('/addnew', sellerCon.post_addnew)
router.post('/sort', sellerCon.post_sort)
router.post('/ship', sellerCon.post_ship)
router.post('/openup', sellerCon.post_openup);

module.exports = router;
