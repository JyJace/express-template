const util = require('util');

function dd(...args){
    // 判断是否为终端环境
    const isTerminal = process.stdout.isTTY;
    const output = args.map(arg  =>
        util.inspect(arg,  {
            depth: null,       // 显示完整嵌套结构
            colors: isTerminal,      // 终端彩色输出（可选）
            showHidden: true   // 显示不可枚举属性
        })
    ).join('\n\n');

    throw {
        message: output,
        time: new Date().getTime(),
    }
}

module.exports = dd
