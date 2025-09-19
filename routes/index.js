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
const auth = require('../middleware/auth')

// 引入所有的路由模块并且自动注册
module.exports = (app) => {

    app.use(cors());
    app.use(responseMid)
    app.use(auth)
    app.use(errorHandler)


    fs.readdirSync(path.join(__dirname, 'modules')).forEach((file) => {
        const router = require(path.join(__dirname, 'modules', file))
        // 获取文件名字
        const fileName = file.split('.')[0]
        // 注册路由
        app.use(prefix + '/' + fileName, router)
    })
}

