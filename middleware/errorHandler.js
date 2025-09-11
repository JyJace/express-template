const {errorCode} = require("../package.config");

module.exports = (err, req, res, next) => {

    if (err.name === 'UnauthorizedError'){
        return res.fail('认证失败，请提供有效的访问令牌',null,errorCode.UNAUTHORIZED,)
    }

    res.fail('服务器错误',null,errorCode.INTERNAL_SERVER_ERROR)
}
