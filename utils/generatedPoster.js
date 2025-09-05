const puppeteer = require('puppeteer');
const { Cluster } = require('puppeteer-cluster');
const Handlebars = require('handlebars');
const dd = require("./debug");

// 全局集群实例（单例模式）
let cluster = null;

/**
 * 初始化Puppeteer集群
 * @returns {Promise<Cluster>} 集群实例
 */
async function initPuppeteerCluster(){
    if (cluster) return cluster;

    cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_BROWSER,
        maxConcurrency: Math.min(require('os').cpus().length, 4),
        puppeteerOptions: {
            headless: true,
            args: [
                '--no-sandbox', // 禁用沙箱（容器环境必需）
                '--disable-dev-shm-usage', // 禁用/dev/shm使用（解决内存限制）
                '--disable-gpu', // 禁用GPU加速
                '--disable-setuid-sandbox', // 禁用setuid沙箱
                '--font-render-hinting=medium', // 字体渲染优化
                '--disable-font-subpixel-positioning',
                '--disable-extensions' // 禁用扩展
            ],
            defaultViewport: { width: 1200, height: 800 },
            timeout: 30000, // 浏览器启动超时
            slowMo: 0 // 无延迟（生产环境）
        },
        // 集群错误处理
        errorHandler: (err, data) => {
            console.error(`集群错误: ${err.message}`, data);
        },
        // 每个工作器启动时的初始化
        workerCreationDelay: 1000 // 工作器创建延迟（避免资源竞争）
    });

    // 预加载通用样式（如字体）
    await cluster.task(async ({ page }) => {
        // 注入字体样式
        await page.addStyleTag({
            content: `
        @font-face {
          font-family: 'SimHei';
          src: url('https://cdn.jsdelivr.net/npm/font-simhei@1.0.0/fonts/SimHei.woff2') format('woff2');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Arial';
          src: url('https://cdn.jsdelivr.net/npm/font-arial@1.0.0/arial.woff2') format('woff2');
          font-display: swap;
        }
        body { margin: 0; padding: 0; }
      `
        });
        return page;
    });

    return cluster;

}

function debugPageInstance(page) {
    console.log('Page实例诊断信息:');
    console.log('类型:', Object.prototype.toString.call(page));
    console.log('构造函数:', page.constructor.name);
    console.log('核心方法:', [
        'setContent', 'goto', 'screenshot', 'evaluate'
    ].map(method =>
        `${method}: ${typeof page[method] === 'function' ? '✅' : '❌'}`
    ).join('\n'));

    // 打印原型链
    let proto = Object.getPrototypeOf(page);
    const prototypes = [];
    while (proto) {
        prototypes.push(proto.constructor.name);
        proto = Object.getPrototypeOf(proto);
    }
    console.log('原型链:', prototypes.join(' → '));
}


/**
 * 将HTML模板渲染为图片
 * @param {string} htmlTemplate - 包含Handlebars变量的HTML模板
 * @param {Object} data - 模板变量数据
 * @param {Object} options - 渲染选项
 * @returns {Promise<Buffer>} 图片Buffer
 */

async function renderHtmlToImage(htmlTemplate,data = {},options={}){
    // 1. 初始化集群
    const cluster = await initPuppeteerCluster();

    // 2. 模板变量替换（Handlebars）
    const template = Handlebars.compile(htmlTemplate);
    let renderedHtml = template(data);

    // 4. 解析渲染选项
    const {
        width = 1200,          // 图片宽度
        height = 800,          // 图片高度
        format = 'png',        // 图片格式（png/jpeg/webp）
        quality = 90,          // 图片质量（仅jpeg/webp）
        fullPage = false,      // 是否截取整页
        omitBackground = false,// 是否透明背景
        timeout = 15000        // 渲染超时时间
    } = options;
    console.log(options,'options')


    let safeHtml = renderedHtml

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-dev-shm-usage']
    })

    const page = await browser.newPage();
    await page.setContent(safeHtml, { waitUntil: 'networkidle0' });
    const  screenshot = await page.screenshot({
        type: format,
        quality: ['jpeg', 'webp'].includes(format) ? quality : undefined,
        fullPage,
        omitBackground,
        clip: fullPage ? undefined : { x: 0, y: 0, width, height }
    });
    await browser.close();
    return screenshot
}


module.exports = {
    initPuppeteerCluster,
    renderHtmlToImage,
}
