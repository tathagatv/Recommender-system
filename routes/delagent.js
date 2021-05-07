const path = require('path');
const express = require('express');

const delagentCon = require('../controllers/delagent');

const router = express.Router();

router.get('/',delagentCon.get_ongoing);
router.get('/ongoing',delagentCon.get_ongoing);
router.get('/delivered',delagentCon.get_delivered);
router.get('/about',delagentCon.get_about);

router.post('/sort', delagentCon.post_sort);
router.post('/setasdelivered', delagentCon.post_setasdelivered);

module.exports = router;
