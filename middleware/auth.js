
const {expressjwt: expressJwt} = require('express-jwt')
const {SECRET_KEY,errorCode} = require('../package.config');
const db = require('../models');

// 不需要认证的路由
const unlessPaths = [
    '/api/auth/login',
]

module.exports =  (req, res, next) => {

    console.log(req.path,'req.path')
    if (unlessPaths.includes(req.path)){
        return next();
    }

    expressJwt({
        secret: SECRET_KEY,
        algorithms: ['HS256'],
    })(req, res,async (err) => {

        if (err){
            return res.fail('登录失效',null,errorCode.UNAUTHORIZED)
        }

        const userId = req.auth.userId;

        const user = await db.User.findByPk(userId);

        if (!user){
            return res.fail('登录失效',null,errorCode.UNAUTHORIZED)
        }
        next()
    })
};
