/**
 * @author: pjlin
 * @date: 2025-09-01 09:50
 * @description：index 导出所有的路由
 * @update: 2025-09-01 09:50
 */

/*** 路由前缀*/
const prefix = '/api'

// 引入所有的路由模块并且自动注册
const fs = require('fs')
const path = require('path')
const responseMid = require('../middleware/response')
const errorHandler = require('../middleware/errorHandler')
const cors = require('cors')
const {expressjwt: jwt} = require('express-jwt')
const {SECRET_KEY} = require('../package.config');

// 引入所有的路由模块并且自动注册
module.exports = (app) => {

    app.use(cors());
    app.use(responseMid)
    app.use(
        jwt({
            secret: SECRET_KEY,
            algorithms: ['HS256'],
        }).unless({
            path: ['/api/auth/login'],
        })
    )
    app.use(errorHandler)

    // // error handler
    // app.use(function(err, req, res, next) {
    //     // set locals, only providing error in development
    //     res.locals.status = err.status;
    //     res.locals.message = err.message;
    //     res.locals.error = req.app.get('env') === 'development' ? err : {};
    //     //
    //     // // render the error page
    //     res.status(err.status || 500);
    //     res.render('error');
    // });


    fs.readdirSync(path.join(__dirname, 'modules')).forEach((file) => {
        const router = require(path.join(__dirname, 'modules', file))
        // 获取文件名字
        const fileName = file.split('.')[0]
        // 注册路由
        app.use(prefix + '/' + fileName, router)
    })
}

