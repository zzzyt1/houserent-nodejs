// 导入mysql模块
const mysql = require('mysql2')

// 创建数据库连接对象
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'zhuang',
    database: 'houserent'
})

// 向外共享db数据库连接对象
module.exports = db

// 在闲鱼购买数据库（10元），链接↓
// https://www.goofish.com/item?id=798870562481&spm=widle.12011849.Weixin.detail&ut_sk=1.ZEKcXKRsasoDAI2On9uxajZP_12431167_1728823042027.Weixin.detail.798870562481.2490230821
