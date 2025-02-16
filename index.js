// 导入express模块
const express = require('express');
// 导入expressd的服务器实例
const app = express();

// 导入 cors 中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())

//在路由之前配置解析token中间件
const expressJWT = require('express-jwt')
const config = require('./config')
//指定哪些接口不需要进行 Token 的身份认证
// app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

const bodyParser = require('body-parser')
// 使用body-parse中间件 要放在路由之前
app.use(bodyParser.json())
// 配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件
app.use(express.urlencoded({ extended: false }))

//静态服务器-存图片
app.use('/public/avatar', express.static('./public/avatar'));

// 导入路由模块
//用户（注册、登录）
const userRouter = require('./router/user.js');
app.use('/api/user', userRouter);
//订单
const orderRouter = require('./router/order.js');
app.use('/api/order', orderRouter);
//消息资讯
const newsRouter = require('./router/news.js');
app.use('/api/news', newsRouter);
//用户反馈
const feedbackRouter = require('./router/feedback.js');
app.use('/api/feedback', feedbackRouter);
//收藏
const collectRouter = require('./router/collect.js');
app.use('/api/collect', collectRouter);
//房子管理
const houseRouter = require('./router/house.js');
app.use('/api/house', houseRouter);

// 导入订单调度器模块
const orderScheduler = require('./utils/scheduler.js');
// 启动订单调度器
orderScheduler.startOrderScheduler();

//错误级别中间件
app.use((err, req, res, next) => {
  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') return res.send({ status: 1, message: '身份认证失败！' })
  //未知的错误
  // 状态描述，判断 err 是 错误对象 还是 字符串
  res.send({ status: 1, message: err instanceof Error ? err.message : err })
})
// 在闲鱼购买（10元），链接↓
// https://www.goofish.com/item?id=798870562481&spm=widle.12011849.Weixin.detail&ut_sk=1.ZEKcXKRsasoDAI2On9uxajZP_12431167_1728823042027.Weixin.detail.798870562481.2490230821

const port = 5000;
app.listen(port, () => console.log(`Server running on port http://127.0.0.1:${port}`));