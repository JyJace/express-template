var express = require('express');
var router = express.Router();
const posterController = require('../../controllers/poster');


router.get('/list', posterController.list);
router.post('/save', posterController.save);

module.exports = router;
