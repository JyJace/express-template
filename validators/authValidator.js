const {body,validationResult} = require('express-validator');

exports.validationRules = [
    body('username').isLength({ min: 6 }).withMessage('用户名最少6位'),
    body('password').isLength({ min: 6 }).withMessage('密码至少6位')
]

