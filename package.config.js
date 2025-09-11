/**
 * 应用的全局配置
 */

module.exports = {

    // 响应的错误码集合
    errorCode: {
        SUCCESS: 200, // 成功
        FAILED: 400,    // 失败
        UNAUTHORIZED: 401, // 未授权
        FORBIDDEN: 403, // 禁止访问
        NOT_FOUND: 404, // 资源不存在
        METHOD_NOT_ALLOWED: 405, // 方法不允许
        INTERNAL_SERVER_ERROR: 500, // 内部服务器错误
    },

    // 定义用于加密和解密的 secret 密钥
    SECRET_KEY:'your-secret-key',
}
