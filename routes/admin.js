const path = require('path');
const express = require('express');

const adminCon = require('../controllers/admin');

const router = express.Router();


router.post('/openup',adminCon.post_openup);
router.post('/insert_seller',adminCon.post_add_seller);
router.post('/insert_delagent',adminCon.post_add_delagent);
router.post('/sort',adminCon.post_sort);
router.get('/add_seller',adminCon.get_add_seller);
router.get('/add_delagent',adminCon.get_add_delagent);
router.get('/about',adminCon.get_about);
router.get('/',adminCon.get_browse);
router.get('/browse',adminCon.get_browse);
router.get('/analytics',adminCon.get_analytics);
router.get('/sellers',adminCon.get_sellers);
router.get('/buyers',adminCon.get_buyers);
router.get('/delagents',adminCon.get_delagents);



module.exports = router;
