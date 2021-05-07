const path = require('path');
const express = require('express');

const baseCon = require('../controllers/base');

const router = express.Router();

router.get('/',baseCon.get_browse);
router.get('/browse',baseCon.get_browse);

router.get('/about',baseCon.get_about);

router.get('/login',baseCon.get_login);
router.get('/signup',baseCon.get_signup);

router.post('/login',baseCon.post_login);
router.post('/signup',baseCon.post_signup);

module.exports = router;
