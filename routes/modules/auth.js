const express = require('express');
const authController = require("../../controllers/auth");
const router = express.Router();
const validator = require("../../middleware/validator");
router.post('/login',validator('authValidator'), authController.login);

module.exports = router;
