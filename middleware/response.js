const packageConfig = require('../package.config')

module.exports = (req, res, next) => {
    // 重写 res.send  以拦截响应
    const originalSend = res.send;
    const errorCode = packageConfig.errorCode;
    res.send = function (body) {
        // 检查是否触发 dd()
        if (body && body.type === 'DEBUG_DUMP') {
            return originalSend.call(
                this,
                `<pre style="background:#000;color:#fff;padding:20px;">${body.data}</pre>`
            );
        }

        originalSend.call(this, body);
    };

    // 重写返回的方法
    res.success = (data, message = 'success', code = errorCode.SUCCESS) => {
        res.status(200).json({
            code,
            message: message,
            data: data
        });
    }

    // 失败响应方法
    res.fail = (message = "fail", data = null, code = errorCode.FAILED,) => {
        res.status(200).json({
            code,
            message,
            data,
        });
    };

    next();
};
