const dd = require("../utils/debug");
const puppeteer = require("puppeteer");
const generatedPoster = require("../utils/generatedPoster");
async function save(req, res) {
    const {fullHtml, data, options} = req.body
    // res.setHeader('Content-Type', `image/${options?.format || 'png'}`);
    // res.setHeader('Content-Disposition', `inline; filename="render-${Date.now()}.${options?.format || 'png'}"`);
     await generatedPoster.renderHtmlToImage(fullHtml, data || {}, options || {})
    res.success('保存成功')
}

async function list(req,res){
    // console.log(poster,'poster')
    res.success(1,'success')
}

module.exports = {
    save,
    list
}
