const {body,validationResult} = require('express-validator');

exports.validationRules = [
    body('password').isLength({ min: 6 }).withMessage('密码至少6位')
]

