# Express Template

## 项目概述
Express的基础模板

## 技术栈
- **框架**: Express.js
- **数据库**: MySQL + Sequelize ORM + Sequelize Cli

## 目录结构
```
server/
├── app.js # 应用入口文件
├── config/ # 数据库配置文件
│ └── config.json # 数据库配置文件
├── models/ # 数据库模型
├── migrations/ # 数据库迁移文件
├── seeders/ # 数据库种子文件
├── routes/ # 路由文件
│ └── modules # 用户路由
├── controllers/ # 控制器文件
├── middlewares/ # 中间件文件
├── utils/ # 工具函数
│ └── debug.js # 调试工具
├── validators/ # 校验器
├── views/ # 视图模板
│ └── error.jade # 错误页面
└── README.md # 项目说明文档
```

## 数据库操作
项目中安装了`sequelize-cli`，具体的使用方法查看官方文档[sequelize-cli](https://sequelize.org/docs/v6/getting-started/)
### 初始化数据库
```bash
npx sequelize-cli db:migrate
```
### 生成模型和迁移文件
```bash
npx sequelize-cli model:generate --name [modelName] --attributes [table column]
```

## 路由

### 路由文件目录
```
routes/
├── modules/ # 路由模块
│ └── user.js # 用户路由模块
├── index.js # 路由入口文件
```

### 基础配置
建议将业务逻辑存放到控制器中，路由都存放在```routes/modules```目录下，例如：
```js
// routes/modules/auth.js # 路由模块文件
const express = require('express');
// 控制器
const authController = require("../../controllers/auth");

const router = express.Router();

// 参数校验器
const validator = require("../../middleware/validator");

router.post('/login',validator('authValidator'), authController.login);

module.exports = router;
```

### 中间件配置
#### 全局中间件配置
```js
// routes/index.js # 路由入口文件
const cors = require('cors')
module.exports = (app) => {
  app.use(cors());
}
```
#### 单路由中间件配置
参考上面的基础配置
```js
router.post('/login',validator('authValidator'), authController.login);
```

### 路由参数校验规则设置
+ 在`validators`目录下创建校验器文件  
```
validators/
├── userValidator.js # 用户校验器
```
在路由中使用校验器
```js
// routes/modules/user.js # 用户路由模块
// ...
const validator = require("../../middleware/validator");
router.post('/login',validator('userValidator'), authController.login);
```
