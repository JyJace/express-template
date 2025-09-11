const db = require('../models');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt'); // 注意：新版本导入方式可能不同
const {SECRET_KEY} = require('../package.config');


async function login(req, res) {
    const body = req.body;
    const project = await db.User.findOne({
        where: { username: body.username },
    })

    if (!project || project.password !== body.password) {
        return res.fail('用户名或密码错误')
    }

    // 生成 JWT 令牌
    const token = jwt.sign({ userId: project.id }, SECRET_KEY, {
        expiresIn: '7d', // 令牌过期时间
    });

    res.success({
        userinfo:project,
        token:token,
    })
}

module.exports = {
    login,
}
