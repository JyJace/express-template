// const authValidator = require("../validators/authValidator")
const { validationResult } = require('express-validator');

/**
 * 参数校验中间件
 * @param name 校验器的名 存放在validators文件夹下
 * @return {(function(*, *, *): Promise<void>)|*}
 */
let validatorModule = ''
module.exports = (name) => {

    if (!name) throw new Error(`validator中间件 需要传入一个校验器名`);
    validatorModule =  require(`../validators/${name}`);

    return async (req, res, next) => {

        if (!Array.isArray(validatorModule.validationRules)) {
            throw new Error('校验规则必须是一个数组');
        }


        for (const validation of validatorModule.validationRules) {

            await new Promise((resolve,reject) => {
                validation(req, res, (err) => {
                    if (err) {
                        reject(err);
                    }else{
                        resolve();
                    }
                });
            })

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                break
            }
        }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const msg  = errors.array()[0].msg;
            return res.fail(msg)
        }

        next()
    }
}
