const path = require('path');
const express = require('express');

const baseCon = require('../controllers/base');

const router = express.Router();

router.get('/',baseCon.get_browse);
router.get('/browse',baseCon.get_browse);

router.get('/about',baseCon.get_about);

router.get('/login',baseCon.get_login);
router.get('/signup',baseCon.get_signup);

router.post('/sort', baseCon.post_sort);
router.post('/login',baseCon.post_login);
router.post('/signup',baseCon.post_signup);
router.post('/openup',baseCon.post_openup);

module.exports = router;
